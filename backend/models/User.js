import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["CFO", "MD", "Accounts"], required: true },
});

export default mongoose.model("User", userSchema);
