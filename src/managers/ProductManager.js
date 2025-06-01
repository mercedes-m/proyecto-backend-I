const Product = require('../models/Product');

class ProductManager {
  async addProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async getProducts(filter = {}, options = {}) {
    // filter: filtro de búsqueda (ej: { category: 'Electronics' })
    // options: { limit, skip, sort }
    return await Product.find(filter)
      .limit(options.limit || 10)
      .skip(options.skip || 0)
      .sort(options.sort || {})
      .exec();
  }

  async getProductById(id) {
    return await Product.findById(id).exec();
  }

  async updateProduct(id, updatedProduct) {
    return await Product.findByIdAndUpdate(id, updatedProduct, { new: true }).exec();
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id).exec();
  }
}

module.exports = ProductManager;