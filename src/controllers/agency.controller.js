const mongoose = require('mongoose');
const Agency = require("../models/Agency");
const AgencyType = require("../models/AgencyType");
const SystemRegulation = require("../models/SystemRegulation");
const DebtHistory = require("../models/DebtHistory");
const ExportReceipt = require("../models/ExportReceipt");
const PaymentReceipt = require("../models/PaymentReceipt");

exports.createAgency = async (req, res) => {
  const {
    name, typeId, phone, email, address, district, receiptDate
  } = req.body;

  const regulation = await SystemRegulation.findOne();
  if (district > regulation.maxDistrict)
    return res.status(400).json({ message: "District exceeds limit" });

  const count = await Agency.countDocuments({ district });
  if (count >= regulation.maxAgencyPerDistrict)
    return res.status(400).json({ message: "Too many agencies in district" });

  const agency = await Agency.create({
    name,
    typeId,
    phone,
    email,
    address,
    district,
    receiptDate
  });

  res.status(201).json(agency);
};

exports.getAgencies = async (req, res) => {
  try {
    const { name, typeId, district, phone } = req.query;

    const filter = {};

    if (name) filter.name = { $regex: name, $options: "i" };
    if (typeId) filter.typeId = typeId;
    if (district) filter.district = Number(district);
    if (phone) filter.phone = { $regex: phone, $options: "i" };

    const agencies = await Agency.find(filter)
      .populate("typeId", "name maxDebt")
      .sort({ createdAt: -1 });

    // Chuẩn hóa data cho UI
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

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAgencyDetail = async (req, res) => {
  const agency = await Agency.findById(req.params.id)
    .populate("typeId", "name maxDebt");

  if (!agency)
    return res.status(404).json({ message: "Agency not found" });

  res.json(agency);
};

exports.getPaymentReceiptsByAgency = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agency id" });
    }

    const receipts = await PaymentReceipt.find({ agencyId: id })
      .select("receiptCode date amountPaid")
      .sort({ date: -1 });

    res.json(
      receipts.map(r => ({
        receiptCode: r.receiptCode,
        date: r.date,
        amountPaid: r.amountPaid
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExportReceiptsByAgency = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agency id" });
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

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDebtHistoriesByAgency = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agency id" });
    }

    // Lấy lịch sử công nợ
    const histories = await DebtHistory.find({ agencyId: id })
      .select("receiptCode date change debtAfter receiptType")
      .sort({ date: -1 }); // giảm dần theo thời gian

    // Map dữ liệu cho UI
    const result = histories.map(h => ({
      receiptCode: h.receiptCode,
      date: h.date,
      changes: h.change,
      debt: h.debtAfter,
      type: h.receiptType
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAgency = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agency id" });
    }

    const agency = await Agency.findById(id);
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    const {
      name,
      typeId,
      phone,
      email,
      address,
      district,
      receiptDate
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (district !== undefined) updateData.district = district;
    if (receiptDate !== undefined) updateData.receiptDate = receiptDate;

    // Kiểm tra nợ có vượt quá nợ tối đa của new type không
    if (typeId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(typeId)) {
        return res.status(400).json({ message: "Invalid typeId" });
      }

      const newType = await AgencyType.findById(typeId);
      if (!newType) {
        return res.status(400).json({ message: "Agency type not found" });
      }

      if (agency.currentDebt > newType.maxDebt) {
        return res.status(400).json({
          message: "Current debt exceeds max debt of new agency type"
        });
      }

      updateData.typeId = typeId;
    }

    const updated = await Agency.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("typeId", "name maxDebt");

    res.json({
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
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAgency = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid agency id" });
    }

    await session.withTransaction(async () => {
      const agency = await Agency.findById(id).session(session);
      if (!agency) {
        throw new Error("Agency not found");
      }

      // Xóa export receipts
      await ExportReceipt.deleteMany({ agencyId: id }).session(session);

      // Xóa payment receipts
      await PaymentReceipt.deleteMany({ agencyId: id }).session(session);

      // Xóa debt histories
      await DebtHistory.deleteMany({ agencyId: id }).session(session);

      // Xóa agency
      await Agency.deleteOne({ _id: id }).session(session);
    });

    res.json({ message: "Agency and related data deleted successfully" });
  } catch (error) {
    const msg = error.message || "Server error";
    const status = msg === "Agency not found" ? 404 : 500;
    res.status(status).json({ message: msg });
  } finally {
    session.endSession();
  }
};
