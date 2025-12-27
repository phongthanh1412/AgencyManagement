const mongoose = require("mongoose");

const systemRegulationSchema = new mongoose.Schema({
  maxDistrict: Number,
  maxAgencyPerDistrict: Number
}, { timestamps: true });

module.exports = mongoose.model("SystemRegulation", systemRegulationSchema);
