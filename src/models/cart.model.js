const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, required: true, default: 1 }
        }
      ],
      default: [] // ← Evita errores cuando el carrito está vacío
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;