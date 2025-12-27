const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middlewares/auth.middleware");
const paymentReceiptController = require("../controllers/paymentReceipt.controller");

router.post(
  "/",
  authenticate,
  authorize(["staff"]),
  paymentReceiptController.createPaymentReceipt
);

router.get("/", authenticate, paymentReceiptController.getPaymentReceipts);


module.exports = router;
