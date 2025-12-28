const SystemRegulation = require("../models/SystemRegulation");
const Agency = require("../models/Agency");

class SystemRegulationService {
  async getSystemRegulation() {
    // Only one record exists
    let regulation = await SystemRegulation.findOne();

    // If not exists, create default (first time system runs)
    if (!regulation) {
      regulation = await SystemRegulation.create({
        maxDistrict: 20,
        maxAgencyPerDistrict: 10
      });
    }

    return regulation;
  }

  async updateSystemRegulation(maxDistrict, maxAgencyPerDistrict) {
    if (maxDistrict == null || maxAgencyPerDistrict == null) {
      throw new Error("Missing regulation data");
    }

    // 1. Check current max district
    const maxDistrictInDB = await Agency.aggregate([
      {
        $group: {
          _id: null,
          maxDistrict: { $max: "$district" }
        }
      }
    ]);

    const currentMaxDistrict = maxDistrictInDB[0]?.maxDistrict || 0;

    if (maxDistrict < currentMaxDistrict) {
      throw new Error(
        `maxDistrict must be >= current max district (${currentMaxDistrict})`
      );
    }

    // 2. Check max agencies in one district
    const agenciesPerDistrict = await Agency.aggregate([
      {
        $group: {
          _id: "$district",
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          maxCount: { $max: "$count" }
        }
      }
    ]);

    const currentMaxAgencyPerDistrict = agenciesPerDistrict[0]?.maxCount || 0;

    if (maxAgencyPerDistrict < currentMaxAgencyPerDistrict) {
      throw new Error(
        `maxAgencyPerDistrict must be >= current max agencies per district (${currentMaxAgencyPerDistrict})`
      );
    }

    // 3. Update (upsert to ensure one record always exists)
    const updated = await SystemRegulation.findOneAndUpdate(
      {},
      { maxDistrict, maxAgencyPerDistrict },
      { new: true, upsert: true }
    );

    return updated;
  }
}

module.exports = new SystemRegulationService();
