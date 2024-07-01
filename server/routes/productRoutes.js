import express from "express";
import Product from "../models/products.js";
import User from "../models/users.js";
import { verifyToken } from "./userRoutes.js";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

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
  const user_id = req.user.id;

  try {
    const user = await User.findById({ _id: user_id });

    let product_ids = [];

    for (let item of cart_items) {
      product_ids.push(String(item._id));
    }

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
    let line_items = [];
    for (const item of cart_items) {
      const product = product_list.find(
        (product) => String(product._id) === item._id
      );

      if (!product) {
        return res.status(400).json({ message: "No Product Found!" });
      }

      if (product.stockQuantity < cart_items[item]) {
        return res.status(400).json({ message: "Not enough Stock!" });
      }

      totalPrice += product.price * item.count;

      if (totalPrice >= 1000000) {
        return res
          .status(400)
          .json({ message: "Maximum credits allowed is LKR  999 999" });
      }

      line_items.push({
        price_data: {
          currency: "lkr",
          product_data: {
            name: product.productName,
            description: product.description,
            images: [product.imgUrl],
          },
          unit_amount: product.price * 100,
        },
        quantity: item.count,
      });
    }

    const paymentSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/purchased-items`,
      cancel_url: process.env.FRONTEND_URL,
      line_items: line_items,
      customer_email: user.userName,
      metadata: {
        product_Ids: JSON.stringify(product_ids),
      },
      expand: ['line_items'],
    });

    //sending items to client
    res.status(200).json({ message: "success!", url: paymentSession.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error occured!" });
  }
});
// Endpoint to handle Stripe webhook events
router.post('/webhook', async (req, res) => {
  let event;

  try {
    event = req.body;
  } catch (err) {

    console.log(err)
    return res.status(400).send({WebhookError: `${err.message}`});
  }

  // Handle different event types
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      let product_ids = JSON.parse(session.metadata.product_Ids);

      const user = await User.findOne({ userName: session.customer_email });

      if (!user) {
        console.log('User not found');
        return res.status(400).send('User not found');
      }

      for (let productId of product_ids) {

        const product = await Product.findById(productId);

        if (product) {
          const item = lineItems.data.find(item => item.description === product.productName);
          product.stockQuantity -= item.quantity;
          await product.save();

          const existingPurchase = user.purchasedItems.find(item => item.product.equals(productId));

          if (existingPurchase) {
            // If the user already purchased this product, increment the count
            existingPurchase.count += item.quantity;
          } else {
            // Otherwise, add a new entry with product ID and count
            user.purchasedItems.push({ product: productId, count: item.quantity });
          }
          
      };
    }
    await user.save();

      console.log('Payment was successful:', session);
    } catch (err) {
      console.log(`Error updating user or product data: ${err.message}`);
      return res.status(500).send(`Error updating user or product data: ${err.message}`);
    }
  } else {
    console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
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
