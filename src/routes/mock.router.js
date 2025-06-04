const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager();

router.get('/mockproducts', async (req, res) => {
  try {
    const mockProducts = [];

    for (let i = 1; i <= 10; i++) {
      mockProducts.push({
        title: `Producto ${i}`,
        description: `Descripción del producto ${i}`,
        price: (10 + i) * 100,
        code: `code${i}`,
        stock: 50 + i,
        category: i % 2 === 0 ? 'Electrónica' : 'Ropa',
        thumbnails: [],
        status: true
      });
    }

    // Guardarlos en la base de datos
    for (const product of mockProducts) {
      await productManager.addProduct(product);
    }

    res.send('✅ Productos mock cargados correctamente.');
  } catch (error) {
    console.error('❌ Error al cargar productos mock:', error.message);
    res.status(500).send('Error al crear productos de prueba.');
  }
});

module.exports = router;