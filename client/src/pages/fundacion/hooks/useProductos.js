import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5003/api';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    try {
      console.log('Fetching productos...');
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await axios.get(`${API_URL}/productos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Productos response:', response.data);
      setProductos(response.data);
      setError(null);
    } catch (err) {
      console.error('Error details:', err.response || err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('No autorizado. Por favor, inicie sesión nuevamente.');
        } else if (err.response.status === 403) {
          setError('No tiene permisos para acceder a esta información.');
        } else {
          setError(err.response.data?.message || 'Error al cargar los productos');
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor');
      } else {
        setError(err.message || 'Error al cargar los productos');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useProductos hook mounted');
    fetchProductos();
  }, []);

  const handleAddProducto = async (productoData, imagenFile = null) => {
    try {
      console.log('Adding producto:', productoData);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // Crear FormData para enviar archivos
      const formData = new FormData();
      
      // Agregar todos los campos del producto al FormData
      Object.keys(productoData).forEach(key => {
        if (productoData[key] !== null && productoData[key] !== undefined) {
          formData.append(key, productoData[key]);
        }
      });

      // Agregar la imagen si existe
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      const response = await axios.post(`${API_URL}/productos`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Add producto response:', response.data);
      setProductos(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding producto:', err.response || err);
      throw err;
    }
  };

  const handleEditProducto = async (id, productoData, imagenFile = null) => {
    try {
      console.log('Editing producto:', id, productoData);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      // Crear FormData para enviar archivos
      const formData = new FormData();
      
      // Agregar todos los campos del producto al FormData
      Object.keys(productoData).forEach(key => {
        if (productoData[key] !== null && productoData[key] !== undefined) {
          formData.append(key, productoData[key]);
        }
      });

      // Agregar la imagen si existe (nueva imagen)
      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      const response = await axios.put(`${API_URL}/productos/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Edit producto response:', response.data);
      setProductos(prev => prev.map(p => p._id === id ? response.data : p));
      return response.data;
    } catch (err) {
      console.error('Error editing producto:', err.response || err);
      throw err;
    }
  };

  const handleDeleteProducto = async (id) => {
    try {
      console.log('Deleting producto:', id);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      await axios.delete(`${API_URL}/productos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProductos(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Error deleting producto:', err.response || err);
      throw err;
    }
  };

  return {
    productos,
    loading,
    error,
    handleAddProducto,
    handleEditProducto,
    handleDeleteProducto,
    refreshProductos: fetchProductos
  };
};