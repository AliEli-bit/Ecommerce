import express from 'express';
import { getOrdenesProveedor, actualizarEstadoEnvioOrden, getOrdenById, getOrdenesUsuario, getOrdenesFundacion, getEstadisticasReportes } from '../controllers/orden.controller.js';
import { verifyToken, isProveedor, isFundacion } from '../middleware/auth.middleware.js';

const router = express.Router();

// Ruta para obtener órdenes de un usuario
router.get('/usuario', verifyToken, getOrdenesUsuario);

// Ruta para obtener órdenes de un proveedor
router.get('/proveedor', verifyToken, isProveedor, getOrdenesProveedor);

// Ruta para obtener órdenes de una fundación
router.get('/fundacion', verifyToken, isFundacion, getOrdenesFundacion);

// Ruta para obtener estadísticas de reportes
router.get('/estadisticas', verifyToken, isFundacion, getEstadisticasReportes);

// Ruta para actualizar el estado de envío de una orden
router.put('/:id/estado-envio', verifyToken, isProveedor, actualizarEstadoEnvioOrden);

// Ruta para obtener una orden específica por ID
router.get('/:id', verifyToken, getOrdenById);

export default router; 