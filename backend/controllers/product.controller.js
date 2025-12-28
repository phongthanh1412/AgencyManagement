const productService = require("../services/product.service");

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, unit, unitPrice } = req.body;
    const product = await productService.createProduct(name, unit, unitPrice);
    res.status(201).json(product);
  } catch (error) {
    const status = error.message === "Missing product data" ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, unitPrice } = req.body;
    const product = await productService.updateProduct(id, name, unit, unitPrice);
    res.json(product);
  } catch (error) {
    const status =
      error.message === "Invalid product id" ? 400 :
      error.message === "Product not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    res.json(result);
  } catch (error) {
    const status =
      error.message === "Invalid product id" ? 400 :
      error.message === "Product not found" ? 404 : 500;
    res.status(status).json({ message: error.message });
  }
};
