import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Chip,
  CardHeader,
  Divider,
  LinearProgress,
  Tooltip,
  Fab,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assessment as AssessmentIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  FilterList as FilterIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import axios from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            mr: 2,
          }}
        >
          <Icon sx={{ color: color }} />
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    unidad: '',
    stock: '',
    categoria: '',
    proveedor: '',
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [stats, setStats] = useState({
    totalProveedores: 0,
    proveedoresPendientes: 0,
    totalProductos: 0,
    productosBajoStock: 0,
  });
  const [filters, setFilters] = useState({
    categoria: '',
    proveedor: '',
    estado: '',
  });
  const [openProveedorDialog, setOpenProveedorDialog] = useState(false);
  const [proveedorFormData, setProveedorFormData] = useState({
    nombre: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    representante: {
      nombre: '',
      ci: ''
    },
    tipoServicio: ''
  });
  const [proveedorErrors, setProveedorErrors] = useState({});
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchProveedores();
    fetchProductos();
    calculateStats();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('/proveedores');
      setProveedores(response.data);
    } catch (error) {
      showSnackbar('Error al cargar los proveedores', 'error');
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get('/productos');
      console.log('Productos:', response.data); // Imprimir datos en consola
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar los productos:', error); // Imprimir error en consola
      showSnackbar('Error al cargar los productos', 'error');
    }
  };

  const calculateStats = () => {
    const totalProveedores = proveedores.length;
    const proveedoresPendientes = proveedores.filter(p => p.estado === 'pendiente').length;
    const totalProductos = productos.length;
    const productosBajoStock = productos.filter(p => p.stock < 10).length;

    setStats({
      totalProveedores,
      proveedoresPendientes,
      totalProductos,
      productosBajoStock,
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setFormData(item);
      setEditingItem(item);
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        unidad: '',
        stock: '',
        categoria: '',
        proveedor: '',
      });
      setEditingItem(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const datosFormateados = {
        ...formData,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        fundacion: user.entidadRelacionada,
        proveedor: formData.proveedor
      };

      if (editingItem) {
        await axios.put(`/productos/${editingItem._id}`, datosFormateados);
        showSnackbar('Producto actualizado correctamente');
      } else {
        await axios.post('/productos', datosFormateados);
        showSnackbar('Producto creado correctamente');
      }
      handleCloseDialog();
      fetchProductos();
      calculateStats();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      if (error.response?.data?.errores) {
        setErrors(error.response.data.errores);
        showSnackbar('Error de validación', 'error');
      } else {
        showSnackbar(error.response?.data?.message || 'Error al guardar el producto', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await axios.delete(`/productos/${id}`);
        showSnackbar('Producto eliminado correctamente');
        fetchProductos();
        calculateStats();
      } catch (error) {
        showSnackbar('Error al eliminar el producto', 'error');
      }
    }
  };

  const handleAprobarProveedor = async (id) => {
    try {
      await axios.put(`/proveedores/${id}/estado`, { estado: 'aprobado' });
      showSnackbar('Proveedor aprobado correctamente');
      fetchProveedores();
      calculateStats();
    } catch (error) {
      showSnackbar('Error al aprobar el proveedor', 'error');
    }
  };

  const handleRechazarProveedor = async (id) => {
    try {
      await axios.put(`/proveedores/${id}/estado`, { estado: 'rechazado' });
      showSnackbar('Proveedor rechazado correctamente');
      fetchProveedores();
      calculateStats();
    } catch (error) {
      showSnackbar('Error al rechazar el proveedor', 'error');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredProductos = productos.filter(producto => {
    if (filters.categoria && producto.categoria !== filters.categoria) return false;
    if (filters.proveedor && producto.proveedor._id !== filters.proveedor) return false;
    if (filters.estado && producto.estado !== filters.estado) return false;
    return true;
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleOpenProveedorDialog = () => {
    setProveedorFormData({
      nombre: '',
      nit: '',
      direccion: '',
      telefono: '',
      email: '',
      representante: {
        nombre: '',
        ci: ''
      },
      tipoServicio: ''
    });
    setProveedorErrors({});
    setOpenProveedorDialog(true);
  };

  const handleCloseProveedorDialog = () => {
    setOpenProveedorDialog(false);
  };

  const handleProveedorInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProveedorFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProveedorFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    if (proveedorErrors[name]) {
      setProveedorErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleProveedorSubmit = async (e) => {
    e.preventDefault();
    setProveedorErrors({});
    
    // Validar campos requeridos
    const camposFaltantes = {
      nombre: !proveedorFormData.nombre || proveedorFormData.nombre.trim() === '',
      nit: !proveedorFormData.nit || proveedorFormData.nit.trim() === '',
      direccion: !proveedorFormData.direccion || proveedorFormData.direccion.trim() === '',
      telefono: !proveedorFormData.telefono || proveedorFormData.telefono.trim() === '',
      email: !proveedorFormData.email || proveedorFormData.email.trim() === '',
      'representante.nombre': !proveedorFormData.representante?.nombre || proveedorFormData.representante.nombre.trim() === '',
      'representante.ci': !proveedorFormData.representante?.ci || proveedorFormData.representante.ci.trim() === '',
      tipoServicio: !proveedorFormData.tipoServicio || proveedorFormData.tipoServicio.trim() === '',
      fundacion: !user?.entidadRelacionada
    };

    const hayCamposFaltantes = Object.values(camposFaltantes).some(faltante => faltante);
    
    if (hayCamposFaltantes) {
      setProveedorErrors(camposFaltantes);
      showSnackbar('Por favor complete todos los campos requeridos', 'error');
      return;
    }

    try {
      console.log('Usuario actual:', user);
      console.log('ID de la fundación:', user.entidadRelacionada);
      
      const proveedorData = {
        nombre: proveedorFormData.nombre.trim(),
        nit: proveedorFormData.nit.trim(),
        direccion: proveedorFormData.direccion.trim(),
        telefono: proveedorFormData.telefono.trim(),
        email: proveedorFormData.email.trim(),
        representante: {
          nombre: proveedorFormData.representante.nombre.trim(),
          ci: proveedorFormData.representante.ci.trim()
        },
        tipoServicio: proveedorFormData.tipoServicio.trim(),
        fundacion: user.entidadRelacionada
      };

      console.log('Datos del proveedor a enviar:', proveedorData);
      
      const response = await axios.post('/proveedores', proveedorData);
      console.log('Respuesta del servidor:', response.data);
      
      showSnackbar('Proveedor creado correctamente');
      handleCloseProveedorDialog();
      fetchProveedores();
      calculateStats();
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Datos de error:', error.response?.data);
      
      if (error.response?.data?.camposFaltantes) {
        setProveedorErrors(error.response.data.camposFaltantes);
        const camposFaltantesLista = Object.entries(error.response.data.camposFaltantes)
          .filter(([_, faltante]) => faltante)
          .map(([campo]) => campo);
        showSnackbar(`Faltan campos requeridos: ${camposFaltantesLista.join(', ')}`, 'error');
      } else if (error.response?.data?.errores) {
        setProveedorErrors(error.response.data.errores);
        showSnackbar('Error de validación', 'error');
      } else {
        showSnackbar(error.response?.data?.message || 'Error al crear el proveedor', 'error');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      showSnackbar('Error al cerrar sesión', 'error');
    }
  };

  return (
    <Box>
      <AppBar position="static" color="primary" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard de Fundación
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)' 
              } 
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Proveedores"
            value={stats.totalProveedores}
            icon={PeopleIcon}
            color="#1976d2"
            subtitle={`${stats.proveedoresPendientes} pendientes`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Productos"
            value={stats.totalProductos}
            icon={InventoryIcon}
            color="#2e7d32"
            subtitle={`${stats.productosBajoStock} con bajo stock`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Solicitudes"
            value={stats.proveedoresPendientes}
            icon={AssessmentIcon}
            color="#ed6c02"
            subtitle="Proveedores pendientes de aprobación"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Reportes"
            value="0"
            icon={AssessmentIcon}
            color="#9c27b0"
            subtitle="Sin reportes pendientes"
          />
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Proveedores" />
        <Tab label="Productos" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenProveedorDialog}
          >
            Nuevo Proveedor
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.map((proveedor) => (
                <TableRow key={proveedor._id}>
                  <TableCell>{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={proveedor.estado}
                      color={
                        proveedor.estado === 'aprobado'
                          ? 'success'
                          : proveedor.estado === 'rechazado'
                          ? 'error'
                          : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {proveedor.estado === 'pendiente' && (
                      <>
                        <Tooltip title="Aprobar">
                          <IconButton onClick={() => handleAprobarProveedor(proveedor._id)} color="success">
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar">
                          <IconButton onClick={() => handleRechazarProveedor(proveedor._id)} color="error">
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" gap={2}>
            <TextField
              select
              label="Categoría"
              name="categoria"
              value={filters.categoria}
              onChange={handleFilterChange}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="materiales">Materiales</MenuItem>
              <MenuItem value="equipos">Equipos</MenuItem>
              <MenuItem value="servicios">Servicios</MenuItem>
              <MenuItem value="otros">Otros</MenuItem>
            </TextField>
            <TextField
              select
              label="Proveedor"
              name="proveedor"
              value={filters.proveedor}
              onChange={handleFilterChange}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Todos</MenuItem>
              {proveedores.map((proveedor) => (
                <MenuItem key={proveedor._id} value={proveedor._id}>
                  {proveedor.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Estado"
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="activo">Activo</MenuItem>
              <MenuItem value="inactivo">Inactivo</MenuItem>
            </TextField>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Producto
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProductos.map((producto) => (
                <TableRow key={producto._id}>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.descripcion}</TableCell>
                  <TableCell>${producto.precio}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box flex={1}>
                        <LinearProgress
                          variant="determinate"
                          value={(producto.stock / 100) * 100}
                          color={producto.stock < 10 ? 'error' : 'success'}
                        />
                      </Box>
                      <Typography variant="body2">
                        {producto.stock} {producto.unidad}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{producto.proveedor?.nombre}</TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton onClick={() => handleOpenDialog(producto)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => handleDelete(producto._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                error={errors.nombre}
                helperText={errors.nombre ? 'El nombre es requerido' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                error={errors.descripcion}
                helperText={errors.descripcion ? 'La descripción es requerida' : ''}
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
                value={formData.precio}
                onChange={handleInputChange}
                required
                error={errors.precio}
                helperText={errors.precio ? 'El precio es requerido' : ''}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                error={errors.stock}
                helperText={errors.stock ? 'El stock es requerido' : ''}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Unidad"
                name="unidad"
                select
                value={formData.unidad}
                onChange={handleInputChange}
                required
                error={errors.unidad}
                helperText={errors.unidad ? 'La unidad es requerida' : ''}
              >
                <MenuItem value="kg">Kilogramo (kg)</MenuItem>
                <MenuItem value="unidad">Unidad</MenuItem>
                <MenuItem value="litro">Litro</MenuItem>
                <MenuItem value="metro">Metro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Categoría"
                name="categoria"
                select
                value={formData.categoria}
                onChange={handleInputChange}
                required
                error={errors.categoria}
                helperText={errors.categoria ? 'La categoría es requerida' : ''}
              >
                <MenuItem value="materiales">Materiales</MenuItem>
                <MenuItem value="equipos">Equipos</MenuItem>
                <MenuItem value="alimentos">Alimentos</MenuItem>
                <MenuItem value="gaseosas">Gaseosas</MenuItem>
                <MenuItem value="otros">Otros</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Proveedor"
                name="proveedor"
                select
                value={formData.proveedor}
                onChange={handleInputChange}
                required
                error={errors.proveedor}
                helperText={errors.proveedor ? 'El proveedor es requerido' : ''}
              >
                {proveedores.length === 0 ? (
                  <MenuItem disabled>No hay proveedores disponibles</MenuItem>
                ) : (
                  proveedores.map((proveedor) => (
                    <MenuItem key={proveedor._id} value={proveedor._id}>
                      {proveedor.nombre} {proveedor.estado !== 'aprobado' ? '(Pendiente)' : ''}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openProveedorDialog} onClose={handleCloseProveedorDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Proveedor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={proveedorFormData.nombre}
                onChange={handleProveedorInputChange}
                required
                error={proveedorErrors.nombre}
                helperText={proveedorErrors.nombre ? 'El nombre es requerido' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="NIT"
                name="nit"
                value={proveedorFormData.nit}
                onChange={handleProveedorInputChange}
                required
                error={proveedorErrors.nit}
                helperText={proveedorErrors.nit ? 'El NIT es requerido' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={proveedorFormData.direccion}
                onChange={handleProveedorInputChange}
                required
                error={proveedorErrors.direccion}
                helperText={proveedorErrors.direccion ? 'La dirección es requerida' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={proveedorFormData.telefono}
                onChange={handleProveedorInputChange}
                required
                error={proveedorErrors.telefono}
                helperText={proveedorErrors.telefono ? 'El teléfono es requerido' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={proveedorFormData.email}
                onChange={handleProveedorInputChange}
                required
                error={proveedorErrors.email}
                helperText={proveedorErrors.email ? 'El email es requerido' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del Representante"
                name="representante.nombre"
                value={proveedorFormData.representante.nombre}
                onChange={handleProveedorInputChange}
                required
                error={proveedorErrors['representante.nombre']}
                helperText={proveedorErrors['representante.nombre'] ? 'El nombre del representante es requerido' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CI del Representante"
                name="representante.ci"
                value={proveedorFormData.representante.ci}
                onChange={handleProveedorInputChange}
                required
                error={proveedorErrors['representante.ci']}
                helperText={proveedorErrors['representante.ci'] ? 'El CI del representante es requerido' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tipo de Servicio"
                name="tipoServicio"
                select
                value={proveedorFormData.tipoServicio}
                onChange={handleProveedorInputChange}
                required
                error={proveedorErrors.tipoServicio}
                helperText={proveedorErrors.tipoServicio ? 'El tipo de servicio es requerido' : ''}
              >
                <MenuItem value="materiales">Materiales</MenuItem>
                <MenuItem value="equipos">Equipos</MenuItem>
                <MenuItem value="servicios">Servicios</MenuItem>
                <MenuItem value="otros">Otros</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProveedorDialog}>Cancelar</Button>
          <Button onClick={handleProveedorSubmit} variant="contained">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;