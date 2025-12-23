const mongoose = require("mongoose");

const debtHistorySchema = new mongoose.Schema(
  {
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    receiptType: { type: String, enum: ["EXPORT", "PAYMENT"], required: true },
    receiptId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiptCode: { type: String, required: true },
    date: { type: Date, required: true },
    change: { type: Number, required: true },   // export: -, payment: +
    debtAfter: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DebtHistory", debtHistorySchema);
