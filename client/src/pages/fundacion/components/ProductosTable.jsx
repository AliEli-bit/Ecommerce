import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductosTable = ({
  productos,
  loading,
  error,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Unidad</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto._id}>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>
                <Chip 
                  label={producto.categoria} 
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>${producto.precio}</TableCell>
              <TableCell>{producto.stock}</TableCell>
              <TableCell>{producto.unidad}</TableCell>
              <TableCell>{producto.proveedor?.nombre}</TableCell>
              <TableCell>
                <Chip 
                  label={producto.estado} 
                  size="small"
                  color={producto.estado === 'activo' ? 'success' : 'error'}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => onEdit(producto._id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(producto._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductosTable; 