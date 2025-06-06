const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./utils/mongo'); 
const session = require('express-session');
const methodOverride = require('method-override');

const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const mockRouter = require('./routes/mock.router');

const ProductManager = require('./managers/ProductManager'); 
const CartManager = require('./managers/CartManager');
const helpers = require('./utils/helpers');

const productManager = new ProductManager();
const cartManager = new CartManager();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conectar a MongoDB antes de levantar el servidor
connectDB();

// Configurar express-session
app.use(session({
  secret: 'mi_clave_secreta_123',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

// Middleware para crear o validar carrito en sesión
app.use(async (req, res, next) => {
  if (!req.session.cartId) {
    try {
      const newCart = await cartManager.createCart();
      req.session.cartId = newCart._id.toString();
      console.log('🛒 Carrito creado para la sesión:', req.session.cartId);
    } catch (err) {
      console.error('Error creando carrito para sesión:', err.message);
      return res.status(500).send('Error al inicializar carrito');
    }
  }
  next();
});

// Middleware para permitir PUT y DELETE en formularios
app.use(methodOverride('_method'));

// Configurar Handlebars con helpers
app.engine('handlebars', engine({
  helpers: helpers,
  allowProtoPropertiesByDefault: true,
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos y JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Rutas de vistas
app.use('/', viewsRouter);
app.use('/', mockRouter);

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