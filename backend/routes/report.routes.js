const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const reportController = require("../controllers/report.controller");

router.get(
  "/revenue",
  authenticate,
  reportController.getRevenueReport
);

router.get(
  "/debt",
  authenticate,
  reportController.getDebtReport
);

module.exports = router;