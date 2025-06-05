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
  Collapse,
  Button,
  Box,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const OrdenesView = ({ open, onClose }) => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrden, setExpandedOrden] = useState(null);

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
      setLoading(true);
      fetchOrdenes();
    }
  }, [open]);

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'warning',
      procesando: 'info',
      completado: 'success',
      fallido: 'error',
      reembolsado: 'default',
      enviado: 'primary',
      entregado: 'success',
      cancelado: 'error'
    };
    return colores[estado] || 'default';
  };

  const toggleExpanded = (ordenId) => {
    setExpandedOrden(expandedOrden === ordenId ? null : ordenId);
  };

  const calcularTotalProveedor = (orden) => {
    // Si el backend ya calcula totalProveedor, usarlo
    if (orden.totalProveedor) {
      return orden.totalProveedor;
    }
    
    // Si no, calcular manualmente sumando los items
    return orden.items?.reduce((total, item) => total + (item.subtotal || 0), 0) || 0;
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Cargando órdenes...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography variant="h6" color="error">Error</Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box display="flex" alignItems="center">
          <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            Mis Órdenes de Compra
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {ordenes.length === 0 ? (
          <Box textAlign="center" py={8}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="textSecondary" gutterBottom>
              No tienes órdenes
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Las órdenes que contengan tus productos aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                    Número de Orden
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                    Fecha
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                    Cliente
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} align="right">
                    Mi Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} align="center">
                    Estado Pago
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} align="center">
                    Estado Envío
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordenes.map((orden) => (
                  <React.Fragment key={orden._id}>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {orden.numeroOrden}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(new Date(orden.createdAt), 'PPP', { locale: es })}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {format(new Date(orden.createdAt), 'p', { locale: es })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PersonIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {orden.datosContacto?.nombre || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {orden.datosContacto?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          ${calcularTotalProveedor(orden).toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {orden.items?.length || 0} producto{(orden.items?.length || 0) !== 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={orden.estadoPago}
                          color={getEstadoColor(orden.estadoPago)}
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={orden.estadoEnvio}
                          color={getEstadoColor(orden.estadoEnvio)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => toggleExpanded(orden._id)}
                          endIcon={expandedOrden === orden._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        >
                          {expandedOrden === orden._id ? 'Ocultar' : 'Ver Detalles'}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Fila expandible con detalles */}
                    <TableRow>
                      <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0, bgcolor: 'grey.25' }}>
                        <Collapse in={expandedOrden === orden._id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Grid container spacing={3}>
                              {/* Productos */}
                              <Grid item xs={12} md={8}>
                                <Card elevation={2}>
                                  <CardContent>
                                    <Typography variant="h6" gutterBottom color="primary.main">
                                      <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                      Mis Productos en esta Orden
                                    </Typography>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio Unit.</TableCell>
                                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {orden.items?.map((item, index) => (
                                          <TableRow key={index} hover>
                                            <TableCell>
                                              <Typography variant="body2" fontWeight="medium">
                                                {item.nombre}
                                              </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                              <Chip 
                                                label={item.cantidad} 
                                                size="small" 
                                                color="primary" 
                                                variant="outlined" 
                                              />
                                            </TableCell>
                                            <TableCell align="right">
                                              <Typography variant="body2">
                                                ${item.precioUnitario?.toFixed(2)}
                                              </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                              <Typography variant="body2" fontWeight="bold" color="primary.main">
                                                ${item.subtotal?.toFixed(2)}
                                              </Typography>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                        <TableRow>
                                          <TableCell colSpan={3} sx={{ borderTop: 2, borderColor: 'primary.main' }}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                              Total de mis productos:
                                            </Typography>
                                          </TableCell>
                                          <TableCell align="right" sx={{ borderTop: 2, borderColor: 'primary.main' }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                              ${calcularTotalProveedor(orden).toFixed(2)}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Información del cliente y envío */}
                              <Grid item xs={12} md={4}>
                                <Grid container spacing={2}>
                                  {/* Datos del cliente */}
                                  <Grid item xs={12}>
                                    <Card elevation={2}>
                                      <CardContent>
                                        <Typography variant="h6" gutterBottom color="primary.main">
                                          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                          Cliente
                                        </Typography>
                                        <Box>
                                          <Typography variant="body2" fontWeight="medium">
                                            {orden.datosContacto?.nombre}
                                          </Typography>
                                          <Box display="flex" alignItems="center" mt={1}>
                                            <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="textSecondary">
                                              {orden.datosContacto?.email}
                                            </Typography>
                                          </Box>
                                          <Box display="flex" alignItems="center" mt={0.5}>
                                            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="textSecondary">
                                              {orden.datosContacto?.telefono}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </Grid>

                                  {/* Dirección de envío */}
                                  <Grid item xs={12}>
                                    <Card elevation={2}>
                                      <CardContent>
                                        <Typography variant="h6" gutterBottom color="primary.main">
                                          <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                          Dirección de Envío
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                          {orden.direccionEnvio?.calle}<br />
                                          {orden.direccionEnvio?.ciudad}, {orden.direccionEnvio?.estado}<br />
                                          CP: {orden.direccionEnvio?.codigoPostal}<br />
                                          {orden.direccionEnvio?.pais}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>

                                  {/* Información de pago */}
                                  <Grid item xs={12}>
                                    <Card elevation={2}>
                                      <CardContent>
                                        <Typography variant="h6" gutterBottom color="primary.main">
                                          Información de Pago
                                        </Typography>
                                        <Box>
                                          <Typography variant="body2">
                                            <strong>Método:</strong> {orden.metodoPago?.toUpperCase()}
                                          </Typography>
                                          {orden.stripePagoDetalles && (
                                            <Typography variant="body2" mt={1}>
                                              <strong>Tarjeta:</strong> **** **** **** {orden.stripePagoDetalles.ultimos4}
                                            </Typography>
                                          )}
                                          {orden.fechaPago && (
                                            <Typography variant="body2" color="textSecondary" mt={1}>
                                              <strong>Pagado:</strong> {format(new Date(orden.fechaPago), 'PPp', { locale: es })}
                                            </Typography>
                                          )}
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrdenesView;