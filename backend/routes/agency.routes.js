const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const agencyController = require("../controllers/agency.controller");

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  agencyController.createAgency
);

router.get("/", authenticate, agencyController.getAgencies);

router.get("/:id", authenticate, agencyController.getAgencyDetail);

// update agency
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  agencyController.updateAgency
);

// delete agency (cascade)
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  agencyController.deleteAgency
);

router.get(
  "/:id/payment-receipts",
  authenticate,
  agencyController.getPaymentReceiptsByAgency
);

router.get(
  "/:id/export-receipts",
  authenticate,
  agencyController.getExportReceiptsByAgency
);

router.get(
  "/:id/debt-histories",
  authenticate,
  agencyController.getDebtHistoriesByAgency
);


module.exports = router;
