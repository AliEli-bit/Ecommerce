import express from 'express';
import {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerTodosProductosdef
} from '../controllers/producto.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Rutas para productos
router.post('/', auth, crearProducto);
router.get('/', auth, obtenerProductos);
router.get('/todos', auth, obtenerTodosProductosdef);
router.get('/:id', auth, obtenerProducto);
router.put('/:id', auth, actualizarProducto);
router.delete('/:id', auth, eliminarProducto);
export default router; 