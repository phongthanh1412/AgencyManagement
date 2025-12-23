const AgencyType = require("../models/AgencyType");
const Agency = require("../models/Agency");
const mongoose = require("mongoose");

// GET /api/agency-types
exports.getAgencyTypes = async (req, res) => {
  try {
    const types = await AgencyType.find().sort({ createdAt: -1 });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/agency-types
exports.createAgencyType = async (req, res) => {
  try {
    const { name, maxDebt } = req.body;

    if (!name || maxDebt == null) {
      return res.status(400).json({ message: "Missing agency type data" });
    }

    const type = await AgencyType.create({ name, maxDebt });
    res.status(201).json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/agency-types/:id
exports.updateAgencyType = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agency type id" });
    }

    const { name, maxDebt } = req.body;

    const type = await AgencyType.findByIdAndUpdate(
      id,
      { name, maxDebt },
      { new: true }
    );

    if (!type) {
      return res.status(404).json({ message: "Agency type not found" });
    }

    res.json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/agency-types/:id
exports.deleteAgencyType = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agency type id" });
    }

    // Check đang được dùng hay không
    const used = await Agency.exists({ typeId: id });
    if (used) {
      return res.status(400).json({ message: "Agency type is in use" });
    }

    const type = await AgencyType.findByIdAndDelete(id);

    if (!type) {
      return res.status(404).json({ message: "Agency type not found" });
    }

    res.json({ message: "Agency type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
