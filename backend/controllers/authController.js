const User=require("../models/User");
const jwt=require("jsonwebtoken");

//generate JWT token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:"10hr"})

};

//register user
exports.registerUser=async(req,res)=>{
    const{fullName, email,password,profileImageUrl}=req.body;
    //validation:check for missing fields
    if(!fullName||!email||!password){
        return res.status(400).json({message:"all fields are required"});
    }

    try{
        //check if email already exists
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"email already in use"});
        }

        // create the user
        const user=await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        res.status(201).json({
            id:user._id,
            user,
            token:generateToken(user._id),
        });
    }catch(err){
        res.status(500).json({
            message:"error registering email", error:err.message
        });
    }
};

//login user
exports.loginUser=async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({message:"all fields are required"});

    }
    try{
        const user =await User.findOne({email});
        if(!user||!(await user.comparePassword(password))){
            return res.status(400).json({message:"invalid credentials"});


        }

        res.status(200).json({
            id:user._id,
            user,
            token: generateToken(user._id),
        });
    }catch(error){
        res.status(500).json({
            message:"error in logging in you",error:error.message
        });
    }
};

//getuserInfo
exports.getUserInfo=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");

        if(!user){
            return res.status(404).json({message:"user cannot be found"});

        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message:"error in finding the user credentials", error:err.message});
    }
};