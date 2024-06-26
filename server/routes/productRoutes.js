import express from "express";
import Product from "../models/products.js";
import User from "../models/users.js";
import { verifyToken } from "./userRoutes.js";

const router = express.Router();

router.get("/", async (req, res)=>{

    try{
        const products = await Product.find({});

        res.status(200).json({products});
    }catch(err){
        res.status(500).json({message:"Error occured!"})
    }
});

router.post("/checkout", verifyToken, async (req, res)=>{

    const {cart_items} = req.body;

    try{
        let user_id;
        const user = await User.findById({_id: user_id});

        const product_ids = Object.keys(cart_items);

        const product_list = await Product.find({_id:{$in: product_ids}});

        if(!user){
            return res.status(400).json({message:"Invalid user!"});
        }
        if(product_ids.length !== product_list.length){
            return res.status(400).json({message:"Some Products are out of Stock!"});
        }

        //getting the total price for the quantity
        let totalPrice = 0;
        for(const item in product_ids){
            const product = product_list.find((product) => String(product._id) === item);

            if(!product){
                return res.status(400).json({message: "No Product Found!"})
            }

            if(product.stockQuantity < cart_items[item]){
                return res.status(400).json({message: "Not enough Stock!"})
            }

            totalPrice += product.price * cart_items[item];

            if (user.available_money < totalPrice){
                return res.status(400).json({message: "Not Enough Credits!"})
            }

        }

        //updating available mony and purchased items 
        user.available_money -= totalPrice;
        user.purchasedItems.push(...product_ids);

        await user.save();

        //upadating the stock quantity in db
        await Product.updateMany({_id:{$in: product_ids}}, {$inc: {stockQuantity: -1}});

        //sending items to client
        res.status(200).json({purchasedItems: user.purchasedItems});

    }catch(err){
        res.status(500).json({message: "error occured!"})
    }
});

router.post("/add-products", verifyToken, async (req, res)=>{
    
})

export {router as productRouter};