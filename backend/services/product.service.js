const Product = require("../models/Product");
const mongoose = require("mongoose");

class ProductService {
  async getProducts() {
    const products = await Product.find().sort({ createdAt: -1 });
    return products;
  }

  async createProduct(name, unit, unitPrice) {
    if (!name || !unit || unitPrice == null) {
      throw new Error("Missing product data");
    }

    const product = await Product.create({
      name,
      unit,
      unitPrice
    });

    return product;
  }

  async updateProduct(id, name, unit, unitPrice) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product id");
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, unit, unitPrice },
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid product id");
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return { message: "Product deleted successfully" };
  }
}

module.exports = new ProductService();
