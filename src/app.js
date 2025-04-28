const express = require('express');
const app = express();
const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});