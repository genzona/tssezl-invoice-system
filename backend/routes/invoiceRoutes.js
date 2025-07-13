import express from "express";
import jwt from "jsonwebtoken";
import Invoice from "../models/Invoice.js";
import multer from "multer";
import path from "path";
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });
const router = express.Router();

function generateRefCode() {
  return "INV-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post("/upload", upload.array("pdfs", 5), async (req, res) => {
  try {
    const { department, item, amount } = req.body;

    if (!department || !item || !amount || !req.files.length) {
      return res.status(400).json({ error: "Missing fields or files" });
    }

    const pdfFilenames = req.files.map((f) => f.filename);

    // ✅ Add this role map
    const roleMap = {
      HR: "CFO",
      "F&A": "CFO",
      Procurement: "HEAD_PROCUREMENT",
      "M&BD": "HEAD_MBD",
      CS: "HEAD_CS",
      Projects: "HEAD_PROJECTS",
      IT: "HEAD_IT",
      SHE: "HEAD_SHE",
    };

    const currentRole = roleMap[department] || "CFO";

    const newInvoice = new Invoice({
      department,
      item,
      amount,
      pdfs: pdfFilenames,
      referenceCode: generateRefCode(),
      currentRole // 👈 this drives dashboard routing
    });

    await newInvoice.save();
    res.json({ message: "Invoice submitted!", referenceCode: newInvoice.referenceCode });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: "Server error during upload" });
  }
});

router.get("/pending", authenticate, async (req, res) => {
  try {
    const role = req.user.role;
    const invoices = await Invoice.find({ currentRole: role });
    res.json(invoices);
  } catch {
    res.status(500).json({ error: "Failed to fetch pending invoices" });
  }
});

router.post("/decision/:id", authenticate, async (req, res) => {
  try {
    const { decision } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).send("Invoice not found");

    const role = req.user.role;
    const dept = invoice.department;

    if (invoice.currentRole !== role) {
      return res.status(403).send("You are not authorized to approve this invoice.");
    }

    if (decision === "reject") {
      invoice.status = `Rejected by ${role}`;
      invoice.currentRole = null;
    } else {
      // Routing logic for approvals
      if (role.startsWith("HEAD_")) {
        if (["Projects", "IT", "SHE"].includes(dept)) {
          invoice.status = "Pending Chief";
          invoice.currentRole = "CHIEF";
        } else {
          invoice.status = "Pending CFO";
          invoice.currentRole = "CFO";
        }
      } else if (role === "CHIEF") {
        invoice.status = "Pending CFO";
        invoice.currentRole = "CFO";
      } else if (role === "CFO") {
        invoice.status = "Pending MD";
        invoice.currentRole = "MD";
      } else if (role === "MD") {
        invoice.status = "Approved";
        invoice.currentRole = null;
      } else {
        return res.status(403).send("Invalid role in approval flow.");
      }
    }

    await invoice.save();
    res.send("Invoice updated successfully");
  } catch (err) {
    console.error("🔴 Decision error:", err.message);
    res.status(500).json({ error: "Decision update failed" });
  }
});


router.get("/download/excel", authenticate, async (req, res) => {
  try {
    if (req.user.role.toUpperCase() !== "ACCOUNTS") return res.sendStatus(403);
    const invoices = await Invoice.find();
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Invoices");

    ws.addRow(["Ref Code", "Department", "Item", "Amount", "Status", "Uploaded At"]);
    invoices.forEach(inv => {
      ws.addRow([inv.referenceCode, inv.department, inv.item, inv.amount, inv.status, inv.createdAt]);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=invoices.xlsx");
    await wb.xlsx.write(res);
    res.end();
  } catch {
    res.status(500).json({ error: "Excel export failed" });
  }
});

router.get("/all", authenticate, async (req, res) => {
  try {
   if (req.user.role.toUpperCase() !== "ACCOUNTS") return res.status(403).send("Forbidden");
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("🔴 Error fetching all invoices:", err.message);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});


export default router;
 