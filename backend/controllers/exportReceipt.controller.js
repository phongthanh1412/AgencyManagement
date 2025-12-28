const exportReceiptService = require("../services/exportReceipt.service");

exports.createExportReceipt = async (req, res) => {
  try {
    const { agencyId, date, items } = req.body;
    const result = await exportReceiptService.createExportReceipt(
      agencyId,
      date,
      items,
      req.user.userId
    );
    res.status(201).json(result);
  } catch (error) {
    const status =
      error.message === "Agency not found" ? 404 :
      error.message.startsWith("Invalid") ? 400 :
      error.message.includes("Exceed") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.getExportReceipts = async (req, res) => {
  try {
    const result = await exportReceiptService.getExportReceipts();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExportReceiptDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await exportReceiptService.getExportReceiptDetail(id);
    res.json(receipt);
  } catch (error) {
    const status =
      error.message === "Invalid export receipt id" ? 400 :
      error.message === "Export receipt not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
