import express from "express";
const router = express.Router();
import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//registering new user
router.post("/register", async (req, res)=>{
    const {username, password} = req.body;
try{

    const user = await User.findOne({username});

    if(user){
        return res.status(400).json({message: "User already exists!"})
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating a new user and save
    const newUser = new User({username, password: hashedPassword});
    await newUser.save();

    res.status(201).json({message:"User registers Successfully!"});

}catch(error){
    res.status(500).json({message: "Server Error", error});
}
});

//login to the store
router.post("/login", async (req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({message: "You do not have an account!"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({message: "Wrong Credentials!"});
        }

        //generating a jwt token
        const token = jwt.sign({id: user._id, username:user.username}, process.env.JWT_SECRET)

        res.status(201).json({message: "Successfully login!", token})

    }catch(error){
        res.status(500).json({message: "Server Error", error});
    }
});

//middleware for verify token
export const verifyToken = (req, res, next)=>{
    const token = req.headers.authorization;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (error)=>{
            if(error){
                return res.sendStatus(403);
            }
            next();
        });
    }else{
        return res.status(401).json({ message: "Invalid user" });
    }
}


export {router as userRouter};