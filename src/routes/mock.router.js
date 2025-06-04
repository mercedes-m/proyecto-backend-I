const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

// Ruta temporal para insertar productos de prueba
router.get('/mockproducts', async (req, res) => {
  try {
    await productManager.addProduct({
      title: 'Producto 1',
      description: 'Descripción del producto 1',
      price: 100,
      stock: 20,
      code: 'P001',
      category: 'general'
    });

    await productManager.addProduct({
      title: 'Producto 2',
      description: 'Descripción del producto 2',
      price: 150,
      stock: 15,
      code: 'P002',
      category: 'general'
    });

    res.send('✅ Productos de prueba agregados');
  } catch (error) {
    console.error('❌ Error agregando productos de prueba:', error.message);
    res.status(500).send('Error al agregar productos');
  }
});

module.exports = router;