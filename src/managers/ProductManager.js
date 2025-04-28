const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath || path.join(__dirname, 'products.json');
    }

    // Método para agregar un producto
    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            ...product
        };
        products.push(newProduct);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    // Método para obtener todos los productos
    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];  // Si el archivo no existe o está vacío, devolvemos un array vacío
        }
    }

    // Método para obtener un producto por ID
    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    // Método para actualizar un producto
    async updateProduct(id, updatedProduct) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);

        if (index === -1) return null;  // Si no se encuentra el producto, devolvemos null

        products[index] = { id, ...updatedProduct };  // Actualizamos el producto
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return products[index];  // Devolvemos el producto actualizado
    }

    // Método para eliminar un producto
    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter(product => product.id !== id);

        if (products.length === newProducts.length) return null;  // Si no se eliminó nada, devolvemos null

        await fs.writeFile(this.filePath, JSON.stringify(newProducts, null, 2));
        return true;  // Producto eliminado correctamente
    }
}

module.exports = ProductManager;