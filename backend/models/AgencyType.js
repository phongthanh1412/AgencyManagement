const mongoose = require("mongoose");

const agencyTypeSchema = new mongoose.Schema({
  name: String,
  maxDebt: Number
}, { timestamps: true });

module.exports = mongoose.model("AgencyType", agencyTypeSchema);
