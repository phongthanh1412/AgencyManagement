const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  unit: String,
  unitPrice: Number
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
