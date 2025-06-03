import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Alert,
  Typography,
  IconButton
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useProveedores } from '../hooks/useProveedores';

const unidades = ['kg', 'unidad', 'litro', 'metro'];
const categorias = ['materiales', 'equipos', 'alimentos', 'gaseosas', 'otros'];

const ProductoForm = ({ open, onClose, onSubmit, initialData, proveedores }) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    precio: initialData?.precio || '',
    unidad: initialData?.unidad || '',
    stock: initialData?.stock || '',
    categoria: initialData?.categoria || '',
    proveedor: initialData?.proveedor || '',
    estado: 'activo',
  });

  const [imagenFile, setImagenFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = initialData && initialData._id;

  useEffect(() => {
    setFormData({
      nombre: initialData?.nombre || '',
      descripcion: initialData?.descripcion || '',
      precio: initialData?.precio || '',
      unidad: initialData?.unidad || '',
      stock: initialData?.stock || '',
      categoria: initialData?.categoria || '',
      proveedor: initialData?.proveedor || '',
      estado: initialData?.estado || 'activo',
    });
    setImagenFile(null);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagenFile(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!formData.nombre || !formData.descripcion || !formData.precio || 
          !formData.unidad || !formData.stock || !formData.categoria) {
        setError('Todos los campos son requeridos');
        return;
      }

      await onSubmit(formData, imagenFile);
      
      handleClose();
      
    } catch (err) {
      setError(err.response?.data?.message || 
        (isEditing ? 'Error al actualizar el producto' : 'Error al crear el producto'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      unidad: '',
      stock: '',
      categoria: '',
      proveedor: '',
      estado: 'activo',
    });
    setImagenFile(null);
    setError('');
    onClose();
  };

  const getDialogTitle = () => {
    return isEditing ? `Editar Producto: ${initialData.nombre}` : 'Nuevo Producto';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {getDialogTitle()}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <FormControl fullWidth required>
              <InputLabel>Unidad</InputLabel>
              <Select
                name="unidad"
                value={formData.unidad}
                onChange={handleChange}
                label="Unidad"
                disabled={loading}
              >
                {unidades.map((unidad) => (
                  <MenuItem key={unidad} value={unidad}>
                    {unidad}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <FormControl fullWidth required>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                label="Categoría"
                disabled={loading}
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth required>
            <InputLabel>Proveedor</InputLabel>
            <Select
              name="proveedor"
              value={formData.proveedor}
              onChange={handleChange}
              label="Proveedor"
              disabled={loading}
            >
              {proveedores?.map((proveedor) => (
                <MenuItem key={proveedor._id} value={proveedor._id}>
                  {proveedor.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Imagen del Producto (Opcional)
            </Typography>
            
            {isEditing && initialData.imagenes && initialData.imagenes.length > 0 && (
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Imagen actual:
                </Typography>
                <img
                  src={initialData.imagenes[0].url}
                  alt={initialData.nombre}
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<PhotoCamera />}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {isEditing ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            
            {imagenFile && (
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2" color="textSecondary">
                  {imagenFile.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  disabled={loading}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}

            {imagenFile && (
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Vista previa:
                </Typography>
                <img
                  src={URL.createObjectURL(imagenFile)}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || (!isEditing && !imagenFile)}
        >
          {loading ? 
            (isEditing ? 'Actualizando...' : 'Creando...') : 
            (isEditing ? 'Actualizar Producto' : 'Crear Producto')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoForm; 