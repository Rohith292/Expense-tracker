import moment from "moment";

/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
    if (!email) return false; // Handle empty or undefined email gracefully
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Extracts initials from a name
 * @param {string} name - The full name to extract initials from
 * @returns {string} - The initials (up to 2 characters) in uppercase
 */
export const getInitials = (name) => {
    if (!name) return ""; // Handle empty or undefined name
    const words = name.trim().split(" "); // Trim extra spaces
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0]; // Get the first letter of up to 2 words
    }

    return initials.toUpperCase(); // Return uppercase initials
};

export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}`
        : formattedInteger;
};


export const prepareExpenseBarChartData=(data=[])=>{
    const chartData=data.map((item)=>({
        category:item?.category,
        amount:item?.amount,
    }));

    return chartData;
}

export const prepareIncomeBarChartData=(data=[])=>{
    const sortedData=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date));

    const chartData=sortedData.map((item)=>({
        month:moment(item?.date).format("Do MMM"),
        amount:item?.amount,
        source:item?.source,
    }));
    console.log("📊 Processed chart data:", chartData);
    return chartData;
}

export const prepareExpenseLineChartData=(data=[])=>{
    const sortedData=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date));
    const chartData=sortedData.map((item)=>({
        month:moment(item?.date).format("Do MMM"),
        amount:item?.amount,
        category:item?.category,
    }));
    console.log("📊 Processed chart data:", chartData);
    return chartData;
}