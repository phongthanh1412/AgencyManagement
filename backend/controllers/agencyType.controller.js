const agencyTypeService = require("../services/agencyType.service");

// GET /api/agency-types
exports.getAgencyTypes = async (req, res) => {
  try {
    const types = await agencyTypeService.getAgencyTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/agency-types
exports.createAgencyType = async (req, res) => {
  try {
    const { name, maxDebt } = req.body;
    const type = await agencyTypeService.createAgencyType(name, maxDebt);
    res.status(201).json(type);
  } catch (error) {
    const status = error.message === "Missing agency type data" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

// PUT /api/agency-types/:id
exports.updateAgencyType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maxDebt } = req.body;
    const type = await agencyTypeService.updateAgencyType(id, name, maxDebt);
    res.json(type);
  } catch (error) {
    const status =
      error.message === "Invalid agency type id" ? 400 :
      error.message === "Agency type not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

// DELETE /api/agency-types/:id
exports.deleteAgencyType = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await agencyTypeService.deleteAgencyType(id);
    res.json(result);
  } catch (error) {
    const status =
      error.message === "Invalid agency type id" ? 400 :
      error.message === "Agency type is in use" ? 400 :
      error.message === "Agency type not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
