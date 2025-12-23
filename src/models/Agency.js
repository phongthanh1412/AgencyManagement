const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema({
  name: String,
  typeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AgencyType"
  },
  phone: String,
  email: String,
  address: String,
  district: Number,
  receiptDate: Date,
  currentDebt: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Agency", agencySchema);
