import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 8px 16px ${color}20`
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '12px',
            p: 1.5,
            mr: 2,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
        >
          <Icon sx={{ color: color, fontSize: 28 }} />
        </Box>
        <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="h4" 
        component="div" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: color,
          mb: 1
        }}
      >
        {value}
      </Typography>
      {subtitle && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: 0.5
            }}
          />
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [fundaciones, setFundaciones] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    representante: {
      nombre: '',
      ci: ''
    },
    tipoServicio: '',
    fundacion: null
  });
  const [productoForm, setProductoForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    unidad: '',
    stock: '',
    categoria: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchProveedores();
    fetchFundaciones();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/proveedores');
      setProveedores(response.data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
      setError(error.response?.data?.message || 'Error al cargar los proveedores');
      showSnackbar('Error al cargar los proveedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFundaciones = async () => {
    try {
      const response = await axios.get('/fundaciones');
      setFundaciones(response.data);
    } catch (error) {
      console.error('Error al cargar fundaciones:', error);
      showSnackbar('Error al cargar las fundaciones', 'error');
    }
  };

  const handleOpenDialog = (proveedor = null) => {
    if (proveedor) {
      setFormData(proveedor);
      setSelectedProveedor(proveedor);
    } else {
      setFormData({
        nombre: '',
        nit: '',
        direccion: '',
        telefono: '',
        email: '',
        representante: {
          nombre: '',
          ci: ''
        },
        tipoServicio: '',
        fundacion: null
      });
      setSelectedProveedor(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProveedor(null);
  };

  const handleOpenProductDialog = (producto = null) => {
    if (producto) {
      setProductoForm({
        ...producto,
        _id: producto._id
      });
    } else {
      setProductoForm({
        nombre: '',
        descripcion: '',
        precio: '',
        unidad: '',
        stock: '',
        categoria: '',
        _id: null
      });
    }
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProductoInputChange = (e) => {
    setProductoForm({
      ...productoForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProveedor) {
        await axios.put(`/proveedores/${selectedProveedor._id}`, formData);
        showSnackbar('Proveedor actualizado correctamente');
      } else {
        if (!formData.fundacion) {
          showSnackbar('Debe seleccionar una fundación', 'error');
          return;
        }

        const proveedorData = {
          ...formData,
          fundacion: formData.fundacion
        };

        await axios.post('/proveedores', proveedorData);
        showSnackbar('Proveedor creado correctamente');
      }
      handleCloseDialog();
      fetchProveedores();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      if (error.response?.data?.camposFaltantes) {
        const campos = Object.entries(error.response.data.camposFaltantes)
          .filter(([_, faltante]) => faltante)
          .map(([campo]) => campo);
        showSnackbar(`Faltan campos requeridos: ${campos.join(', ')}`, 'error');
      } else {
        showSnackbar(error.response?.data?.message || 'Error al guardar el proveedor', 'error');
      }
    }
  };

  const handleProductoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedProveedor) {
        showSnackbar('Debe seleccionar un proveedor', 'error');
        return;
      }

      const productoData = {
        ...productoForm,
        proveedor: selectedProveedor._id
      };

      if (productoForm._id) {
        await axios.put(`${API_URL}/productos/${productoForm._id}`, productoData);
        showSnackbar('Producto actualizado correctamente');
      } else {
        await axios.post(`${API_URL}/productos`, productoData);
        showSnackbar('Producto creado correctamente');
      }

      handleCloseProductDialog();
      fetchProveedores();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      showSnackbar(error.response?.data?.message || 'Error al guardar el producto', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este proveedor?')) {
      try {
        await axios.delete(`/proveedores/${id}`);
        showSnackbar('Proveedor eliminado correctamente');
        fetchProveedores();
      } catch (error) {
        showSnackbar('Error al eliminar el proveedor', 'error');
      }
    }
  };

  const handleDeleteProducto = async (productoId) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await axios.delete(`${API_URL}/productos/${productoId}`);
        showSnackbar('Producto eliminado correctamente');
        fetchProveedores();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        showSnackbar(error.response?.data?.message || 'Error al eliminar el producto', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        sx={{
          '& .MuiButton-root': {
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease-in-out'
            }
          }
        }}
      >
        <Box display="flex" alignItems="center">
          <Tooltip title="Volver al Dashboard">
            <IconButton 
              onClick={() => navigate('/admin/dashboard')}
              sx={{ 
                mr: 2,
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Proveedores
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Proveedor
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Proveedores"
            value={proveedores.length}
            icon={BusinessIcon}
            color="#1976d2"
            subtitle="Proveedores registrados"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Fundaciones"
            value={new Set(proveedores.map(p => p.fundacion?._id)).size}
            icon={LocationIcon}
            color="#2e7d32"
            subtitle="Fundaciones asociadas"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Productos"
            value={proveedores.reduce((acc, p) => acc + (p.productos?.length || 0), 0)}
            icon={InventoryIcon}
            color="#ed6c02"
            subtitle="Total de productos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categorías"
            value={new Set(proveedores.map(p => p.tipoServicio)).size}
            icon={CategoryIcon}
            color="#9c27b0"
            subtitle="Tipos de servicios"
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
          sx={{ 
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
          sx={{ 
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      ) : proveedores.length === 0 ? (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="200px"
          sx={{ 
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Typography>No hay proveedores registrados</Typography>
        </Box>
      ) : (
        <TableContainer 
          component={Paper}
          sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            '& .MuiTableCell-root': {
              py: 2
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>NIT</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fundación</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contacto</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Productos</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.map((proveedor) => (
                <React.Fragment key={proveedor._id}>
                  <TableRow 
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.02)'
                      },
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleRow(proveedor._id)}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <BusinessIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="body1">{proveedor.nombre}</Typography>
                        {expandedRows[proveedor._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{proveedor.nit}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={proveedor.fundacion?.nombre || 'Sin fundación'}
                        color={proveedor.fundacion ? 'primary' : 'default'}
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PhoneIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                          <Typography variant="body2">{proveedor.telefono}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <EmailIcon sx={{ color: 'info.main', fontSize: 16 }} />
                          <Typography variant="body2">{proveedor.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={proveedor.productos?.length || 0}
                        color="success"
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Editar">
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(proveedor);
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'white'
                              }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(proveedor._id);
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'white'
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {expandedRows[proveedor._id] && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 0 }}>
                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Productos
                          </Typography>
                          {proveedor.productos?.length > 0 ? (
                            <Grid container spacing={2}>
                              {proveedor.productos.map((producto) => (
                                <Grid item xs={12} sm={6} md={4} key={producto._id}>
                                  <Card 
                                    sx={{ 
                                      height: '100%',
                                      transition: 'transform 0.2s ease-in-out',
                                      '&:hover': {
                                        transform: 'translateY(-2px)'
                                      }
                                    }}
                                  >
                                    <CardContent>
                                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Typography variant="h6">
                                          {producto.nombre}
                                        </Typography>
                                        <Box>
                                          <Tooltip title="Editar">
                                            <IconButton 
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenProductDialog(producto);
                                              }}
                                            >
                                              <EditIcon />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Eliminar">
                                            <IconButton 
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProducto(producto._id);
                                              }}
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Tooltip>
                                        </Box>
                                      </Box>
                                      <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ 
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          mb: 1
                                        }}
                                      >
                                        {producto.descripcion}
                                      </Typography>
                                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <MoneyIcon sx={{ color: 'success.main', fontSize: 16 }} />
                                        <Typography variant="body2">
                                          ${producto.precio}
                                        </Typography>
                                      </Box>
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <CartIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                                        <Typography variant="body2">
                                          Stock: {producto.stock} {producto.unidad}
                                        </Typography>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No hay productos registrados
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          {selectedProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="NIT"
                name="nit"
                value={formData.nit}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Representante"
                name="representante.nombre"
                value={formData.representante.nombre}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CI del Representante"
                name="representante.ci"
                value={formData.representante.ci}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Servicio</InputLabel>
                <Select
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={handleInputChange}
                  label="Tipo de Servicio"
                >
                  <MenuItem value="materiales">Materiales</MenuItem>
                  <MenuItem value="equipos">Equipos</MenuItem>
                  <MenuItem value="servicios">Servicios</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Fundación</InputLabel>
                <Select
                  name="fundacion"
                  value={formData.fundacion}
                  onChange={handleInputChange}
                  label="Fundación"
                >
                  {fundaciones.map((fundacion) => (
                    <MenuItem key={fundacion._id} value={fundacion._id}>
                      {fundacion.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              textTransform: 'none',
              px: 3
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{ 
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2
            }}
          >
            {selectedProveedor ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openProductDialog} 
        onClose={handleCloseProductDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          {productoForm._id ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={productoForm.nombre}
                onChange={handleProductoInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={productoForm.descripcion}
                onChange={handleProductoInputChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Precio"
                name="precio"
                type="number"
                value={productoForm.precio}
                onChange={handleProductoInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Unidad</InputLabel>
                <Select
                  name="unidad"
                  value={productoForm.unidad}
                  onChange={handleProductoInputChange}
                  label="Unidad"
                >
                  <MenuItem value="kg">Kilogramo (kg)</MenuItem>
                  <MenuItem value="unidad">Unidad</MenuItem>
                  <MenuItem value="litro">Litro</MenuItem>
                  <MenuItem value="metro">Metro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={productoForm.stock}
                onChange={handleProductoInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="categoria"
                  value={productoForm.categoria}
                  onChange={handleProductoInputChange}
                  label="Categoría"
                >
                  <MenuItem value="materiales">Materiales</MenuItem>
                  <MenuItem value="equipos">Equipos</MenuItem>
                  <MenuItem value="servicios">Servicios</MenuItem>
                  <MenuItem value="otros">Otros</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseProductDialog}
            sx={{ 
              textTransform: 'none',
              px: 3
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleProductoSubmit} 
            variant="contained"
            sx={{ 
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2
            }}
          >
            {productoForm._id ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Proveedores; 