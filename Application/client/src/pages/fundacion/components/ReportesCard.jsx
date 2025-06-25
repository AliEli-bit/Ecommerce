import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  TableChart as TableChartIcon,
  Analytics as AnalyticsIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from '../../../config/axios';
import EstadisticasCard from './EstadisticasCard';

const ReportesCard = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Filtros
  const [filtroPeriodo, setFiltroPeriodo] = useState('mes');
  const [filtroProveedor, setFiltroProveedor] = useState('todos');
  const [filtroCliente, setFiltroCliente] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  // Datos para filtros
  const [proveedores, setProveedores] = useState([]);
  const [clientes, setClientes] = useState([]);
  
  // Estadísticas
  const [stats, setStats] = useState({
    totalDonaciones: 0,
    totalProductos: 0,
    totalValor: 0,
    promedioPorDonacion: 0,
    donacionesEntregadas: 0,
    donacionesPendientes: 0
  });

  useEffect(() => {
    fetchOrdenes();
    setFechasPorDefecto();
  }, []);

  const setFechasPorDefecto = () => {
    const hoy = new Date();
    let inicio, fin;
    
    switch (filtroPeriodo) {
      case 'dia':
        inicio = startOfDay(hoy);
        fin = endOfDay(hoy);
        break;
      case 'semana':
        inicio = startOfWeek(hoy, { locale: es });
        fin = endOfWeek(hoy, { locale: es });
        break;
      case 'mes':
        inicio = startOfMonth(hoy);
        fin = endOfMonth(hoy);
        break;
      default:
        inicio = startOfMonth(hoy);
        fin = endOfMonth(hoy);
    }
    
    setFechaInicio(format(inicio, 'yyyy-MM-dd'));
    setFechaFin(format(fin, 'yyyy-MM-dd'));
  };

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/ordenes/fundacion');
      
      if (response.data.success) {
        const ordenesData = response.data.data || [];
        setOrdenes(ordenesData);
        
        // Extraer proveedores y clientes únicos
        const proveedoresUnicos = new Set();
        const clientesUnicos = new Set();
        
        ordenesData.forEach(orden => {
          orden.items?.forEach(item => {
            if (item.proveedor) {
              proveedoresUnicos.add(item.proveedor);
            }
          });
          if (orden.usuario?.nombre) {
            clientesUnicos.add(orden.usuario.nombre);
          }
        });
        
        setProveedores(Array.from(proveedoresUnicos));
        setClientes(Array.from(clientesUnicos));
        
        calcularEstadisticas(ordenesData);
      } else {
        setError(response.data.message || 'Error al cargar las órdenes');
      }
    } catch (err) {
      console.error('Error al obtener órdenes:', err);
      setError(err.response?.data?.message || 'Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (ordenesData) => {
    const ordenesFiltradas = filtrarOrdenes(ordenesData);
    
    const totalDonaciones = ordenesFiltradas.length;
    const totalProductos = ordenesFiltradas.reduce((sum, orden) => 
      sum + (orden.items?.reduce((itemSum, item) => itemSum + (item.cantidad || 0), 0) || 0), 0);
    const totalValor = ordenesFiltradas.reduce((sum, orden) => sum + (orden.subtotalFundacion || 0), 0);
    const promedioPorDonacion = totalDonaciones > 0 ? totalValor / totalDonaciones : 0;
    
    const donacionesEntregadas = ordenesFiltradas.filter(orden => orden.estadoEnvio === 'entregado').length;
    const donacionesPendientes = ordenesFiltradas.filter(orden => orden.estadoEnvio !== 'entregado').length;
    
    setStats({
      totalDonaciones,
      totalProductos,
      totalValor,
      promedioPorDonacion,
      donacionesEntregadas,
      donacionesPendientes
    });
  };

  const filtrarOrdenes = (ordenesData) => {
    return ordenesData.filter(orden => {
      // Filtro por fecha
      const fechaOrden = new Date(orden.createdAt);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;
      
      if (inicio && fin) {
        if (fechaOrden < inicio || fechaOrden > fin) return false;
      }
      
      // Filtro por estado
      if (filtroEstado !== 'todos' && orden.estadoEnvio !== filtroEstado) {
        return false;
      }
      
      // Filtro por cliente
      if (filtroCliente !== 'todos' && orden.usuario?.nombre !== filtroCliente) {
        return false;
      }
      
      // Filtro por proveedor (si algún item del proveedor está en la orden)
      if (filtroProveedor !== 'todos') {
        const tieneProveedor = orden.items?.some(item => item.proveedor === filtroProveedor);
        if (!tieneProveedor) return false;
      }
      
      return true;
    });
  };

  const handleFiltroPeriodoChange = (event) => {
    const nuevoPeriodo = event.target.value;
    setFiltroPeriodo(nuevoPeriodo);
    
    const hoy = new Date();
    let inicio, fin;
    
    switch (nuevoPeriodo) {
      case 'dia':
        inicio = startOfDay(hoy);
        fin = endOfDay(hoy);
        break;
      case 'semana':
        inicio = startOfWeek(hoy, { locale: es });
        fin = endOfWeek(hoy, { locale: es });
        break;
      case 'mes':
        inicio = startOfMonth(hoy);
        fin = endOfMonth(hoy);
        break;
      case 'personalizado':
        return; // No cambiar fechas si es personalizado
      default:
        inicio = startOfMonth(hoy);
        fin = endOfMonth(hoy);
    }
    
    setFechaInicio(format(inicio, 'yyyy-MM-dd'));
    setFechaFin(format(fin, 'yyyy-MM-dd'));
  };

  const aplicarFiltros = () => {
    calcularEstadisticas(ordenes);
  };

  const exportarReporte = () => {
    const ordenesFiltradas = filtrarOrdenes(ordenes);

    // Encabezados
    let csv = [
      [
        'Fecha',
        'Nombre Cliente',
        'Producto',
        'Cantidad',
        'Precio Unitario',
        'Subtotal',
        'Estado'
      ].join(';')
    ];

    // Datos
    ordenesFiltradas.forEach(orden => {
      orden.items?.forEach(item => {
        csv.push([
          format(new Date(orden.createdAt), 'dd/MM/yyyy'),
          orden.usuario?.nombre || 'Anónimo',
          item.producto?.nombre || item.nombre,
          item.cantidad,
          item.precioUnitario?.toFixed(2) || '',
          item.subtotal?.toFixed(2) || '',
          orden.estadoEnvio
        ].join(';'));
      });
    });

    // Descargar archivo
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_donaciones_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Cargando reportes...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ boxShadow: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Alert severity="error">
            <Typography variant="h6" sx={{ mb: 1 }}>Error al cargar reportes</Typography>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const ordenesFiltradas = filtrarOrdenes(ordenes);

  return (
    <Card sx={{ boxShadow: 3, border: 'none' }}>
      <CardHeader
        sx={{
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'grey.200',
          pb: 2
        }}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 2, fontSize: 28, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Reportes de Donaciones
            </Typography>
          </Box>
        }
        subheader={
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Análisis detallado de donaciones y estadísticas
          </Typography>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Aplicar filtros">
              <IconButton 
                onClick={aplicarFiltros} 
                sx={{ color: 'primary.main', '&:hover': { bgcolor: 'primary.50' } }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exportar reporte">
              <IconButton 
                onClick={exportarReporte} 
                sx={{ color: 'primary.main', '&:hover': { bgcolor: 'primary.50' } }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar datos">
              <IconButton 
                onClick={fetchOrdenes} 
                sx={{ color: 'primary.main', '&:hover': { bgcolor: 'primary.50' } }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      
      <CardContent sx={{ p: 0 }}>
        {/* Filtros */}
        <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'grey.200' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
            Filtros de Búsqueda
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={{ bgcolor: 'white' }}>
                <InputLabel>Período</InputLabel>
                <Select
                  value={filtroPeriodo}
                  onChange={handleFiltroPeriodoChange}
                  label="Período"
                  startAdornment={<CalendarIcon sx={{ mr: 1, color: 'grey.400' }} />}
                >
                  <MenuItem value="dia">Hoy</MenuItem>
                  <MenuItem value="semana">Esta semana</MenuItem>
                  <MenuItem value="mes">Este mes</MenuItem>
                  <MenuItem value="personalizado">Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {filtroPeriodo === 'personalizado' && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Fecha inicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ bgcolor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Fecha fin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ bgcolor: 'white' }}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={{ bgcolor: 'white' }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="procesando">Procesando</MenuItem>
                  <MenuItem value="enviado">Enviado</MenuItem>
                  <MenuItem value="entregado">Entregado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={{ bgcolor: 'white' }}>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  label="Cliente"
                  startAdornment={<PeopleIcon sx={{ mr: 1, color: 'grey.400' }} />}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {clientes.map((cliente, index) => (
                    <MenuItem key={index} value={cliente}>{cliente}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'grey.200' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ px: 3 }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              icon={<AnalyticsIcon />} 
              label="Estadísticas" 
              sx={{ display: 'flex', alignItems: 'center' }}
            />
            <Tab 
              icon={<TableChartIcon />} 
              label="Detalle de Donaciones" 
              sx={{ display: 'flex', alignItems: 'center' }}
            />
          </Tabs>
        </Box>

        {/* Contenido de las tabs */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              {/* Estadísticas Rápidas */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                  Resumen del Período
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      bgcolor: 'primary.50', 
                      borderRadius: 2,
                      border: 1,
                      borderColor: 'primary.200'
                    }}>
                      <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {stats.totalDonaciones}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Donaciones
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      bgcolor: 'success.50', 
                      borderRadius: 2,
                      border: 1,
                      borderColor: 'success.200'
                    }}>
                      <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {stats.totalProductos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Productos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      bgcolor: 'warning.50', 
                      borderRadius: 2,
                      border: 1,
                      borderColor: 'warning.200'
                    }}>
                      <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Bs {stats.totalValor.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Valor Total
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      bgcolor: 'secondary.50', 
                      borderRadius: 2,
                      border: 1,
                      borderColor: 'secondary.200'
                    }}>
                      <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Bs {stats.promedioPorDonacion.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Promedio
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Estadísticas Detalladas */}
              <EstadisticasCard 
                filtros={{
                  fechaInicio,
                  fechaFin,
                  estado: filtroEstado,
                  cliente: filtroCliente,
                  proveedor: filtroProveedor
                }}
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TableChartIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Detalle de Donaciones ({ordenesFiltradas.length} registros)
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={exportarReporte}
                  sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                >
                  Exportar CSV
                </Button>
              </Box>
              
              <TableContainer component={Paper} sx={{ boxShadow: 3, border: 1, borderColor: 'grey.200', borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordenesFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <InventoryIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              No hay donaciones que coincidan con los filtros seleccionados
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      ordenesFiltradas.map((orden, index) => (
                        orden.items?.map((item, itemIndex) => (
                          <TableRow 
                            key={`${orden._id}-${itemIndex}`}
                            sx={{ bgcolor: index % 2 === 0 ? 'white' : 'grey.50' }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {format(new Date(orden.createdAt), 'dd/MM/yyyy')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {orden.usuario?.nombre || 'Anónimo'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {item.producto?.nombre || item.nombre}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={item.cantidad} 
                                size="small" 
                                sx={{ bgcolor: 'primary.100', color: 'primary.800' }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                Bs {item.precioUnitario?.toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                Bs {item.subtotal?.toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getEstadoText(orden.estadoEnvio)}
                                color={getEstadoColor(orden.estadoEnvio)}
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportesCard; 