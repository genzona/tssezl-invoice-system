import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:3000",
  "https://invoice-frontend-livid-six.vercel.app"
];

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// ✅ Handle CORS preflight
app.options("*", cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed from this origin"));
    }
  },
  credentials: true,
}));

// ✅ Serve uploaded PDFs
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);

// ✅ Serve frontend React build in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../invoice-frontend/build");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ✅ Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

if (process.env.NODE_ENV !== "production") {
  import('morgan').then(({ default: morgan }) => app.use(morgan('dev')));
}

startServer();
