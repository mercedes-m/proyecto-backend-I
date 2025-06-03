const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./utils/mongo'); 
const session = require('express-session');

const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

// Importar el nuevo ProductManager con Mongo
const ProductManager = require('./managers/ProductManager'); 
const productManager = new ProductManager();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conectar a MongoDB antes de levantar el servidor
connectDB();

// Configurar Handlebars con helpers
app.engine('handlebars', engine({
  helpers: {
    multiply: (a, b) => a * b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos y JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar express-session
app.use(session({
  secret: 'mi_clave_secreta_123',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } 
}));

// Rutas API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Rutas de vistas
app.use('/', viewsRouter);

// WebSocket
io.on('connection', async socket => {
  console.log('Nuevo cliente conectado con WebSocket');

  const products = await productManager.getProducts();
  socket.emit('products', products);

  socket.on('new-product', async data => {
    await productManager.addProduct(data);
    const updatedProducts = await productManager.getProducts();
    io.emit('products', updatedProducts);
  });

  socket.on('delete-product', async id => {
    await productManager.deleteProduct(id); 
    const updatedProducts = await productManager.getProducts();
    io.emit('products', updatedProducts);
  });
});

// Servidor escuchando
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});