const agencyService = require("../services/agency.service");

exports.createAgency = async (req, res) => {
  try {
    const { name, typeId, phone, email, address, district, receiptDate } = req.body;
    const agency = await agencyService.createAgency(
      name, typeId, phone, email, address, district, receiptDate
    );
    res.status(201).json(agency);
  } catch (error) {
    const status = 
      error.message === "District exceeds limit" ||
      error.message === "Too many agencies in district" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.getAgencies = async (req, res) => {
  try {
    const { name, typeId, district, phone } = req.query;
    const result = await agencyService.getAgencies({ name, typeId, district, phone });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAgencyDetail = async (req, res) => {
  try {
    const agency = await agencyService.getAgencyDetail(req.params.id);
    res.json(agency);
  } catch (error) {
    const status = error.message === "Agency not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.getPaymentReceiptsByAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const receipts = await agencyService.getPaymentReceiptsByAgency(id);
    res.json(receipts);
  } catch (error) {
    const status = error.message === "Invalid agency id" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.getExportReceiptsByAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const receipts = await agencyService.getExportReceiptsByAgency(id);
    res.json(receipts);
  } catch (error) {
    const status = error.message === "Invalid agency id" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.getDebtHistoriesByAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await agencyService.getDebtHistoriesByAgency(id);
    res.json(result);
  } catch (error) {
    const status = error.message === "Invalid agency id" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.updateAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await agencyService.updateAgency(id, req.body);
    res.json(updated);
  } catch (error) {
    const status =
      error.message === "Invalid agency id" || 
      error.message === "Invalid typeId" ||
      error.message === "Current debt exceeds max debt of new agency type" ? 400 :
      error.message === "Agency not found" ||
      error.message === "Agency type not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.deleteAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await agencyService.deleteAgency(id);
    res.json(result);
  } catch (error) {
    const status = 
      error.message === "Invalid agency id" ? 400 :
      error.message === "Agency not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
