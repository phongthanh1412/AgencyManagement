const mongoose = require("mongoose");

const paymentReceiptSchema = new mongoose.Schema(
  {
    receiptCode: { type: String, unique: true, index: true },

    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true
    },
    agencyName: { type: String, required: true }, // snapshot

    date: { type: Date, required: true },
    amountPaid: { type: Number, required: true, min: 1 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentReceipt", paymentReceiptSchema);
