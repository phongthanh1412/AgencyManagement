const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middlewares/auth.middleware");
const productController = require("../controllers/product.controller");

// Admin + Staff: xem danh sách sản phẩm
router.get(
  "/",
  authenticate,
  productController.getProducts
);

// Admin: thêm sản phẩm
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  productController.createProduct
);

// Admin: cập nhật sản phẩm
router.put(
  "/:id",
  authenticate,
  authorize(["admin"]),
  productController.updateProduct
);

// Admin: xóa sản phẩm
router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  productController.deleteProduct
);

module.exports = router;
