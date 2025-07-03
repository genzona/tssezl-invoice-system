// clearAll.js
import mongoose from "mongoose";
import Invoice from "./models/Invoice.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function clearAllData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/invoice-system");

    // Delete all invoice documents
    const deleted = await Invoice.deleteMany({});
    console.log(`✅ Deleted ${deleted.deletedCount} invoice(s)`);

    // Delete all uploaded files
    const uploadPath = path.join("uploads");
    if (fs.existsSync(uploadPath)) {
      const files = fs.readdirSync(uploadPath);
      files.forEach(file => fs.unlinkSync(path.join(uploadPath, file)));
      console.log(`✅ Deleted ${files.length} uploaded file(s)`);
    } else {
      console.log("⚠️ No uploads directory found.");
    }

    await mongoose.disconnect();
    console.log("✅ Cleanup complete. Database disconnected.");
  } catch (err) {
    console.error("❌ Error clearing data:", err);
  }
}

clearAllData();
