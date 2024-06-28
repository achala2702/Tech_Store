import express from "express";
import Product from "../models/products.js";
import User from "../models/users.js";
import { verifyToken } from "./userRoutes.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({ path: "./.env" });

const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
  destination: "./images",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.get("/", async (req, res) => {
  const { q } = req.query;

  try {
    const products = await Product.find({});

    if (q) {
      const keys = ["productName", "category"];
      const search = (products) => {
        return products.filter((product) =>
          keys.some((key) =>
            product[key].toLowerCase().includes(q.toLowerCase())
          )
        );
      };
      return res.status(200).json({ products: search(products) });
    } else {
      return res.status(200).json({ products });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: "Error occurred!" });
  }
});

router.post("/checkout", verifyToken, async (req, res) => {
  const { cart_items } = req.body;

  try {
    let user_id;
    const user = await User.findById({ _id: user_id });

    const product_ids = Object.keys(cart_items);

    const product_list = await Product.find({ _id: { $in: product_ids } });

    if (!user) {
      return res.status(400).json({ message: "Invalid user!" });
    }
    if (product_ids.length !== product_list.length) {
      return res
        .status(400)
        .json({ message: "Some Products are out of Stock!" });
    }

    //getting the total price for the quantity
    let totalPrice = 0;
    for (const item in product_ids) {
      const product = product_list.find(
        (product) => String(product._id) === item
      );

      if (!product) {
        return res.status(400).json({ message: "No Product Found!" });
      }

      if (product.stockQuantity < cart_items[item]) {
        return res.status(400).json({ message: "Not enough Stock!" });
      }

      totalPrice += product.price * cart_items[item];

      if (user.available_money < totalPrice) {
        return res.status(400).json({ message: "Not Enough Credits!" });
      }
    }

    //updating available mony and purchased items
    user.available_money -= totalPrice;
    user.purchasedItems.push(...product_ids);

    await user.save();

    //upadating the stock quantity in db
    await Product.updateMany(
      { _id: { $in: product_ids } },
      { $inc: { stockQuantity: -1 } }
    );

    //sending items to client
    res.status(200).json({ purchasedItems: user.purchasedItems });
  } catch (err) {
    res.status(500).json({ message: "error occured!" });
  }
});

router.post(
  "/add-products",
  verifyToken,
  upload.single("productImage"),
  async (req, res) => {
    const { productName, price, description, stockQuantity, category } =
      req.body;
    const token = req.headers.authorization;
    const imageFile = req.file;

    console.log(productName);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.admin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const newProduct = await Product({
        productName,
        price,
        description,
        imgUrl: `${process.env.BACKEND_URL}/images/${imageFile.filename}`,
        stockQuantity,
        category,
      });

      await newProduct.save();

      res.status(201).json({ message: "Product added successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Server Please fill all the Fields!" });
    }
  }
);
router.put(
  "/edit-product",
  verifyToken,
  upload.single("productImage"),
  async (req, res) => {
    const { _id, productName, price, description, stockQuantity, category } =
      req.body;
    const token = req.headers.authorization;
    const imageFile = req.file;

    const updateData = {
      productName,
      price,
      description,
      stockQuantity,
      category,
    };

    // If a new image is uploaded, update the imgUrl
    if (imageFile) {
      updateData.imgUrl = `${process.env.BACKEND_URL}/images/${imageFile.filename}`;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.admin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const result = await Product.findOneAndUpdate(
        { _id: _id },
        { $set: updateData },
        { new: true }
      );

      if (result) {
        res.status(201).json({ message: "Product Updates Successfully!" });
      } else {
        res.status(400).json({ message: "Error" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error!" });
    }
  }
);

router.delete("/delete-product/:_id", verifyToken, async (req, res) => {
  const _id = req.params._id;
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.admin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Product.findByIdAndDelete(_id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "server error!" });
  }
});

export { router as productRouter };
