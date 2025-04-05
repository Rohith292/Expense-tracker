import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS=["#875CF5","#FA2C37","#FF6900"];

const FinanceOverview = ({totalBalance,totalIncome,totalExpense}) => {
    const balanceData=[
        {name:"total balance", amount:totalBalance},
        {name:"total expense",amount:totalExpense},
        {name:"total income", amount:totalIncome},
    ];
  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Financial Overview</h5>
        </div>

        <CustomPieChart 
        data={balanceData}
        label="total balance"
        totalAmount={`$${totalBalance}`}
        colors={COLORS}
        showTextAnchor
        />
    </div>
  )
}

export default FinanceOverview