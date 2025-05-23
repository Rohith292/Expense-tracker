import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const RecentIncomeWithChart = ({ data, totalIncome }) => {
    const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];
    const [chartData, setChartData] = useState([]);

    const preparedChartData = () => {
        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No income data available for the chart.");
            return;
        }

        const dataArr = data.map((item) => ({
            name: item?.source || "Unknown",
            amount: item?.amount || 0,
            type:'income'
        }));

        setChartData(dataArr);
    };

    useEffect(() => {
        if (data?.length > 0) {
            preparedChartData();
        }
    }, [data]);

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Last 60 Days Income</h5>
            </div>

            <CustomPieChart
                data={chartData}
                label="Total Income"
                totalAmount={`$${totalIncome}`}
                showTextAnchor
                colors={COLORS}
            />
        </div>
    );
}

export default RecentIncomeWithChart;
