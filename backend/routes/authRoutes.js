import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFile = path.join(__dirname, "../data/users.json");

router.post("/login", (req, res) => {
  try {
    const { uid, password } = req.body;
    console.log("🟡 Login attempt for UID:", uid);

    if (!uid || !password) {
      return res.status(400).json({ error: "UID and password are required" });
    }

    const rawData = fs.readFileSync(usersFile, "utf8");
    const users = JSON.parse(rawData);
    const user = users.find(u => u.uid === uid && u.password === password);

    if (!user) {
      console.log("🔴 Invalid credentials for UID:", uid);
      return res.status(401).json({ error: "Invalid credentials" });
    }

   const token = jwt.sign(
  { uid: user.uid, role: user.role, department: user.department || null },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);


    console.log("✅ Login successful for:", uid);
    return res.json({ message: "Login successful", token, role: user.role });

  } catch (err) {
    console.error("🔥 Server error during login:", err.message);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
});

export default router;
