const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartManager {
  // Obtener todos los carritos con productos
  async getCarts() {
    return await Cart.find().populate('products.product');
  }

  // Crear carrito vacío
  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  // Obtener un carrito por ID con productos
  async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  // Agregar producto (o aumentar cantidad) en el carrito
  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const product = await Product.findById(productId);
    if (!product) return null;

    const item = cart.products.find(p => p.product.toString() === productId);
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return await cart.save();
  }

  // Actualizar cantidad de un producto del carrito
  async updateProductQuantity(cartId, productId, quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) return null;

    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const item = cart.products.find(p => p.product.toString() === productId);
    if (!item) return null;

    item.quantity = quantity;
    return await cart.save();
  }

  // Eliminar un producto del carrito
  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    return await cart.save();
  }

  // Vaciar el carrito
  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    return await cart.save();
  }

  // Reemplazar todos los productos del carrito
  async replaceCartProducts(cartId, newProducts) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    if (!Array.isArray(newProducts)) return null;

    // Extraer IDs únicos de productos
    const productIds = newProducts.map(p => p.product);
    const uniqueProductIds = [...new Set(productIds)];

    // Consultar una sola vez para validar existencia
    const foundProducts = await Product.find({ _id: { $in: uniqueProductIds } });
    if (foundProducts.length !== uniqueProductIds.length) {
      // Algún producto no existe
      return null;
    }

    // Validar cantidad y mapear productos sanitizados
    const sanitizedProducts = newProducts.map(p => ({
      product: p.product,
      quantity: (Number.isInteger(p.quantity) && p.quantity > 0) ? p.quantity : 1
    }));

    cart.products = sanitizedProducts;
    return await cart.save();
  }
}

module.exports = CartManager;