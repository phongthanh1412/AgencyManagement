const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middlewares/auth.middleware");
const systemRegulationController = require("../controllers/systemRegulation.controller");

// Admin + Staff: xem
router.get(
  "/",
  authenticate,
  systemRegulationController.getSystemRegulation
);

// Admin: update
router.put(
  "/",
  authenticate,
  authorize(["admin"]),
  systemRegulationController.updateSystemRegulation
);

module.exports = router;
