const User= require("../models/User");
const Expense= require("../models/Expense");
const xlsx = require("xlsx");
const fs=require("fs");

//add expense
exports.addExpense=async(req,res)=>{
    const userId=req.user.id;

    try{
        const {icon,category,amount,date}=req.body;

        //validation:check for missing fields
        if(!category||!amount||!date){
            return res.status(400).json({message:"all fields are required"});

        }

        const newExpense=new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    }
    catch(err){
        res.status(500).json({message:"server error"});
    }
}

//get all expense
exports.getAllExpense=async(req,res)=>{
    const userId=req.user.id;

    try{
        const expense= await Expense.find({userId}).sort({date:-1});
        res.json(expense);
    }catch(err){
        res.status(500).json({message:"server error"});
    }
}
//download excel format of expense


exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare the data with formatted date (best user readability)
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }), // Format like "04 Apr 2025"
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");

    const filePath = "expense_details.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath, () => {
      // Optionally delete the file after download
      fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error("Error downloading Excel:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//delete expense
exports.deleteExpense=async(req,res)=>{
    const userId=req.user.id;

    try{
        await Expense.findByIdAndDelete(req.params.id);
        res.json({message:"Income deleted successfully"});
    }catch(err){
        res.status(500).json({message:"server error"});
    }
};