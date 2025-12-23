const mongoose = require("mongoose");

const exportReceiptSchema = new mongoose.Schema(
  {
    receiptCode: { type: String, unique: true, index: true },
    agencyId: { type: mongoose.Schema.Types.ObjectId, ref: "Agency", required: true },
    agencyName: { type: String, required: true }, // snapshot

    date: { type: Date, required: true },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true }, // snapshot
        unit: { type: String, required: true },        // snapshot
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        amount: { type: Number, required: true, min: 0 }
      }
    ],

    totalAmount: { type: Number, required: true, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExportReceipt", exportReceiptSchema);
