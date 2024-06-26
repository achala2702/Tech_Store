import { Schema, model } from "mongoose";

const productSchema = Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true, min:[1, "Price should be above 1"] },
    description: { type: String, required: true },
    imgUrl: { type: String, required: true },
    stockQuantity: { type: Number, required: true, min:[0, "Quantitty should not less than 0"] },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

export default Product;
