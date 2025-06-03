import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const OrdenesView = ({ open, onClose }) => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ordenes/proveedor`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Error al cargar las órdenes');
        const data = await response.json();
        setOrdenes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchOrdenes();
    }
  }, [open]);

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'warning',
      procesando: 'info',
      completado: 'success',
      fallido: 'error',
      reembolsado: 'default'
    };
    return colores[estado] || 'default';
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogContent>
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogContent>
          <Alert severity="error">{error}</Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <Typography variant="h6">Órdenes de Compra</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número de Orden</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado Pago</TableCell>
                <TableCell>Estado Envío</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenes.map((orden) => (
                <TableRow key={orden._id}>
                  <TableCell>{orden.numeroOrden}</TableCell>
                  <TableCell>
                    {format(new Date(orden.createdAt), 'PPP', { locale: es })}
                  </TableCell>
                  <TableCell>
                    {orden.datosContacto?.nombre || 'N/A'}
                  </TableCell>
                  <TableCell>${orden.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={orden.estadoPago}
                      color={getEstadoColor(orden.estadoPago)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={orden.estadoEnvio}
                      color={getEstadoColor(orden.estadoEnvio)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default OrdenesView; 