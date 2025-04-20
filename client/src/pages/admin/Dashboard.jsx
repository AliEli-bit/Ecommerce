import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Button,
  ListItemButton,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = '/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalFundaciones: 0,
    totalProveedores: 0,
    totalUsuarios: 0,
    newFundaciones: 0,
    newProveedores: 0,
    newUsuarios: 0,
  });

  const [activities, setActivities] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, activitiesResponse] = await Promise.all([
          axios.get(`${API_URL}/dashboard/stats`),
          axios.get(`${API_URL}/dashboard/activities`)
        ]);

        setStats(statsResponse.data);
        console.log('Actividades recibidas:', activitiesResponse.data);
        const activitiesWithId = activitiesResponse.data.map((activity, index) => ({
          ...activity,
          tempId: index
        }));
        setActivities(activitiesWithId);
        setRecentActivities(activitiesWithId);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      showSnackbar('Error al cerrar sesión', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleDeleteActivity = async (activityId) => {
    if (activityId === undefined) {
      console.error('ID de actividad no válido:', activityId);
      showSnackbar('No se puede eliminar la actividad: ID no válido', 'error');
      return;
    }

    try {
      console.log('Intentando eliminar actividad:', activityId);
      
      // Actualizar el estado de actividades
      setActivities(prevActivities => {
        const filtered = prevActivities.filter(activity => activity.tempId !== activityId);
        console.log('Actividades actualizadas:', filtered);
        return filtered;
      });
      
      // Actualizar el estado de actividades recientes
      setRecentActivities(prevActivities => {
        const filtered = prevActivities.filter(activity => activity.tempId !== activityId);
        console.log('Actividades recientes actualizadas:', filtered);
        return filtered;
      });
      
      showSnackbar('Actividad eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      showSnackbar('Error al eliminar la actividad', 'error');
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
    <Card 
      sx={{ 
        height: '55%',
        borderRadius: 3,
        boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.1)',
        transition: 'all 0.3s ease',
        background: `linear-gradient(135deg, ${color}10, transparent 30%)`,
        '&:hover': onClick ? {
          transform: 'translateY(-5px)',
          boxShadow: `0 10px 20px ${color}20`,
          cursor: 'pointer'
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            {subtitle && (
              <Chip
                label={subtitle}
                size="small"
                sx={{ 
                  mt: 1,
                  backgroundColor: `${color}20`,
                  color: `${color}`, 
                  fontWeight: 500 
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '12px',
              p: 1.5,
              display: 'flex',
              color: color
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 32 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #3f51b5, #2196f3)',
          boxShadow: 'none',
          mb: 4
        }}
      >
        <Box sx={{ 
          maxWidth: 1480, 
          mx: 'auto', 
          px: 4,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: 'white'
          }}>
            <BusinessIcon sx={{ fontSize: 32 }} />
            Dashboard de Administración
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ color: 'white' }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1480, mx: 'auto', px: 4, pb: 4 }}>

        <Grid container spacing={3}>
          {/* Estadísticas */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Fundaciones"
              value={stats.totalFundaciones}
              icon={<BusinessIcon />}
              color="#3f51b5"
              subtitle={`+${stats.newFundaciones} este mes`}
              onClick={() => navigate('/admin/fundaciones')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Proveedores"
              value={stats.totalProveedores}
              icon={<StoreIcon />}
              color="#2e7d32"
              subtitle={`+${stats.newProveedores} nuevos`}
              onClick={() => navigate('/admin/proveedores')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Usuarios"
              value={stats.totalUsuarios}
              icon={<PeopleIcon />}
              color="#d32f2f"
              subtitle={`+${stats.newUsuarios} registrados`}
              onClick={() => navigate('/admin/usuarios')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.1)',
                p: 2 
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Acciones Rápidas
              </Typography>
              <List disablePadding>
                {[
                  { label: 'Fundaciones', icon: <BusinessIcon />, color: '#3f51b5', path: '/admin/fundaciones' },
                  { label: 'Proveedores', icon: <StoreIcon />, color: '#2e7d32', path: '/admin/proveedores' },
                  { label: 'Usuarios', icon: <PeopleIcon />, color: '#d32f2f', path: '/admin/usuarios' },
                  { label: 'Reportes', icon: <AssessmentIcon />, color: '#6a1b9a', path: '/admin/reportes' },
                ].map((action, index) => (
                  <ListItem 
                    key={index} 
                    disablePadding
                    sx={{ '&:not(:last-child)': { mb: 1 } }}
                  >
                    <ListItemButton 
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        '&:hover': { 
                          backgroundColor: `${action.color}10`
                        }
                      }}
                      onClick={() => navigate(action.path)}
                    >
                      <ListItemIcon sx={{ color: action.color, minWidth: 40 }}>
                        {action.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontWeight: 500 }}>
                            {action.label}
                          </Typography>
                        } 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Actividades Recientes */}
          <Grid item xs={12} md={8}>
            <Paper 
              sx={{ 
                borderRadius: 3,
                boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.1)',
                p: 2
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Actividades Recientes
                </Typography>
                <Chip
                  label="Ver todo"
                  variant="outlined"
                  size="small"
                  clickable
                  sx={{ borderRadius: 1 }}
                />
              </Box>
              <List disablePadding>
                {activities.map((activity, index) => (
                  <React.Fragment key={activity.tempId}>
                    <ListItem 
                      sx={{
                        py: 1.5,
                        '&:hover': { 
                          backgroundColor: 'action.hover',
                          borderRadius: 2
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            backgroundColor: '#e3f2fd',
                            borderRadius: '50%',
                            p: 1,
                            display: 'flex',
                            color: '#2196f3'
                          }}
                        >
                          <NotificationsIcon fontSize="small" />
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {activity.message}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {new Date(activity.time).toLocaleString()}
                          </Typography>
                        }
                      />
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteActivity(activity.tempId)}
                          sx={{
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.light',
                              color: 'white'
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                    {index < activities.length - 1 && (
                      <Divider sx={{ my: 0.5 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Acciones Rápidas */}
          
        </Grid>
      </Box>

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