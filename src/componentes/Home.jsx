
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

const Home = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener datos del usuario autenticado
        const response = await getUsuario();
        
        if (response.success) {
          const userData = response.data;
          setUsuario({
            nombre: userData.name,
            email: userData.email,
            rol: userData.isAdmin ? 'Administrador' : 'Usuario'
          });
          
          const userBalance = userData.saldo;
          setSaldo(userBalance.toFixed(2));
        } else {
          throw new Error('No se pudo obtener los datos del usuario');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        navigate('/');
      }
    };

    cargarDatos();
  }, [navigate]);

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
                {usuario?.name?.charAt(0) || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5">{usuario?.nombre || 'Usuario'}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {usuario?.email}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {usuario?.rol}
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
              ${saldo}
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