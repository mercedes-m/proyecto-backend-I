const { Router } = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const router = Router();

// Validar ObjectId de Mongo
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product').lean();
    res.json({ status: 'success', payload: carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Crear un carrito nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    if (!isValidObjectId(cid)) return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });

    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    if (req.headers.accept.includes('text/html')) {
      return res.redirect(`/carts/${cid}`);
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Eliminar (restar o quitar) un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const index = cart.products.findIndex(p => p.product.toString() === pid);
    if (index === -1) return res.status(404).json({ status: 'error', message: 'Producto no está en el carrito' });

    if (cart.products[index].quantity > 1) {
      cart.products[index].quantity -= 1;
    } else {
      cart.products.splice(index, 1);
    }

    await cart.save();

    // Redirección para formularios
    if (req.headers.accept.includes('text/html')) {
      return res.redirect(`/carts/${cid}`);
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Vaciar carrito completo
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    if (req.headers.accept.includes('text/html')) {
      return res.redirect(`/carts/${cid}`);
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Cantidad inválida (debe ser número positivo)' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ status: 'error', message: 'Producto no está en el carrito' });

    item.quantity = quantity;
    await cart.save();

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Reemplazar todo el contenido del carrito
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!isValidObjectId(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    if (!Array.isArray(products)) {
      return res.status(400).json({ status: 'error', message: 'Debe enviar un arreglo de productos' });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;