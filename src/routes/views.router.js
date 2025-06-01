const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

// Vista principal - home
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { title: 'Inicio', products });
});

// Vista con productos en tiempo real (WebSocket)
router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products });
});

// Vista paginada de productos con filtros/sort
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const result = await productManager.getPaginatedProducts({
      limit,
      page,
      sort,
      query,
    });

    res.render('products', {
      title: 'Productos',
      products: result.payload,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
      page: result.page,
      totalPages: result.totalPages
    });
  } catch (error) {
    console.error('Error al renderizar productos paginados:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Vista de detalle de producto
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('products/productDetail', {
      title: product.title,
      product,
    });
  } catch (error) {
    console.error('Error al cargar el detalle del producto:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;