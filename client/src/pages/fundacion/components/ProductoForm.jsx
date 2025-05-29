import React from 'react';
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
  Select
} from '@mui/material';

const unidades = ['kg', 'unidad', 'litro', 'metro'];
const categorias = ['materiales', 'equipos', 'alimentos', 'gaseosas', 'otros'];

const ProductoForm = ({ open, onClose, onSubmit, initialData, proveedores }) => {
  const [formData, setFormData] = React.useState({
    nombre: '',
    descripcion: '',
    precio: '',
    unidad: '',
    stock: '',
    categoria: '',
    proveedor: '',
    estado: 'activo',
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Editar Producto' : 'Agregar Producto'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nombre"
                label="Nombre"
                value={formData.nombre}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="descripcion"
                label="Descripción"
                value={formData.descripcion}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="precio"
                label="Precio"
                type="number"
                value={formData.precio}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="stock"
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Unidad</InputLabel>
                <Select
                  name="unidad"
                  value={formData.unidad}
                  onChange={handleChange}
                  label="Unidad"
                >
                  {unidades.map((unidad) => (
                    <MenuItem key={unidad} value={unidad}>
                      {unidad}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  label="Categoría"
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Proveedor</InputLabel>
                <Select
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleChange}
                  label="Proveedor"
                >
                  {proveedores?.map((proveedor) => (
                    <MenuItem key={proveedor._id} value={proveedor._id}>
                      {proveedor.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Guardar' : 'Agregar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductoForm; 