import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  department: String,
  item: String,
  amount: Number,
  pdfs: [String],
  referenceCode: String,
  status: {
    type: String,
    default: function () {
      const dept = this.department;
      if (["HR", "F&A"].includes(dept)) return "Pending CFO";
      return "Pending Head";
    }
  },
  currentRole: {
    type: String,
    default: function () {
      const dept = this.department;
      if (["HR", "F&A"].includes(dept)) return "CFO";
      return "Head";
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Invoice", invoiceSchema);
