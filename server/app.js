import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fundacionRoutes from './routes/fundacion.routes.js';
import proveedorRoutes from './routes/proveedor.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import productoRoutes from './routes/producto.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // URLs del cliente React
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use(morgan('dev'));

// Body parser
app.use(express.json());

// Rutas
app.use('/api/fundaciones', fundacionRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/productos', productoRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});



export default app;