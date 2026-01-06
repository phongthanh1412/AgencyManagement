const ExportReceipt = require("../models/ExportReceipt");
const Agency = require("../models/Agency");
const DebtHistory = require("../models/DebtHistory");

class ReportService {
  async getRevenueReport(mode) {
    // Determine time range
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
      throw new Error("Invalid mode");
    }

    // Match by time
    const matchStage = {
      date: { $gte: startDate, $lte: now }
    };

    // Group by agency
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

    // Calculate total
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

    // Normalize data for UI
    const detailedBreakdown = groupByAgency.map(a => ({
      agencyName: a.agencyName,
      numberOfExportSlips: a.exportCount,
      totalValue: a.totalRevenue,
      percentage:
        totalRevenue === 0
          ? 0
          : Number(((a.totalRevenue / totalRevenue) * 100).toFixed(2))
    }));

    return {
      totalRevenue,
      totalExportReceipts,
      avgPerReceipt,
      revenueByAgency: groupByAgency.map(a => ({
        agencyName: a.agencyName,
        totalRevenue: a.totalRevenue
      })),
      detailedBreakdown
    };
  }

  async getDebtReport(mode, customStartDate = null, customEndDate = null) {
    // Determine filter time range
    const now = new Date();
    let startDate, endDate;

    // If custom dates provided, use them
    if (customStartDate && customEndDate) {
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
      // Set endDate to end of day
      endDate.setHours(23, 59, 59, 999);
    } else if (mode === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = now;
    } else if (mode === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
    } else if (mode === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
    } else {
      throw new Error("Invalid mode");
    }

    // Load agencies (with type name)
    const agencies = await Agency.find().populate("typeId", "name maxDebt");

    // Calculate beginning debt for each agency:
    // Get latest DebtHistory record before or equal to startDate
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

    // Calculate ending debt for each agency:
    // Get latest DebtHistory record before or equal to endDate
    const endingDebtsAgg = await DebtHistory.aggregate([
      { $match: { date: { $lte: endDate } } },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$agencyId",
          endingDebt: { $first: "$debtAfter" }
        }
      }
    ]);

    const endingDebtMap = new Map(
      endingDebtsAgg.map(x => [String(x._id), x.endingDebt])
    );

    // Calculate changes in filter range for each agency
    const changesAgg = await DebtHistory.aggregate([
      { $match: { date: { $gt: startDate, $lte: endDate } } },
      {
        $group: {
          _id: "$agencyId",
          changes: { $sum: "$change" }
        }
      }
    ]);

    const changesMap = new Map(
      changesAgg.map(x => [String(x._id), -x.changes]) // reverse sign for UI debt report
    );

    // Aggregate report
    let totalDebt = 0;
    let highRiskCount = 0;
    let totalChanges = 0;
    let totalBeginningDebt = 0;
    let totalEndingDebt = 0;

    const agenciesReport = agencies.map(a => {
      const id = String(a._id);

      const beginningDebt = beginningDebtMap.get(id) || 0;
      const endingDebt = endingDebtMap.get(id) || beginningDebt;
      const changes = changesMap.get(id) || 0;

      totalBeginningDebt += beginningDebt;
      totalEndingDebt += endingDebt;
      totalChanges += changes;

      // status based on endingDebt / maxAllowedDebt
      const maxDebt = Number(a.typeId?.maxDebt) || 0;

      const ratio = maxDebt > 0 ? endingDebt / maxDebt : 0;

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

    // Sort table by endingDebt descending for better view
    agenciesReport.sort((x, y) => (y.endingDebt || 0) - (x.endingDebt || 0));

    return {
      mode,
      startDate,
      endDate,
      totalDebt,
      highRiskCount,
      totalChanges,
      totalBeginningDebt,
      totalEndingDebt,
      agencies: agenciesReport
    };
  }
}

module.exports = new ReportService();
