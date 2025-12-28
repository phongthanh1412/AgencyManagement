const paymentReceiptService = require("../services/paymentReceipt.service");

exports.createPaymentReceipt = async (req, res) => {
  try {
    const { agencyId, date, amountPaid } = req.body;
    const result = await paymentReceiptService.createPaymentReceipt(
      agencyId,
      date,
      amountPaid,
      req.user.userId
    );
    res.status(201).json(result);
  } catch (error) {
    const status =
      error.message === "Agency not found" ? 404 :
      error.message.includes("exceeds") ? 400 :
      error.message === "Invalid input data" ||
      error.message === "Invalid agencyId" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.getPaymentReceipts = async (req, res) => {
  try {
    const receipts = await paymentReceiptService.getPaymentReceipts();
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
