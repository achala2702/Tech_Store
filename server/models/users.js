import { Schema, model } from "mongoose";

const UserSchema = Schema(
  {
    //_id: { type: Number, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    available_money: {
      type: Number,
      default: 5000,
    },
    //purchasedItems:{},
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
