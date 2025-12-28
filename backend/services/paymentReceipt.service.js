const mongoose = require("mongoose");
const Agency = require("../models/Agency");
const PaymentReceipt = require("../models/PaymentReceipt");
const DebtHistory = require("../models/DebtHistory");

// Receipt code: PAY-YYYYMMDD-xxxxx
const generateReceiptCode = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 7).toUpperCase();
  return `PAY-${y}${m}${day}-${rand}`;
};

class PaymentReceiptService {
  async createPaymentReceipt(agencyId, date, amountPaid, userId) {
    const receiptDate = date ? new Date(date) : new Date();

    // Validate input
    if (!agencyId || !amountPaid || amountPaid <= 0) {
      throw new Error("Invalid input data");
    }

    if (!mongoose.Types.ObjectId.isValid(agencyId)) {
      throw new Error("Invalid agencyId");
    }

    const session = await mongoose.startSession();

    try {
      let result;

      await session.withTransaction(async () => {
        // Load agency
        const agency = await Agency.findById(agencyId).session(session);
        if (!agency) throw new Error("Agency not found");

        // Check not allow paying more than debt
        if (amountPaid > agency.currentDebt) {
          throw new Error("Amount paid exceeds current debt");
        }

        // Calculate new debt
        const newDebt = agency.currentDebt - amountPaid;

        // Create payment receipt
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
              createdBy: userId
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

              // UI requires payment as positive change
              change: +amountPaid,
              debtAfter: agency.currentDebt
            }
          ],
          { session }
        );

        // Response
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

  async getPaymentReceipts() {
    const receipts = await PaymentReceipt.find()
      .select("receiptCode agencyId agencyName date amountPaid")
      .sort({ date: -1 });

    return receipts;
  }
}

module.exports = new PaymentReceiptService();
