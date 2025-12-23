const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middlewares/auth.middleware");
const exportReceiptController = require("../controllers/exportReceipt.controller");

// staff tạo phiếu xuất
router.post(
  "/",
  authenticate,
  authorize(["staff"]),
  exportReceiptController.createExportReceipt
);

// Lấy danh sách phiếu xuất
router.get(
  "/",
  authenticate,
  exportReceiptController.getExportReceipts
);

// Lấy chi tiết phiếu xuất
router.get(
  "/:id",
  authenticate,
  exportReceiptController.getExportReceiptDetail
);


module.exports = router;
