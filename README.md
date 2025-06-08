# proyecto-backend-I - E-commerce

Este es un proyecto backend desarrollado con **Node.js**, **Express** y **MongoDB** para gestionar un sistema de productos y carritos, con vistas dinámicas mediante **Handlebars**.

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/mercedes-m/proyecto-backend-I
```

2. Instalar las dependencias:
```bash
npm install
```

3. Configurar variables de entorno:

Crear un archivo `.env` en la raíz con el siguiente contenido:

```env
PORT=8080
MONGO_URL=mongodb://localhost:27017/ecommerce
SESSION_SECRET=tu_clave_secreta
```

4. Correr el proyecto:

```bash
npm start
```
## Requisitos

- Node.js v14 o superior  
- MongoDB corriendo localmente o en la nube  

## Cómo usar la aplicación

- Acceder a `http://localhost:8080/products` para ver los productos con paginación.  
- Agregar productos al carrito con el botón "Agregar al carrito".  
- Consultar carrito en `http://localhost:8080/carts/:cid`.  
- Usar filtros y paginación vía query params en `/api/products`.

## Stack Tecnológico

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Handlebars** (motor de plantillas)
- **Socket.io** (para actualizaciones en tiempo real)
- **Express-Session** (para carrito persistente por sesión)

## Estructura del proyecto

```
Proyecto-backend/
├── data/                   # Archivos JSON (para carga inicial)
├── src/
│   ├── managers/           # Lógica de negocio (ProductManager, CartManager)
│   ├── models/             # Modelos Mongoose
│   ├── routes/             # Rutas API
│   ├── utils/              # Funciones auxiliares
│   ├── views/              # Plantillas Handlebars
│   ├── public/             # Archivos estáticos
│   └── app.js              # Configuración principal de la app
├── .env                    # Variables de entorno
├── .gitignore              # Ignorar node_modules, .env, etc.
└── README.md               # Este archivo
```

## Funcionalidades

- CRUD de productos y carritos con persistencia en MongoDB
- Vistas dinámicas de:
  - Productos paginados
  - Detalle del producto
  - Detalle del carrito
- Carrito asociado a la sesión del usuario
- Uso de `.populate()` en los carritos para mostrar productos
- Validaciones de IDs y cantidades
- Paginación con `mongoose-paginate-v2`
- Actualizaciones en tiempo real con WebSocket

## Autor

- María Mercedes Muñoz https://github.com/mercedes-m
- Comisión 74275 - Programación Backend I: Desarrollo Avanzado de Backend

