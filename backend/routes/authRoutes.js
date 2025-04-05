const express=require("express");
const {protect} = require("../middleware/authMiddleWare");
const upload = require("../middleware/uploadMiddleware");

const{
    registerUser,
    loginUser,
    getUserInfo,
}=require("../controllers/authController");

const router=express.Router();

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/getUser",protect,getUserInfo);

router.post("/upload-image",upload.single("image"), (req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"no file uploaded"});
    }
    const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
});
// Logout route
router.post("/logout", (req, res) => {
    // If you ever use sessions/cookies, you can clear them here
    res.status(200).json({ message: "Logged out successfully" });
});

module.exports=router;