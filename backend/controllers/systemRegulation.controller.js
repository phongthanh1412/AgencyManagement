const systemRegulationService = require("../services/systemRegulation.service");

exports.getSystemRegulation = async (req, res) => {
  try {
    const regulation = await systemRegulationService.getSystemRegulation();
    res.json(regulation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSystemRegulation = async (req, res) => {
  try {
    const { maxDistrict, maxAgencyPerDistrict } = req.body;
    const updated = await systemRegulationService.updateSystemRegulation(
      maxDistrict,
      maxAgencyPerDistrict
    );
    res.json(updated);
  } catch (error) {
    const status = error.message.includes("Missing") || error.message.includes("must be") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};
