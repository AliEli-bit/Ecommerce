import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Snackbar,
  Alert,
  Chip,
  Divider,
  Tooltip,
  LinearProgress,
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
} from '@mui/icons-material';
import axios from 'axios';

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

const Fundaciones = () => {
  const navigate = useNavigate();
  const [fundaciones, setFundaciones] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFundacion, setEditingFundacion] = useState(null);
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
    mision: '',
    areaAccion: '',
    cuentaBancaria: '',
    logo: '',
    descripcion: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchFundaciones();
  }, []);

  const fetchFundaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/fundaciones`);
      setFundaciones(response.data);
    } catch (error) {
      showSnackbar('Error al cargar las fundaciones', 'error');
    }
  };

  const handleOpenDialog = (fundacion = null) => {
    if (fundacion) {
      setFormData(fundacion);
      setEditingFundacion(fundacion);
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
        mision: '',
        areaAccion: '',
        cuentaBancaria: '',
        logo: '',
        descripcion: '',
        password: '',
      });
      setEditingFundacion(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFundacion(null);
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
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (editingFundacion) {
        await axios.put(`${API_URL}/fundaciones/${editingFundacion._id}`, formData);
        showSnackbar('Fundación actualizada correctamente');
      } else {
        const response = await axios.post(`${API_URL}/fundaciones`, formData);
        showSnackbar(
          `Fundación creada correctamente. Credenciales de acceso: Email: ${response.data.usuario.email}, Contraseña: ${formData.password}`,
          'success',
          10000
        );
      }
      handleCloseDialog();
      fetchFundaciones();
    } catch (error) {
      if (error.response?.data?.camposFaltantes) {
        setErrors(error.response.data.camposFaltantes);
        showSnackbar('Por favor complete todos los campos requeridos', 'error');
      } else if (error.response?.data?.errores) {
        setErrors(error.response.data.errores);
        showSnackbar('Error de validación', 'error');
      } else {
        showSnackbar(error.response?.data?.message || 'Error al guardar la fundación', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta fundación?')) {
      try {
        await axios.delete(`${API_URL}/fundaciones/${id}`);
        showSnackbar('Fundación eliminada correctamente');
        fetchFundaciones();
      } catch (error) {
        showSnackbar('Error al eliminar la fundación', 'error');
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
            Fundaciones
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Fundación
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Fundaciones"
            value={fundaciones.length}
            icon={BusinessIcon}
            color="#1976d2"
            subtitle="Fundaciones registradas"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ubicaciones"
            value={new Set(fundaciones.map(f => f.areaAccion)).size}
            icon={LocationIcon}
            color="#2e7d32"
            subtitle="Áreas de acción únicas"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Contactos"
            value={fundaciones.length}
            icon={PhoneIcon}
            color="#ed6c02"
            subtitle="Fundaciones con contacto"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Emails"
            value={fundaciones.length}
            icon={EmailIcon}
            color="#9c27b0"
            subtitle="Fundaciones con email"
          />
        </Grid>
      </Grid>

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
              <TableCell sx={{ fontWeight: 'bold' }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contacto</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fundaciones.map((fundacion) => (
              <TableRow 
                key={fundacion._id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.02)'
                  }
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="body1">{fundacion.nombre}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationIcon sx={{ color: 'success.main' }} />
                    <Typography variant="body2">{fundacion.direccion}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column" gap={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PhoneIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="body2">{fundacion.telefono}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmailIcon sx={{ color: 'info.main', fontSize: 16 }} />
                      <Typography variant="body2">{fundacion.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {fundacion.descripcion}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="Editar">
                      <IconButton 
                        onClick={() => handleOpenDialog(fundacion)}
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
                        onClick={() => handleDelete(fundacion._id)}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          {editingFundacion ? 'Editar Fundación' : 'Nueva Fundación'}
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
                error={errors.nombre}
                helperText={errors.nombre ? 'El nombre es requerido' : ''}
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
                error={errors.nit}
                helperText={errors.nit ? 'El NIT es requerido' : ''}
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
                error={errors.direccion}
                helperText={errors.direccion ? 'La dirección es requerida' : ''}
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
                error={errors.telefono}
                helperText={errors.telefono ? 'El teléfono es requerido' : ''}
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
                error={errors.email}
                helperText={errors.email ? 'El email es requerido' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Representante
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre del Representante"
                    name="representante.nombre"
                    value={formData.representante.nombre}
                    onChange={handleInputChange}
                    required
                    error={errors.representante}
                    helperText={errors.representante ? 'El nombre del representante es requerido' : ''}
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
                    error={errors.representante}
                    helperText={errors.representante ? 'El CI del representante es requerido' : ''}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Misión"
                name="mision"
                value={formData.mision}
                onChange={handleInputChange}
                required
                error={errors.mision}
                helperText={errors.mision ? 'La misión es requerida' : ''}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Área de Acción"
                name="areaAccion"
                value={formData.areaAccion}
                onChange={handleInputChange}
                required
                error={errors.areaAccion}
                helperText={errors.areaAccion ? 'El área de acción es requerida' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cuenta Bancaria"
                name="cuentaBancaria"
                value={formData.cuentaBancaria}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Logo (URL)"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
              />
            </Grid>
            {!editingFundacion && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contraseña del Administrador"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  error={errors.password}
                  helperText={errors.password ? 'La contraseña es requerida' : 'Esta contraseña será utilizada por el administrador de la fundación para acceder al sistema'}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
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
            {editingFundacion ? 'Actualizar' : 'Crear'}
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

export default Fundaciones; 