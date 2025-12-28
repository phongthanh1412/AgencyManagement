const AgencyType = require("../models/AgencyType");
const Agency = require("../models/Agency");
const mongoose = require("mongoose");

class AgencyTypeService {
  async getAgencyTypes() {
    const types = await AgencyType.find().sort({ createdAt: -1 });
    return types;
  }

  async createAgencyType(name, maxDebt) {
    if (!name || maxDebt == null) {
      throw new Error("Missing agency type data");
    }

    const type = await AgencyType.create({ name, maxDebt });
    return type;
  }

  async updateAgencyType(id, name, maxDebt) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid agency type id");
    }

    const type = await AgencyType.findByIdAndUpdate(
      id,
      { name, maxDebt },
      { new: true }
    );

    if (!type) {
      throw new Error("Agency type not found");
    }

    return type;
  }

  async deleteAgencyType(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid agency type id");
    }

    // Check if being used
    const used = await Agency.exists({ typeId: id });
    if (used) {
      throw new Error("Agency type is in use");
    }

    const type = await AgencyType.findByIdAndDelete(id);

    if (!type) {
      throw new Error("Agency type not found");
    }

    return { message: "Agency type deleted successfully" };
  }
}

module.exports = new AgencyTypeService();
