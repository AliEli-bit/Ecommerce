import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from '../../../config/axios';

const ProductosDonadosCard = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== DEBUG: Iniciando fetchOrdenes ===');
      console.log('Token:', localStorage.getItem('token'));
      
      // Usar el nuevo endpoint específico para fundaciones (sin /api/ ya que está en baseURL)
      const response = await axios.get('/ordenes/fundacion');
      
      console.log('=== DEBUG: Respuesta del servidor ===');
      console.log('Response:', response);
      console.log('Response data:', response.data);
      
      if (response.data.success) {
        setOrdenes(response.data.data || []);
        console.log('Órdenes cargadas:', response.data.data?.length || 0);
      } else {
        setError(response.data.message || 'Error al cargar las órdenes');
        console.error('Error en respuesta:', response.data.message);
      }
    } catch (err) {
      console.error('=== DEBUG: Error en fetchOrdenes ===');
      console.error('Error completo:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError(err.response?.data?.message || 'Error al cargar las donaciones');
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'warning',
      procesando: 'info',
      enviado: 'primary',
      entregado: 'success',
      cancelado: 'error'
    };
    return colores[estado] || 'default';
  };

  const getEstadoText = (estado) => {
    const textos = {
      pendiente: 'Pendiente',
      procesando: 'Procesando',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return textos[estado] || estado;
  };

  const handleVerDetalles = (orden) => {
    setSelectedOrden(orden);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrden(null);
  };

  const calcularTotalDonaciones = () => {
    return ordenes.reduce((total, orden) => total + (orden.subtotalFundacion || 0), 0);
  };

  const calcularTotalProductos = () => {
    return ordenes.reduce((total, orden) => {
      return total + (orden.items?.reduce((sum, item) => sum + (item.cantidad || 0), 0) || 0);
    }, 0);
  };

  const obtenerProductosUnicos = () => {
    const productos = new Set();
    ordenes.forEach(orden => {
      orden.items?.forEach(item => {
        productos.add(item.producto?.nombre || item.nombre);
      });
    });
    return productos.size;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex justify-center items-center h-64">
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader
          title={
            <Box className="flex items-center">
              <InventoryIcon className="mr-2 text-green-600" />
              <Typography variant="h6" component="h2">
                Productos Donados
              </Typography>
            </Box>
          }
          subheader={`${ordenes.length} donaciones recibidas`}
        />
        <CardContent>
          {/* Estadísticas rápidas */}
          <Grid container spacing={2} className="mb-4">
            <Grid item xs={4}>
              <Box className="text-center">
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {ordenes.length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Donaciones
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="text-center">
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {calcularTotalProductos()}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Productos
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className="text-center">
                <Typography variant="h4" color="secondary.main" fontWeight="bold">
                  Bs {calcularTotalDonaciones().toFixed(2)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Valor Total
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider className="my-3" />

          {/* Lista de donaciones recientes */}
          <Typography variant="subtitle2" color="textSecondary" className="mb-2">
            Donaciones Recientes
          </Typography>

          {ordenes.length === 0 ? (
            <Box className="text-center py-8">
              <InventoryIcon className="text-gray-400 text-4xl mb-2" />
              <Typography variant="body2" color="textSecondary">
                No hay donaciones registradas aún
              </Typography>
            </Box>
          ) : (
            <List className="max-h-64 overflow-y-auto">
              {ordenes.slice(0, 5).map((orden, index) => (
                <ListItem key={orden._id || index} className="border-b border-gray-100 last:border-b-0">
                  <ListItemAvatar>
                    <Avatar className="bg-green-100">
                      <PersonIcon className="text-green-600" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box className="flex items-center justify-between">
                        <Typography variant="body2" fontWeight="medium">
                          {orden.usuario?.nombre || orden.datosContacto?.nombre || 'Donante Anónimo'}
                        </Typography>
                        <Chip
                          label={getEstadoText(orden.estadoEnvio)}
                          color={getEstadoColor(orden.estadoEnvio)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          {orden.items?.length || 0} productos • Bs {orden.subtotalFundacion?.toFixed(2) || '0.00'}
                        </Typography>
                        <Typography variant="caption" display="block" color="textSecondary">
                          {new Date(orden.createdAt).toLocaleDateString('es-ES')} - {new Date(orden.createdAt).toLocaleTimeString('es-ES')}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Ver detalles">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleVerDetalles(orden)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          {ordenes.length > 5 && (
            <Box className="text-center mt-3">
              <Typography variant="caption" color="textSecondary">
                Mostrando 5 de {ordenes.length} donaciones
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para mostrar detalles */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex items-center justify-between">
            <Typography variant="h6">
              Detalles de la Donación
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrden && (
            <Box>
              {/* Información del donante */}
              <Box className="mb-4 p-3 bg-gray-50 rounded-lg">
                <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
                  Información del Donante
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Nombre:</strong> {selectedOrden.usuario?.nombre || selectedOrden.datosContacto?.nombre || 'Anónimo'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedOrden.usuario?.email || selectedOrden.datosContacto?.email || 'No disponible'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Fecha:</strong> {new Date(selectedOrden.createdAt).toLocaleDateString('es-ES')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Hora:</strong> {new Date(selectedOrden.createdAt).toLocaleTimeString('es-ES')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Estado:</strong>
                      <Chip
                        label={getEstadoText(selectedOrden.estadoEnvio)}
                        color={getEstadoColor(selectedOrden.estadoEnvio)}
                        size="small"
                        className="ml-2"
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Productos donados */}
              <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
                Productos Donados
              </Typography>
              <List>
                {selectedOrden.items?.map((item, index) => (
                  <ListItem key={index} className="border-b border-gray-100">
                    <ListItemAvatar>
                      <Avatar className="bg-blue-100">
                        <InventoryIcon className="text-blue-600" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.producto?.nombre || item.nombre}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            Cantidad: {item.cantidad} • Precio unitario: Bs {item.precioUnitario?.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Categoría: {item.producto?.categoria || 'No especificada'}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="body2" fontWeight="bold">
                        Bs {item.subtotal?.toFixed(2)}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {/* Resumen */}
              <Box className="mt-4 p-3 bg-green-50 rounded-lg">
                <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
                  Resumen de la Donación
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Subtotal:</strong> Bs {selectedOrden.subtotalFundacion?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Total Original:</strong> Bs {selectedOrden.totalOriginal?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      Valor Donado: Bs {selectedOrden.subtotalFundacion?.toFixed(2) || '0.00'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductosDonadosCard; 