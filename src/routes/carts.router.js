const { Router } = require('express');
const CartManager = require('../managers/CartManager');
const mongoose = require('mongoose');

const cartManager = new CartManager();
const router = Router();

// Validar ObjectId de Mongo
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json({ status: 'success', payload: carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Crear un carrito nuevo
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Obtener un carrito por id
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await cartManager.getCartById(cid);
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

    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (!updatedCart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });

    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    if (!updatedCart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });

    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Actualizar cantidad de producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID inválido' });
    }

    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
    }

    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    if (!updatedCart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });

    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Reemplazar todos los productos del carrito
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

    const updatedCart = await cartManager.replaceCartProducts(cid, products);
    if (!updatedCart) {
      return res.status(400).json({ status: 'error', message: 'Productos inválidos o carrito no encontrado' });
    }

    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    if (!isValidObjectId(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const emptiedCart = await cartManager.clearCart(cid);
    if (!emptiedCart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', payload: emptiedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;