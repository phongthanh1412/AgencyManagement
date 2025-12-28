const reportService = require("../services/report.service");

exports.getRevenueReport = async (req, res) => {
  try {
    const { mode } = req.query;
    const report = await reportService.getRevenueReport(mode);
    res.json(report);
  } catch (error) {
    const status = error.message === "Invalid mode" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.getDebtReport = async (req, res) => {
  try {
    const { mode } = req.query;
    const report = await reportService.getDebtReport(mode);
    res.json(report);
  } catch (error) {
    const status = error.message === "Invalid mode" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};