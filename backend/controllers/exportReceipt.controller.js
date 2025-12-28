const mongoose = require("mongoose");
const Agency = require("../models/Agency");
const Product = require("../models/Product");
const ExportReceipt = require("../models/ExportReceipt");
const DebtHistory = require("../models/DebtHistory");

// Tạo mã phiếu đơn giản: EX-YYYYMMDD-xxxxx
const generateReceiptCode = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 7).toUpperCase();
  return `EX-${y}${m}${day}-${rand}`;
};

exports.createExportReceipt = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    // 1) Validate input cơ bản
    const { agencyId, date, items } = req.body;

    const receiptDate = date ? new Date(date) : new Date();

    if (!agencyId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "agencyId, items are required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(agencyId)) {
      return res.status(400).json({ message: "Invalid agencyId" });
    }
    for (const it of items) {
      if (!mongoose.Types.ObjectId.isValid(it.productId)) {
        return res.status(400).json({ message: "Invalid productId in items" });
      }
      if (!it.quantity || it.quantity <= 0) {
        return res.status(400).json({ message: "quantity must be > 0" });
      }
    }

    // 2) Bắt đầu transaction
    await session.withTransaction(async () => {
      // 3) Load agency
      const agency = await Agency.findById(agencyId).populate("typeId", "maxDebt").session(session);
      if (!agency) {
        throw new Error("Agency not found");
      }

      // 4) Load products liên quan (1 lần, tránh query N lần)
      const productIds = items.map((i) => i.productId);
      const products = await Product.find({ _id: { $in: productIds } }).session(session);

      // Map sản phẩm theo id để lookup nhanh
      const productMap = new Map(products.map((p) => [String(p._id), p]));

      // 5) Build items snapshot + tính tiền
      const builtItems = items.map((it) => {
        const p = productMap.get(String(it.productId));
        if (!p) throw new Error("Product not found in items");

        // unitPrice: ưu tiên staff nhập, nếu không thì lấy từ system regulation (Product.unitPrice)
        const unitPrice = (it.unitPrice !== undefined && it.unitPrice !== null)
          ? Number(it.unitPrice)
          : Number(p.unitPrice);

        if (Number.isNaN(unitPrice) || unitPrice < 0) throw new Error("Invalid unitPrice");

        const quantity = Number(it.quantity);
        const amount = quantity * unitPrice;

        return {
          productId: p._id,
          productName: p.name,
          unit: p.unit,
          quantity,
          unitPrice,
          amount
        };
      });

      const totalAmount = builtItems.reduce((sum, x) => sum + x.amount, 0);

      // 6) check vượt max debt
      // currentDebt là số "nợ hiện tại" (dương), xuất hàng làm nợ tăng.
      // quy ước: export -> change = -totalAmount (theo yêu cầu UI)
      //
      // quy ước:
      // - Agency.currentDebt là "đại lý đang nợ" (dương)
      // - Export làm currentDebt tăng: +totalAmount
      // - Payment làm currentDebt giảm: -amountPaid
      const newDebt = Number(agency.currentDebt) + totalAmount;

      const maxDebt = Number(agency.typeId?.maxDebt) || 0;

      if (maxDebt > 0 && newDebt > maxDebt) {
        throw new Error("Exceed max allowed debt for this agency");
      }

      // 7) Tạo export receipt
      let receiptCode = generateReceiptCode();

      // chống trùng hiếm gặp: thử lại vài lần
      for (let i = 0; i < 3; i++) {
        // eslint-disable-next-line no-await-in-loop
        const exists = await ExportReceipt.findOne({ receiptCode }).session(session);
        if (!exists) break;
        receiptCode = generateReceiptCode();
      }

      const receipt = await ExportReceipt.create(
        [
          {
            receiptCode,
            agencyId: agency._id,
            agencyName: agency.name,
            date: receiptDate,
            items: builtItems,
            totalAmount,
            createdBy: req.user.userId
          }
        ],
        { session }
      );

      // receipt là mảng do create([...])
      const createdReceipt = receipt[0];

      // 8) Update agency debt
      agency.currentDebt = newDebt;
      await agency.save({ session });

      // 9) Insert debt history (EXPORT)
      await DebtHistory.create(
        [
          {
            agencyId: agency._id,
            receiptType: "EXPORT",
            receiptId: createdReceipt._id,
            receiptCode: createdReceipt.receiptCode,
            date: receiptDate,

            // Lưu change theo QUY ƯỚC UI bạn mô tả: export => changes = -totalAmount
            // Nhưng debtAfter vẫn là currentDebt (dương) sau giao dịch
            change: -totalAmount,
            debtAfter: agency.currentDebt
          }
        ],
        { session }
      );

      // 10) Trả response
      res.status(201).json({
        receipt: createdReceipt,
        agency: {
          id: agency._id,
          name: agency.name,
          currentDebt: agency.currentDebt
        }
      });
    });
  } catch (error) {
    // Lỗi "Agency not found" do throw new Error
    // nếu bạn muốn phân biệt 400/404 thì tách theo message
    const msg = error.message || "Server error";
    const status = msg === "Agency not found" ? 404
      : msg.startsWith("Invalid") ? 400
        : msg.includes("Exceed") ? 400
          : 500;

    return res.status(status).json({ message: msg });
  } finally {
    session.endSession();
  }
};

exports.getExportReceipts = async (req, res) => {
  try {
    const receipts = await ExportReceipt.find()
      .select("receiptCode agencyId agencyName date totalAmount items")
      .sort({ date: -1 });

    const result = receipts.map(r => ({
      _id: r._id,
      receiptCode: r.receiptCode,
      agencyId: r.agencyId,
      agencyName: r.agencyName,
      date: r.date,
      totalAmount: r.totalAmount,
      items: r.items.length
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExportReceiptDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid export receipt id" });
    }

    const receipt = await ExportReceipt.findById(id);

    if (!receipt) {
      return res.status(404).json({ message: "Export receipt not found" });
    }

    res.json({
      receiptCode: receipt.receiptCode,
      agencyName: receipt.agencyName,
      date: receipt.date,
      totalAmount: receipt.totalAmount,
      items: receipt.items.map(i => ({
        productName: i.productName,
        unit: i.unit,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        amount: i.amount
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
