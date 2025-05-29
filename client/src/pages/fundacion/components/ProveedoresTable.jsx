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
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

const ProveedoresTable = ({
  proveedores,
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

  if (!proveedores || proveedores.length === 0) {
    return (
      <Box p={3}>
        <Typography color="textSecondary" align="center">
          No hay proveedores registrados
        </Typography>
      </Box>
    );
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'rechazado':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>NIT</TableCell>
            <TableCell>Tipo de Servicio</TableCell>
            <TableCell>Contacto</TableCell>
            <TableCell>Representante</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proveedores.map((proveedor) => (
            <TableRow key={proveedor._id}>
              <TableCell>{proveedor.nombre}</TableCell>
              <TableCell>{proveedor.nit}</TableCell>
              <TableCell>
                <Chip 
                  label={proveedor.tipoServicio} 
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{proveedor.email}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {proveedor.telefono}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{proveedor.representante?.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">
                  CI: {proveedor.representante?.ci}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={proveedor.estado || 'pendiente'} 
                  size="small"
                  color={getEstadoColor(proveedor.estado)}
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Ver detalles">
                  <IconButton size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(proveedor._id)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(proveedor._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProveedoresTable; 