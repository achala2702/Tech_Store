import { Schema, model } from "mongoose";

const UserSchema = Schema(
  {
    //_id: { type: Number, required: true },
    name: {type:String, required:true},
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    purchasedItems: [{
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      count: { type: Number, default: 0 }
    }],
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
