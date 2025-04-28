const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

router.post('/', async (req, res) => {
    const product = await productManager.addProduct(req.body);
    res.status(201).json(product);
});

router.put('/:pid', async (req, res) => {
    const product = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

router.delete('/:pid', async (req, res) => {
    const deletedProduct = await productManager.deleteProduct(parseInt(req.params.pid));
    if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(204).send();
});

module.exports = router;