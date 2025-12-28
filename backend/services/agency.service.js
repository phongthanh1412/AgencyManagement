const mongoose = require("mongoose");
const Agency = require("../models/Agency");
const AgencyType = require("../models/AgencyType");
const SystemRegulation = require("../models/SystemRegulation");
const DebtHistory = require("../models/DebtHistory");
const ExportReceipt = require("../models/ExportReceipt");
const PaymentReceipt = require("../models/PaymentReceipt");

class AgencyService {
  async createAgency(name, typeId, phone, email, address, district, receiptDate) {
    const regulation = await SystemRegulation.findOne();
    if (district > regulation.maxDistrict) {
      throw new Error("District exceeds limit");
    }

    const count = await Agency.countDocuments({ district });
    if (count >= regulation.maxAgencyPerDistrict) {
      throw new Error("Too many agencies in district");
    }

    const agency = await Agency.create({
      name,
      typeId,
      phone,
      email,
      address,
      district,
      receiptDate
    });

    return agency;
  }

  async getAgencies(filters = {}) {
    const filter = {};

    if (filters.name) filter.name = { $regex: filters.name, $options: "i" };
    if (filters.typeId) filter.typeId = filters.typeId;
    if (filters.district) filter.district = Number(filters.district);
    if (filters.phone) filter.phone = { $regex: filters.phone, $options: "i" };

    const agencies = await Agency.find(filter)
      .populate("typeId", "name maxDebt")
      .sort({ createdAt: -1 });

    // Normalize data for UI
    const result = agencies.map(a => ({
      _id: a._id,
      name: a.name,
      type: a.typeId?.name || null,
      district: a.district,
      phone: a.phone,
      currentDebt: a.currentDebt,
      maxDebt: a.typeId?.maxDebt || 0,
      receiptDate: a.receiptDate
    }));

    return result;
  }

  async getAgencyDetail(id) {
    const agency = await Agency.findById(id).populate("typeId", "name maxDebt");

    if (!agency) {
      throw new Error("Agency not found");
    }

    return agency;
  }

  async getPaymentReceiptsByAgency(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid agency id");
    }

    const receipts = await PaymentReceipt.find({ agencyId: id })
      .select("receiptCode date amountPaid")
      .sort({ date: -1 });

    return receipts.map(r => ({
      receiptCode: r.receiptCode,
      date: r.date,
      amountPaid: r.amountPaid
    }));
  }

  async getExportReceiptsByAgency(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid agency id");
    }

    const receipts = await ExportReceipt.find({ agencyId: id })
      .select("receiptCode date totalAmount items")
      .sort({ date: -1 });

    const result = receipts.map(r => ({
      receiptCode: r.receiptCode,
      date: r.date,
      totalAmount: r.totalAmount,
      items: r.items.length
    }));

    return result;
  }

  async getDebtHistoriesByAgency(id) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid agency id");
    }

    // Get debt history
    const histories = await DebtHistory.find({ agencyId: id })
      .select("receiptCode date change debtAfter receiptType")
      .sort({ date: -1 }); // descending by time

    // Map data for UI
    const result = histories.map(h => ({
      receiptCode: h.receiptCode,
      date: h.date,
      changes: h.change,
      debt: h.debtAfter,
      type: h.receiptType
    }));

    return result;
  }

  async updateAgency(id, updateData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid agency id");
    }

    const agency = await Agency.findById(id);
    if (!agency) {
      throw new Error("Agency not found");
    }

    const {
      name,
      typeId,
      phone,
      email,
      address,
      district,
      receiptDate
    } = updateData;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (address !== undefined) updates.address = address;
    if (district !== undefined) updates.district = district;
    if (receiptDate !== undefined) updates.receiptDate = receiptDate;

    // Check if debt exceeds max debt of new type
    if (typeId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(typeId)) {
        throw new Error("Invalid typeId");
      }

      const newType = await AgencyType.findById(typeId);
      if (!newType) {
        throw new Error("Agency type not found");
      }

      if (agency.currentDebt > newType.maxDebt) {
        throw new Error("Current debt exceeds max debt of new agency type");
      }

      updates.typeId = typeId;
    }

    const updated = await Agency.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate("typeId", "name maxDebt");

    return {
      _id: updated._id,
      name: updated.name,
      type: updated.typeId?.name || null,
      district: updated.district,
      phone: updated.phone,
      email: updated.email,
      address: updated.address,
      receiptDate: updated.receiptDate,
      currentDebt: updated.currentDebt,
      maxDebt: updated.typeId?.maxDebt || 0
    };
  }

  async deleteAgency(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid agency id");
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const agency = await Agency.findById(id).session(session);
        if (!agency) {
          throw new Error("Agency not found");
        }

        // Delete export receipts
        await ExportReceipt.deleteMany({ agencyId: id }).session(session);

        // Delete payment receipts
        await PaymentReceipt.deleteMany({ agencyId: id }).session(session);

        // Delete debt histories
        await DebtHistory.deleteMany({ agencyId: id }).session(session);

        // Delete agency
        await Agency.deleteOne({ _id: id }).session(session);
      });

      return { message: "Agency and related data deleted successfully" };
    } finally {
      session.endSession();
    }
  }
}

module.exports = new AgencyService();
