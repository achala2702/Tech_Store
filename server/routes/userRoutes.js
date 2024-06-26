import express from "express";
const router = express.Router();
import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Product from "../models/products.js";

dotenv.config({ path: "./.env" });

// Create a Nodemailer transporter
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

//registering new user
router.post("/register", async (req, res)=>{
    const {userName, name, password} = req.body;
try{

    const user = await User.findOne({userName});

    if(user){
        return res.status(400).json({message: "User already exists!"})
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new user and save
    const newUser = new User({userName, name, password: hashedPassword});
    await newUser.save();

    res.status(201).json({message:"User registers Successfully!"});

}catch(error){
    res.status(500).json({message: "Server Error", error});
}
});

//login to the store
router.post("/login", async (req, res)=>{
    const {userName, password} = req.body;
    try{

        if(userName=== process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token = jwt.sign({admin:true}, process.env.JWT_SECRET, {expiresIn: "1d"});

            return res.status(200).json({admin: true, message:"Welcome back Admin!", token});
        }

        if(userName===process.env.ADMIN_EMAIL){
            return res.status(400).json({message: "You do not have acess!"})
        }

        const user = await User.findOne({userName});

        if(!user){
            return res.status(400).json({message: "You do not have an account!"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({message: "Wrong Credentials!"});
        }

        //generating a jwt token
        const token = jwt.sign({id: user._id, userName:user.userName, admin:false}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.status(200).json({message: "Successfully login!", token})

    }catch(error){
        res.status(500).json({message: "Server Error", error});
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({userName:email})
  
    if (!user) {
      return res
        .status(400)
        .send({ message: "You dont have an Account!" });
    }
  
    try {
      //generating a jwt token
      const token = jwt.sign(
        {
          email: email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m",
        }
      );
  
      // Send email with the password reset link
      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Password Reset Link",
        text: `${process.env.FRONTEND_URL}/reset-password/${token}`,
      });
  
      res.status(201).send({
        message: "Password reset email sent. Please check your inbox.",
      });
    } catch (error) {
      res.status(500).json({ message: "Error Occured!" });
      console.log(error)
    }
  });
  
  router.put("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      //verifying the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      //hashing the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = await User.findOneAndUpdate({userName:decoded.email}, {password:hashedPassword}, {new:true});
  
      if (result) {
        res
          .status(200)
          .json({ message: "Password Successfully Resest!" });
      } else {
        res.status(400).json({ message: "Error" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error Occured! Try Again" });
    }
  });

//middleware for verify token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

router.get("/get-products", verifyToken, async (req, res)=>{
  const user_id = req.user.id;

  try{
    const user = await User.findById({_id: user_id});

    

    const product_ids = user.purchasedItems.map((item)=>item.product);

    const product_list = await Product.find({ _id: { $in: product_ids } });

    const productCounts = {};
    user.purchasedItems.forEach(item => {
      productCounts[item.product.toString()] = item.count; // Store counts indexed by product ID as strings
    });

    const productsWithCounts = product_list.map(product => ({
      ...product.toObject(),
      count: productCounts[product._id.toString()] || 0
    }));


    console.log(productsWithCounts)



    if(!product_list){
      return res.status(200).json({message: "Empty"})
    }

    res.status(200).json({message: "products available", products: productsWithCounts});

  }catch(err){
    console.log(err);
    res.status(500).json({message: "Error Occured!"})
  }

});


export {router as userRouter};