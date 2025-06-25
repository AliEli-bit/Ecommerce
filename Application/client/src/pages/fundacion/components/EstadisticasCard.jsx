import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from '../../../config/axios';

const EstadisticasCard = ({ filtros }) => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (filtros) {
      fetchEstadisticas();
    }
  }, [filtros]);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
      if (filtros.estado && filtros.estado !== 'todos') params.append('estado', filtros.estado);
      if (filtros.cliente && filtros.cliente !== 'todos') params.append('cliente', filtros.cliente);
      
      const response = await axios.get(`/ordenes/estadisticas?${params.toString()}`);
      
      if (response.data.success) {
        setEstadisticas(response.data.data);
      } else {
        setError(response.data.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('Error al obtener estadísticas:', err);
      setError(err.response?.data?.message || 'Error al cargar estadísticas');
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

  if (loading) {
    return (
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} thickness={4} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Cargando estadísticas...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!estadisticas) {
    return (
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Selecciona filtros para ver estadísticas
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { resumen, porEstado, porCliente, productosMasDonados, tendencias } = estadisticas;

  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 1, color: 'secondary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Estadísticas Detalladas
            </Typography>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 0 }}>
        {/* Estados de Envío */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <ShippingIcon sx={{ mr: 1, color: 'primary.main' }} />
            Estados de Envío
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(porEstado).map(([estado, datos]) => (
              <Grid item xs={6} sm={4} key={estado}>
                <Box sx={{ 
                  p: 2, 
                  border: 1, 
                  borderColor: 'grey.300', 
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': { boxShadow: 2 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={getEstadoText(estado)}
                      color={getEstadoColor(estado)}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {datos.count}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Bs {datos.valor.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Top Clientes */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1, color: 'success.main' }} />
            Top Clientes
          </Typography>
          <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
            {Object.entries(porCliente)
              .sort(([,a], [,b]) => b.valor - a.valor)
              .slice(0, 5)
              .map(([cliente, datos], index) => (
                <ListItem 
                  key={cliente}
                  sx={{ 
                    borderBottom: index < 4 ? 1 : 0, 
                    borderColor: 'grey.100',
                    '&:last-child': { borderBottom: 0 }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {cliente.charAt(0).toUpperCase()}
                      </Typography>
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {cliente}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {datos.count} donaciones
                      </Typography>
                    }
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Bs {datos.valor.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Productos Más Donados */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <InventoryIcon sx={{ mr: 1, color: 'warning.main' }} />
            Productos Más Donados
          </Typography>
          <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
            {Object.entries(productosMasDonados)
              .sort(([,a], [,b]) => b.cantidad - a.cantidad)
              .slice(0, 5)
              .map(([producto, datos], index) => (
                <ListItem 
                  key={producto}
                  sx={{ 
                    borderBottom: index < 4 ? 1 : 0, 
                    borderColor: 'grey.100',
                    '&:last-child': { borderBottom: 0 }
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>
                      <InventoryIcon sx={{ fontSize: 18, color: 'white' }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {producto}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {datos.cantidad} unidades
                      </Typography>
                    }
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    Bs {datos.valor.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Tendencia Últimos 7 Días */}
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1, color: 'info.main' }} />
            Tendencia Últimos 7 Días
          </Typography>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
            {tendencias.ultimos7Dias.map((dia, index) => (
              <Box 
                key={dia.fecha}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: index < 6 ? 1 : 0,
                  borderColor: 'grey.100',
                  '&:last-child': { borderBottom: 0 },
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {format(parseISO(dia.fecha), 'EEEE dd/MM', { locale: es })}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    label={`${dia.ordenes} órdenes`} 
                    size="small" 
                    sx={{ bgcolor: 'info.100', color: 'info.800' }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    Bs {dia.valor.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EstadisticasCard; 