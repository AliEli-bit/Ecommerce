import express from 'express';
import { getOrdenesProveedor } from '../controllers/orden.controller.js';
import { verifyToken, isProveedor } from '../middleware/auth.middleware.js';

const router = express.Router();

// Ruta para obtener órdenes de un proveedor
router.get('/proveedor', verifyToken, isProveedor, getOrdenesProveedor);

export default router; 