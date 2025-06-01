const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartManager {
  async getCarts() {
    return await Cart.find().populate('products.product').exec();
  }

  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product').exec();
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const productExists = await Product.findById(productId);
    if (!productExists) return null;

    const existingProduct = cart.products.find(p => p.product.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const productInCart = cart.products.find(p => p.product.toString() === productId);
    if (!productInCart) return null;

    if (quantity <= 0) return null; // o eliminarlo directamente

    productInCart.quantity = quantity;
    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }

  async replaceCartProducts(cartId, newProducts) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    // Validar cada producto
    for (const item of newProducts) {
      const exists = await Product.findById(item.product);
      if (!exists) return null; // o lanzar error
    }

    cart.products = newProducts;
    await cart.save();
    return cart;
  }
}

module.exports = CartManager;