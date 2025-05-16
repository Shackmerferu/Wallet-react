import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUsuario } from '../servicios/authService';
import { Button, Typography, Paper, Box, Grid, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Home = ({ usuario: propUsuario, saldo: propSaldo, setSaldo }) => {
  const navigate = useNavigate();
  const [localUsuario, setLocalUsuario] = useState(propUsuario);
  const [localSaldo, setLocalSaldo] = useState(propSaldo);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      const response = await getUsuario();
      if (response.success) {
        const userData = response.data;
        setLocalUsuario({ ...userData, rol: userData.isAdmin ? 'Administrador' : 'Usuario' });
        setLocalSaldo(userData.saldo.toFixed(2));
        setSaldo(userData.saldo.toFixed(2)); // Asegura que el estado global se actualice al cargar
      } else {
        throw new Error('No se pudieron obtener los datos del usuario');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [navigate, setSaldo]);

  useEffect(() => {
    setLocalSaldo(propSaldo); // Actualiza el estado local cuando la prop saldo cambia
  }, [propSaldo]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTransferencia = () => {
    navigate('/transferencia');
  };

  const handleDeposito = () => {
    navigate('/deposito');
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
          {/* Encabezado con info del usuario */}
          <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 3 }}>
            <Grid item>
              <Avatar sx={{ width: 56, height: 56 }}>
                {localUsuario?.nombre?.charAt(0) || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{localUsuario?.nombre || 'Usuario'}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {localUsuario?.email}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {localUsuario?.rol}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </Grid>
          </Grid>

          {/* Saldo */}
          <Paper elevation={2} sx={{ padding: 3, marginBottom: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Saldo actual
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              ${localSaldo}
            </Typography>
          </Paper>

          {/* Acciones */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleTransferencia}
                sx={{ height: '100px' }}
              >
                Transferencia
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleDeposito}
                sx={{ height: '100px' }}
              >
                Depósito
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Home;