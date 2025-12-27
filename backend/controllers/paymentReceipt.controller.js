const mongoose = require("mongoose");
const Agency = require("../models/Agency");
const PaymentReceipt = require("../models/PaymentReceipt");
const DebtHistory = require("../models/DebtHistory");

// Mã phiếu thu: PAY-YYYYMMDD-xxxxx
const generateReceiptCode = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 7).toUpperCase();
  return `PAY-${y}${m}${day}-${rand}`;
};

exports.createPaymentReceipt = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { agencyId, date, amountPaid } = req.body;

    const receiptDate = date ? new Date(date) : new Date();

    // Validate input
    if (!agencyId || !amountPaid || amountPaid <= 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    if (!mongoose.Types.ObjectId.isValid(agencyId)) {
      return res.status(400).json({ message: "Invalid agencyId" });
    }

    await session.withTransaction(async () => {
      // Load agency
      const agency = await Agency.findById(agencyId).session(session);
      if (!agency) throw new Error("Agency not found");

      // Check không cho trả quá nợ (khuyên nên có)
      if (amountPaid > agency.currentDebt) {
        throw new Error("Amount paid exceeds current debt");
      }

      // Tính công nợ mới
      const newDebt = agency.currentDebt - amountPaid;

      // Tạo payment receipt
      let receiptCode = generateReceiptCode();

      for (let i = 0; i < 3; i++) {
        const exists = await PaymentReceipt.findOne({ receiptCode }).session(session);
        if (!exists) break;
        receiptCode = generateReceiptCode();
      }

      const receipt = await PaymentReceipt.create(
        [
          {
            receiptCode,
            agencyId: agency._id,
            agencyName: agency.name,
            date: receiptDate,
            amountPaid,
            createdBy: req.user.userId
          }
        ],
        { session }
      );

      const createdReceipt = receipt[0];

      // Update agency debt
      agency.currentDebt = newDebt;
      await agency.save({ session });

      // Insert debt history (PAYMENT)
      await DebtHistory.create(
        [
          {
            agencyId: agency._id,
            receiptType: "PAYMENT",
            receiptId: createdReceipt._id,
            receiptCode: createdReceipt.receiptCode,
            date: receiptDate,

            // UI yêu cầu payment là change dương
            change: +amountPaid,
            debtAfter: agency.currentDebt
          }
        ],
        { session }
      );

      // Response
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
    const msg = error.message || "Server error";
    const status =
      msg === "Agency not found" ? 404 :
      msg.includes("exceeds") ? 400 :
      500;

    return res.status(status).json({ message: msg });
  } finally {
    session.endSession();
  }
};

exports.getPaymentReceipts = async (req, res) => {
  const receipts = await PaymentReceipt.find()
    .select("receiptCode agencyName date amountPaid")
    .sort({ date: -1 });

  res.json(receipts);
};
