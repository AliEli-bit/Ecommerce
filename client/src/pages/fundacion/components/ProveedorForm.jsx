import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Box,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
  Info as InfoIcon,
  Store as StoreIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const tiposServicio = [
  'Alimentos',
  'Materiales de construcción',
  'Equipos médicos',
  'Ropa y textiles',
  'Productos de limpieza',
  'Otros'
];

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} draggable={true} eventHandlers={{
    dragend: (e) => {
      setPosition([e.target.getLatLng().lat, e.target.getLatLng().lng]);
    },
  }} /> : null;
};

const ProveedorForm = ({ open, onClose, onSubmit, initialData }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    representante: {
      nombre: '',
      ci: ''
    },
    tipoServicio: '',
    fundacion: user?.entidadRelacionada || '',
    location: initialData?.location || [-17.7833, -63.1821], // [lat, lng] format for Leaflet
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '8px',
    marginTop: '8px'
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nombre: '',
        nit: '',
        direccion: '',
        telefono: '',
        email: '',
        password: '',
        representante: {
          nombre: '',
          ci: ''
        },
        tipoServicio: '',
        fundacion: user?.entidadRelacionada || '',
        location: [-17.7833, -63.1821] // [lat, lng] format for Leaflet
      });
    }
    setErrors({});
    setSubmitError('');
  }, [initialData, open, user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.nit?.trim()) newErrors.nit = 'El NIT es requerido';
    if (!formData.direccion?.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.telefono?.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!initialData && !formData.password?.trim()) {
      newErrors.password = 'La contraseña es requerida para nuevos proveedores';
    }
    if (!formData.tipoServicio?.trim()) newErrors.tipoServicio = 'El tipo de servicio es requerido';
    if (!formData.representante?.nombre?.trim()) newErrors['representante.nombre'] = 'El nombre del representante es requerido';
    if (!formData.representante?.ci?.trim()) newErrors['representante.ci'] = 'La cédula del representante es requerida';
    if (!formData.fundacion) newErrors.fundacion = 'La fundación es requerida';
    if (!formData.location || formData.location.length !== 2) newErrors.location = 'Debe seleccionar una ubicación en el mapa';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('representante.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        representante: {
          ...prev.representante,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleMapClick = (newPosition) => {
    setFormData(prev => ({
      ...prev,
      location: newPosition
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (validateForm()) {
      try {
        // Asegurarse de que la fundación esté incluida en los datos
        const submitData = {
          ...formData,
          fundacion: user?.entidadRelacionada
        };
        await onSubmit(submitData);
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitError(error.response?.data?.message || 'Error al guardar el proveedor');
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        className: 'rounded-xl'
      }}
    >
      <DialogTitle className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <BusinessIcon className="text-primary-600 mr-2" />
          <Typography variant="h6" component="div">
            {initialData ? 'Editar Proveedor' : 'Agregar Proveedor'}
          </Typography>
        </div>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="bg-white">
          {submitError && (
            <Alert severity="error" className="mb-4">
              {submitError}
            </Alert>
          )}
          <Grid container spacing={3}>
            {/* Información de la Empresa */}
            <Grid item xs={12}>
              <Box className="flex items-center mb-2">
                <BusinessIcon className="text-primary-600 mr-2" />
                <Typography variant="h6" className="text-gray-900">
                  Información de la Empresa
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="nombre"
                label="Nombre de la Empresa"
                value={formData.nombre}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="nit"
                label="NIT"
                value={formData.nit}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.nit}
                helperText={errors.nit}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="direccion"
                label="Dirección"
                value={formData.direccion}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.direccion}
                helperText={errors.direccion}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="telefono"
                label="Teléfono"
                value={formData.telefono}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.telefono}
                helperText={errors.telefono}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required={!initialData}
                error={!!errors.password}
                helperText={initialData ? 'Dejar en blanco para mantener la contraseña actual' : errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        edge="start"
                        tabIndex={-1}
                      >
                        <InfoIcon className="text-gray-400" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.tipoServicio}>
                <InputLabel>Tipo de Servicio</InputLabel>
                <Select
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={handleChange}
                  label="Tipo de Servicio"
                  startAdornment={
                    <InputAdornment position="start">
                      <StoreIcon className="text-gray-400" />
                    </InputAdornment>
                  }
                >
                  {tiposServicio.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tipoServicio && (
                  <Typography variant="caption" color="error">
                    {errors.tipoServicio}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Información del Representante */}
            <Grid item xs={12}>
              <Divider className="my-4" />
              <Box className="flex items-center mb-2">
                <PersonIcon className="text-primary-600 mr-2" />
                <Typography variant="h6" className="text-gray-900">
                  Información del Representante Legal
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="representante.nombre"
                label="Nombre del Representante"
                value={formData.representante?.nombre || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors['representante.nombre']}
                helperText={errors['representante.nombre']}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="representante.ci"
                label="Cédula de Identidad"
                value={formData.representante?.ci || ''}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors['representante.ci']}
                helperText={errors['representante.ci']}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Add Map after the address field */}
            <Grid item xs={12}>
              <Box className="flex items-center mb-2">
                <MyLocationIcon className="text-primary-600 mr-2" />
                <Typography variant="h6" className="text-gray-900">
                  Ubicación en el Mapa
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" className="mb-2">
                Haga clic en el mapa para seleccionar la ubicación exacta del proveedor
              </Typography>
              <div style={mapContainerStyle}>
                <MapContainer
                  center={formData.location}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker 
                    position={formData.location} 
                    setPosition={handleMapClick}
                  />
                </MapContainer>
              </div>
              {errors.location && (
                <Typography variant="caption" color="error" className="mt-1">
                  {errors.location}
                </Typography>
              )}
              <Box className="mt-2">
                <Typography variant="body2">
                  Coordenadas seleccionadas: {formData.location[0].toFixed(6)}, {formData.location[1].toFixed(6)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <Button 
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            className="bg-primary-600 hover:bg-primary-700"
          >
            {initialData ? 'Guardar Cambios' : 'Agregar Proveedor'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProveedorForm; 