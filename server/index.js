import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from "./routes/userRoutes.js";
import { productRouter } from "./routes/productRoutes.js";

dotenv.config({path: './.env'});

const app = express();
const port = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

//user routes
app.use("/user", userRouter);

//product routes
app.use("/product", productRouter);


//connecting mongo_db
mongoose.connect(process.env.MONGO_DB_URL);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
