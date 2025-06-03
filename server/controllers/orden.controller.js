import Orden from '../models/Orden.model.js';
import Producto from '../models/Producto.model.js';

// Obtener órdenes para un proveedor
export const getOrdenesProveedor = async (req, res) => {
  try {
    // Primero obtenemos los IDs de los productos del proveedor
    const productosProveedor = await Producto.find({ proveedor: req.user._id }).select('_id');
    const productosIds = productosProveedor.map(p => p._id);

    // Buscamos las órdenes que contienen productos del proveedor
    const ordenes = await Orden.find({ 'items.proveedor': req.user._id })
    .populate('items.producto', 'nombre precio')
    .populate('usuario', 'nombre email')
    .sort({ createdAt: -1 });

    res.json(ordenes);
  } catch (error) {
    console.error('Error al obtener órdenes del proveedor:', error);
    res.status(500).json({ message: error.message });
  }
}; 