const mongoose = require("mongoose");
const Agency = require("../models/Agency");
const Product = require("../models/Product");
const ExportReceipt = require("../models/ExportReceipt");
const DebtHistory = require("../models/DebtHistory");

// Generate simple receipt code: EX-YYYYMMDD-xxxxx
const generateReceiptCode = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 7).toUpperCase();
  return `EX-${y}${m}${day}-${rand}`;
};

class ExportReceiptService {
  async createExportReceipt(agencyId, date, items, userId) {
    // 1) Basic input validation
    const receiptDate = date ? new Date(date) : new Date();

    if (!agencyId || !Array.isArray(items) || items.length === 0) {
      throw new Error("agencyId, items are required");
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(agencyId)) {
      throw new Error("Invalid agencyId");
    }
    for (const it of items) {
      if (!mongoose.Types.ObjectId.isValid(it.productId)) {
        throw new Error("Invalid productId in items");
      }
      if (!it.quantity || it.quantity <= 0) {
        throw new Error("quantity must be > 0");
      }
    }

    const session = await mongoose.startSession();

    try {
      let result;
      
      await session.withTransaction(async () => {
        // 3) Load agency
        const agency = await Agency.findById(agencyId)
          .populate("typeId", "maxDebt")
          .session(session);
        if (!agency) {
          throw new Error("Agency not found");
        }

        // 4) Load related products (once, avoid N queries)
        const productIds = items.map((i) => i.productId);
        const products = await Product.find({ _id: { $in: productIds } }).session(session);

        // Map products by id for quick lookup
        const productMap = new Map(products.map((p) => [String(p._id), p]));

        // 5) Build items snapshot + calculate total
        const builtItems = items.map((it) => {
          const p = productMap.get(String(it.productId));
          if (!p) throw new Error("Product not found in items");

          // unitPrice: prefer staff input, otherwise use system regulation (Product.unitPrice)
          const unitPrice =
            it.unitPrice !== undefined && it.unitPrice !== null
              ? Number(it.unitPrice)
              : Number(p.unitPrice);

          if (Number.isNaN(unitPrice) || unitPrice < 0)
            throw new Error("Invalid unitPrice");

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

        // 6) Check exceeds max debt
        // currentDebt is "current debt" (positive), export increases debt
        const newDebt = Number(agency.currentDebt) + totalAmount;

        const maxDebt = Number(agency.typeId?.maxDebt) || 0;

        if (maxDebt > 0 && newDebt > maxDebt) {
          throw new Error("Exceed max allowed debt for this agency");
        }

        // 7) Create export receipt
        let receiptCode = generateReceiptCode();

        // Prevent rare duplicate: try again a few times
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
              createdBy: userId
            }
          ],
          { session }
        );

        // receipt is array due to create([...])
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

              // Save change according to UI convention: export => changes = -totalAmount
              // But debtAfter is still currentDebt (positive) after transaction
              change: -totalAmount,
              debtAfter: agency.currentDebt
            }
          ],
          { session }
        );

        // 10) Set result
        result = {
          receipt: createdReceipt,
          agency: {
            id: agency._id,
            name: agency.name,
            currentDebt: agency.currentDebt
          }
        };
      });

      return result;
    } finally {
      session.endSession();
    }
  }

  async getExportReceipts() {
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

    return result;
  }

  async getExportReceiptDetail(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid export receipt id");
    }

    const receipt = await ExportReceipt.findById(id);

    if (!receipt) {
      throw new Error("Export receipt not found");
    }

    return {
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
    };
  }
}

module.exports = new ExportReceiptService();
