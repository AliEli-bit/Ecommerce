import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Divider,
  Link,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Lock, Email, Person } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rol: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
    rol: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Reset error state when user starts typing
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields
    const newErrors = {
      email: !formData.email,
      password: !formData.password,
      rol: !formData.rol,
    };
    
    setFieldErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    try {
      const user = await login(formData.email, formData.password, formData.rol);
      const from = location.state?.from?.pathname || 
        (user.rol === 'admin' ? '/admin/dashboard' : 
         user.rol === 'proveedor' ? '/proveedor/dashboard' : 
         '/fundacion/dashboard');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)',
        p: 2,
      }}
    >
      <Card 
        sx={{ 
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'visible',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: 4, pt: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.5px',
              }}
            >
              Acceso al Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de fundaciones y administradores
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'error.main',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <FormControl 
              fullWidth 
              sx={{ mb: 3 }} 
              error={fieldErrors.rol}
            >
              <InputLabel>Tipo de usuario</InputLabel>
              <Select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                label="Tipo de usuario"
                required
                startAdornment={
                  <InputAdornment position="start" sx={{ mr: 1 }}>
                    <Person sx={{ 
                      color: fieldErrors.rol ? 'error.main' : 'text.secondary' 
                    }} />
                  </InputAdornment>
                }
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: fieldErrors.rol ? 'error.main' : 'primary.main',
                  }
                }}
              >
                <MenuItem value="admin">Administrador del sistema</MenuItem>
                <MenuItem value="fundacion">Fundación benéfica</MenuItem>
                <MenuItem value="proveedor">Proveedor</MenuItem>
              </Select>
              {fieldErrors.rol && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  Seleccione un tipo de usuario
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Correo electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={fieldErrors.email}
              helperText={fieldErrors.email && "Ingrese su correo electrónico"}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: fieldErrors.email ? 'error.main' : 'primary.main',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ 
                      color: fieldErrors.email ? 'error.main' : 'text.secondary' 
                    }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña de acceso"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={fieldErrors.password}
              helperText={fieldErrors.password && "Ingrese su contraseña"}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: fieldErrors.password ? 'error.main' : 'primary.main',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ 
                      color: fieldErrors.password ? 'error.main' : 'text.secondary' 
                    }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mb: 2,
                fontSize: 16,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #3b82f6 0%, #6366f1 100%)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Ingresar al sistema'
              )}
            </Button>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 2
            }}>
              <Link 
                href="#"
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    textDecoration: 'none' 
                  } 
                }}
              >
                Recuperar contraseña
              </Link>
              <Link 
                href="#"
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    textDecoration: 'none' 
                  } 
                }}
              >
                Solicitar acceso
              </Link>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Métodos alternativos
              </Typography>
            </Divider>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 