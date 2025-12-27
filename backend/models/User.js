const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["admin", "staff"] }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
