const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate userId and convert it to ObjectId
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const userObjectId = new Types.ObjectId(userId);

        // Fetch total income and expense
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        // Get income transactions in the last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }, // 60 days ago
        }).sort({ date: -1 });

        // Calculate total income for the last 60 days
        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Get expense transactions for the last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days ago
        }).sort({ date: -1 });

        // Debugging log for expense transactions
        console.log("Last 30 Days Expense Transactions:", last30DaysExpenseTransactions);

        // Calculate total expense for the last 30 days
        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        // Fetch last 5 transactions (income + expense)
        const lastTransactions = [
            ...(
                await Income.find({ userId: userObjectId })
                    .sort({ date: -1 })
                    .limit(5)
            ).map((txn) => {
                return {
                    ...txn.toObject(), // Convert Mongoose document to plain object
                    type: "income",
                };
            }),
            ...(
                await Expense.find({ userId: userObjectId })
                    .sort({ date: -1 })
                    .limit(5)
            ).map((txn) => {
                return {
                    ...txn.toObject(),
                    type: "expense",
                };
            }),
        ].sort((a, b) => b.date - a.date);
        // Sort by date descending

        // Final API response
        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: {
                total: expenseLast30Days || 0, // Fallback to 0
                transactions: last30DaysExpenseTransactions || [], // Fallback to empty array
            },
            last60DaysIncome: {
                total: incomeLast60Days || 0, // Fallback to 0
                transactions: last60DaysIncomeTransactions || [], // Fallback to empty array
            },
            recentTransactions: lastTransactions || [], // Fallback to empty array
        });
    } catch (err) {
        console.error("Error in getDashboardData:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
