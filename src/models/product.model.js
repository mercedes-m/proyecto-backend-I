const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnails: { type: [String], default: [] }, // arreglo de URLs
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
    category: { type: String, required: true }
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    versionKey: false // elimina el campo __v que Mongoose agrega por defecto
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;