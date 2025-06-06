const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnails: { type: [String], default: [] }, // arreglo de urls
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  category: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;