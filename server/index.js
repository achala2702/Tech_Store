import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config({path: './.env'});

const app = express();
const port = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

//connecting mongo_db
mongoose.connect(process.env.MONGO_DB_URL);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})
