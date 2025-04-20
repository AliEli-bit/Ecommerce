import express from 'express';
import {
  crearProveedor,
  obtenerProveedores,
  obtenerProveedor,
  actualizarProveedor,
  eliminarProveedor,
  actualizarEstadoProveedor
} from '../controllers/proveedor.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Rutas para proveedores
router.post('/', auth, crearProveedor);
router.get('/', auth, obtenerProveedores);
router.get('/:id', auth, obtenerProveedor);
router.put('/:id', auth, actualizarProveedor);
router.put('/:id/estado', auth, actualizarEstadoProveedor);
router.delete('/:id', auth, eliminarProveedor);

export default router;