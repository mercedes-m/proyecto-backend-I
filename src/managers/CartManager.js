const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

class CartManager {
  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async getCarts() {
    return await Cart.find().populate('products.product').lean();
  }

  async getCartById(cid) {
    if (!this.isValidId(cid)) return null;
    return await Cart.findById(cid).populate('products.product').lean();
  }

  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async addProductToCart(cid, pid) {
    if (!this.isValidId(cid) || !this.isValidId(pid)) return null;

    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const product = await Product.findById(pid);
    if (!product) return null;

    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return await cart.populate('products.product');
  }

  async removeProductFromCart(cid, pid) {
    if (!this.isValidId(cid) || !this.isValidId(pid)) return null;

    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const index = cart.products.findIndex(p => p.product.toString() === pid);
    if (index === -1) return null;

    if (cart.products[index].quantity > 1) {
      cart.products[index].quantity -= 1;
    } else {
      cart.products.splice(index, 1);
    }

    await cart.save();
    return await cart.populate('products.product');
  }

  async clearCart(cid) {
    if (!this.isValidId(cid)) return null;

    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return await cart.populate('products.product');
  }

  async updateProductQuantity(cid, pid, quantity) {
    if (!this.isValidId(cid) || !this.isValidId(pid)) return null;

    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return null;

    item.quantity = quantity;
    await cart.save();
    return await cart.populate('products.product');
  }

  async replaceCartProducts(cid, products) {
    if (!this.isValidId(cid)) return null;

    const cart = await Cart.findById(cid);
    if (!cart) return null;

    if (!Array.isArray(products)) return null;

    // Validar cada producto
    for (const item of products) {
      if (
        !item.product ||
        !this.isValidId(item.product) ||
        typeof item.quantity !== 'number' ||
        item.quantity < 1
      ) {
        return null;
      }

      const exists = await Product.findById(item.product);
      if (!exists) return null;
    }

    cart.products = products;
    await cart.save();
    return await cart.populate('products.product');
  }
}

module.exports = CartManager;