const User= require("../models/User");
const Income= require("../models/Income");
const xlsx = require("xlsx");
const fs=require("fs");


//add income
exports.addIncome=async(req,res)=>{
    const userId=req.user.id;

    try{
        const {icon, source,amount,date}=req.body;

        //validation:check for missing fields
        if(!source||!amount||!date){
            return res.status(400).json({message:"all fields are required"});

        }

        const newIncome=new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(200).json(newIncome);

    }
    catch(err){
        res.status(500).json({message:"server error"});
    }
}

//get all income
exports.getAllIncome=async(req,res)=>{
    const userId=req.user.id;

    try{
        const income= await Income.find({userId}).sort({date:-1});
        res.json(income);
    }catch(err){
        res.status(500).json({message:"server error"});
    }
}
//download excel format of income


exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare the data with formatted date
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }), // Format: "04 Apr 2025"
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const filePath = "income_details.xlsx";
    xlsx.writeFile(wb, filePath);

    // Send file and clean up
    res.download(filePath, () => {
      fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error("Error downloading income Excel:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//delete income
exports.deleteIncome=async(req,res)=>{
    const userId=req.user.id;

    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({message:"Income deleted successfully"});
    }catch(err){
        res.status(500).json({message:"server error"});
    }
};