const path = require('path');
const { readFile, writeFile } = require('../utils/fileManager'); // importa las funciones utilitarias

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath || path.join(__dirname, '../../data/products.json');
    }

    async addProduct(product) {
        const products = await this.getProducts();

        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            ...product
        };

        products.push(newProduct);
        await writeFile(this.filePath, products);
        return newProduct;
    }

    async getProducts() {
        return await readFile(this.filePath);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) return null;

        products[index] = { id, ...updatedProduct };
        await writeFile(this.filePath, products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter(product => product.id !== id);

        if (products.length === newProducts.length) return null;

        await writeFile(this.filePath, newProducts);
        return true;
    }
}

module.exports = ProductManager;