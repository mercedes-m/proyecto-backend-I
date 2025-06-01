const Cart = require('../models/Cart');
const Product = require('../models/Product');

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
    if (quantity < 1) return null;

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

  async replaceCartProducts(cartId, newProducts) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    for (const item of newProducts) {
      const exists = await Product.findById(item.product);
      if (!exists) return null; 
    }

    cart.products = newProducts.map(p => ({
      product: p.product,
      quantity: p.quantity > 0 ? p.quantity : 1
    }));

    return await cart.save();
  }
}

module.exports = CartManager;