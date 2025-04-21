import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
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
  <div 
    className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
        {subtitle && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}>
            {subtitle}
          </span>
        )}
      </div>
      <div className={`p-3 rounded-lg bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFundaciones();
  }, []);

  const fetchFundaciones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/fundaciones`);
      setFundaciones(response.data);
    } catch (error) {
      showSnackbar('Error al cargar las fundaciones', 'error');
    } finally {
      setLoading(false);
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
    setErrors({});
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <ArrowBackIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="ml-2 text-xl font-semibold text-gray-900">Fundaciones</span>
              </div>
            </div>
            <button
              onClick={() => handleOpenDialog()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <AddIcon className="w-5 h-5 mr-2" />
              Nueva Fundación
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Fundaciones"
            value={fundaciones.length}
            icon={BusinessIcon}
            color="blue"
            subtitle="Fundaciones registradas"
          />
          <StatCard
            title="Ubicaciones"
            value={new Set(fundaciones.map(f => f.areaAccion)).size}
            icon={LocationIcon}
            color="green"
            subtitle="Áreas de acción únicas"
          />
          <StatCard
            title="Contactos"
            value={fundaciones.length}
            icon={PhoneIcon}
            color="yellow"
            subtitle="Fundaciones con contacto"
          />
          <StatCard
            title="Emails"
            value={fundaciones.length}
            icon={EmailIcon}
            color="purple"
            subtitle="Fundaciones con email"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fundaciones.map((fundacion) => (
                  <tr key={fundacion._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BusinessIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{fundacion.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <LocationIcon className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm text-gray-500">{fundacion.direccion}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <PhoneIcon className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-gray-500">{fundacion.telefono}</span>
                        </div>
                        <div className="flex items-center">
                          <EmailIcon className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-sm text-gray-500">{fundacion.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 line-clamp-2">{fundacion.descripcion}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenDialog(fundacion)}
                          className="p-1 rounded-lg text-blue-600 hover:bg-blue-50"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(fundacion._id)}
                          className="p-1 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <DeleteIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-lg"
        }}
      >
        <DialogTitle className="border-b border-gray-200 px-6 py-4">
          {editingFundacion ? 'Editar Fundación' : 'Nueva Fundación'}
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              required
              error={errors.direccion}
              helperText={errors.direccion ? 'La dirección es requerida' : ''}
              className="md:col-span-2"
            />
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
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Representante</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>
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
              className="md:col-span-2"
            />
            <TextField
              fullWidth
              label="Área de Acción"
              name="areaAccion"
              value={formData.areaAccion}
              onChange={handleInputChange}
              required
              error={errors.areaAccion}
              helperText={errors.areaAccion ? 'El área de acción es requerida' : ''}
              className="md:col-span-2"
            />
            <TextField
              fullWidth
              label="Cuenta Bancaria"
              name="cuentaBancaria"
              value={formData.cuentaBancaria}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Logo (URL)"
              name="logo"
              value={formData.logo}
              onChange={handleInputChange}
            />
            {!editingFundacion && (
              <TextField
                fullWidth
                label="Contraseña del Administrador"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                error={errors.password}
                helperText={errors.password ? 'La contraseña es requerida' : 'Esta contraseña será utilizada por el administrador de la fundación'}
                className="md:col-span-2"
              />
            )}
            <TextField
              fullWidth
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              multiline
              rows={3}
              className="md:col-span-2"
            />
          </div>
        </DialogContent>
        <DialogActions className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleCloseDialog}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {editingFundacion ? 'Actualizar' : 'Crear'}
          </button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg ${
          snackbar.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <p className="text-sm font-medium">{snackbar.message}</p>
        </div>
      )}
    </div>
  );
};

export default Fundaciones; 