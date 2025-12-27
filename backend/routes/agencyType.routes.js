const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middlewares/auth.middleware");
const agencyTypeController = require("../controllers/agencyType.controller");

// Admin + Staff: xem danh sách type
router.get(
  "/",
  authenticate,
  agencyTypeController.getAgencyTypes
);

// Admin: thêm type
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  agencyTypeController.createAgencyType
);

// Admin: sửa type
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  agencyTypeController.updateAgencyType
);

// Admin: xóa type
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  agencyTypeController.deleteAgencyType
);

module.exports = router;
