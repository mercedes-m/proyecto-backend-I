const { Router } = require('express');
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

const router = Router();

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
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Eliminar producto del carrito (DELETE api/carts/:cid/products/:pid)
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Actualizar cantidad de producto (PUT api/carts/:cid/products/:pid)
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ status: 'error', message: 'Cantidad inválida' });
    
    const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!updatedCart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' });
    res.json({ status: 'success', payload: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Actualizar todos los productos del carrito (PUT api/carts/:cid)
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ status: 'error', message: 'Debe enviar un arreglo de productos' });

    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    // Reemplazar los productos con el arreglo recibido
    cart.products = products.map(p => ({
      product: p.product,
      quantity: p.quantity || 1
    }));
    
    await cart.save();

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Vaciar carrito (DELETE api/carts/:cid)
router.delete('/:cid', async (req, res) => {
  try {
    const emptiedCart = await cartManager.clearCart(req.params.cid);
    if (!emptiedCart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: emptiedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;