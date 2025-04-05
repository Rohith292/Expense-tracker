import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
    console.log("Transactions in ExpenseTransactions:", transactions); // Debugging log

    // Filter only expenses
    const expenseTransactions = Array.isArray(transactions)
        ? transactions.filter(expense => expense.amount > 0).slice(0, 5)
        : [];

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Expenses</h5>
                <button className='card-btn' onClick={onSeeMore}>
                    See all <LuArrowRight className='text-base' />
                </button>
            </div>

            <div className='mt-6'>
                {expenseTransactions.length > 0 ? (
                    expenseTransactions.map((expense, index) => (
                        <TransactionInfoCard
                            key={expense._id || index}
                            title={expense.category}
                            icon={expense.icon}
                            date={moment(expense.date).format("DD MM YYYY")}
                            amount={expense.amount}
                            type="expense"
                            hideDeleteBtn
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No expenses available.</p>
                )}
            </div>
        </div>
    );
};

export default ExpenseTransactions;
