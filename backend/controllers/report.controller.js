const ExportReceipt = require("../models/ExportReceipt");
const Agency = require("../models/Agency");
const DebtHistory = require("../models/DebtHistory");

exports.getRevenueReport = async (req, res) => {
  try {
    const { mode } = req.query;

    // Xác định khoảng thời gian
    const now = new Date();
    let startDate;

    if (mode === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (mode === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (mode === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      return res.status(400).json({ message: "Invalid mode" });
    }

    // Match theo thời gian
    const matchStage = {
      date: { $gte: startDate, $lte: now }
    };

    // Group theo agency
    const groupByAgency = await ExportReceipt.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$agencyId",
          agencyName: { $first: "$agencyName" },
          totalRevenue: { $sum: "$totalAmount" },
          exportCount: { $sum: 1 }
        }
      }
    ]);

    // Tính tổng
    const totalRevenue = groupByAgency.reduce(
      (sum, a) => sum + a.totalRevenue,
      0
    );

    const totalExportReceipts = groupByAgency.reduce(
      (sum, a) => sum + a.exportCount,
      0
    );

    const avgPerReceipt =
      totalExportReceipts === 0
        ? 0
        : Math.round(totalRevenue / totalExportReceipts);

    // Chuẩn hóa data cho UI
    const detailedBreakdown = groupByAgency.map(a => ({
      agencyName: a.agencyName,
      numberOfExportSlips: a.exportCount,
      totalValue: a.totalRevenue,
      percentage:
        totalRevenue === 0
          ? 0
          : Number(((a.totalRevenue / totalRevenue) * 100).toFixed(2))
    }));

    res.json({
      totalRevenue,
      totalExportReceipts,
      avgPerReceipt,
      revenueByAgency: groupByAgency.map(a => ({
        agencyName: a.agencyName,
        totalRevenue: a.totalRevenue
      })),
      detailedBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDebtReport = async (req, res) => {
  try {
    const { mode } = req.query;

    // Xác định khoảng thời gian lọc
    const now = new Date();
    let startDate;

    if (mode === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (mode === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (mode === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      return res.status(400).json({ message: "Invalid mode" });
    }

    // Load agencies (có type name)
    const agencies = await Agency.find().populate("typeId", "name maxDebt");

    // Tính beginning debt cho từng agency:
    // Lấy record DebtHistory gần nhất trước hoặc bằng startDate:
    // match < startDate -> sort date desc -> group by agencyId -> first(debtAfter)
    const beginningDebtsAgg = await DebtHistory.aggregate([
      { $match: { date: { $lte: startDate } } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$agencyId",
          beginningDebt: { $first: "$debtAfter" }
        }
      }
    ]);

    const beginningDebtMap = new Map(
      beginningDebtsAgg.map(x => [String(x._id), x.beginningDebt])
    );

    // Tính changes trong khoảng filter cho từng agency
    const changesAgg = await DebtHistory.aggregate([
      { $match: { date: { $gt: startDate, $lte: now } } },
      {
        $group: {
          _id: "$agencyId",
          changes: { $sum: "$change" }
        }
      }
    ]);

    const changesMap = new Map(
      changesAgg.map(x => [String(x._id), -x.changes])  // đảo dấu để phù hợp UI debt report
    );

    // Tổng hợp report
    let totalDebt = 0;
    let highRiskCount = 0;
    let totalChanges = 0;
    let totalBeginningDebt = 0;
    let totalEndingDebt = 0;

    const agenciesReport = agencies.map(a => {
      const id = String(a._id);

      const changes = changesMap.get(id) || 0;
      totalChanges += changes;

      const beginningDebt =
        beginningDebtMap.has(id)
          ? beginningDebtMap.get(id)
          : (Number(a.currentDebt) - changes);

      const endingDebt = beginningDebt + changes;

      totalBeginningDebt += beginningDebt;
      totalEndingDebt += endingDebt;

      // status dựa vào currentDebt / maxAllowedDebt (không phụ thuộc filter)
      const maxDebt = Number(a.typeId?.maxDebt) || 0;

      const ratio = maxDebt > 0 ? a.currentDebt / maxDebt : 0;

      let status = "normal";
      if (ratio >= 0.9) status = "high risk";
      else if (ratio >= 0.7) status = "warning";

      if (status === "high risk") highRiskCount++;

      return {
        agencyId: a._id,
        agencyName: a.name,
        type: a.typeId?.name || null,
        beginningDebt,
        changes,
        endingDebt,
        status
      };
    });

    totalDebt = totalEndingDebt;

    // sort bảng theo endingDebt giảm dần cho dễ nhìn
    agenciesReport.sort((x, y) => (y.endingDebt || 0) - (x.endingDebt || 0));

    res.json({
      mode,
      startDate,
      endDate: now,
      totalDebt,
      highRiskCount,
      totalChanges,
      totalBeginningDebt,
      totalEndingDebt,
      agencies: agenciesReport
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};