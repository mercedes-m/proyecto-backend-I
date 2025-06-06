const Product = require('../models/product.model');

class ProductManager {
  async addProduct(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async getProducts() {
    return await Product.find().lean();
  }

 async getPaginatedProducts({ limit = 10, page = 1, sort, query }) {
  const filter = {};

  if (query) {
    filter.$or = [
      { category: query },
      { status: query === 'available' ? true : query === 'unavailable' ? false : undefined }
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
    lean: true
  };

  const result = await Product.paginate(filter, options);

  const baseParams = `limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`;

  return {
    status: 'success',
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&${baseParams}` : null,
    nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&${baseParams}` : null
  };
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