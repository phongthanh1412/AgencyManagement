const SystemRegulation = require("../models/SystemRegulation");
const Agency = require("../models/Agency");

exports.getSystemRegulation = async (req, res) => {
  try {
    // Chỉ có 1 bản ghi
    let regulation = await SystemRegulation.findOne();

    // Nếu chưa có thì tạo mặc định (lần đầu chạy hệ thống)
    if (!regulation) {
      regulation = await SystemRegulation.create({
        maxDistrict: 20,
        maxAgencyPerDistrict: 10
      });
    }

    res.json(regulation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSystemRegulation = async (req, res) => {
  try {
    const { maxDistrict, maxAgencyPerDistrict } = req.body;

    if (maxDistrict == null || maxAgencyPerDistrict == null) {
      return res.status(400).json({ message: "Missing regulation data" });
    }

    // 1. Kiểm tra district hiện tại lớn nhất
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
      return res.status(400).json({
        message: `maxDistrict must be >= current max district (${currentMaxDistrict})`
      });
    }

    // 2. Kiểm tra số agency nhiều nhất trong 1 district
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
      return res.status(400).json({
        message: `maxAgencyPerDistrict must be >= current max agencies per district (${currentMaxAgencyPerDistrict})`
      });
    }

    // 3. Update (upsert để đảm bảo luôn có 1 bản ghi)
    const updated = await SystemRegulation.findOneAndUpdate(
      {},
      { maxDistrict, maxAgencyPerDistrict },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
