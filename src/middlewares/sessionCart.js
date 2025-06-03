const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

const sessionCart = async (req, res, next) => {
  try {
    if (!req.session.cartId) {
      // Crear un carrito nuevo si no existe en sesión
      const newCart = await cartManager.createCart();
      req.session.cartId = newCart._id.toString();
    }
    next();
  } catch (error) {
    console.error('Error en middleware sessionCart:', error);
    res.status(500).send('Error interno del servidor');
  }
};

module.exports = sessionCart;