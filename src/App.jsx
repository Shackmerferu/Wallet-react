import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from './componentes/Home';
import LoginForm from './componentes/LoginForm';
import { PrivateRoute } from './componentes/PrivateRoute';
import Transferencia from './componentes/Transferencia';
import Deposito from './componentes/Deposito'; // Importa el componente de Deposito

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

function App() {
  const [usuario, setUsuario] = useState(null);
  const [saldo, setSaldo] = useState(0);

  // Cargar datos del usuario desde localStorage al inicio
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const datos = JSON.parse(usuarioGuardado);
      setUsuario(datos);
      setSaldo(datos.saldo);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm setUsuario={setUsuario} setSaldo={setSaldo} />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home usuario={usuario} saldo={saldo} setSaldo={setSaldo} />
              </PrivateRoute>
            }
          />
          <Route
            path="/transferencia"
            element={
              <PrivateRoute>
                <Transferencia usuario={usuario} saldo={saldo} setSaldo={setSaldo} />
              </PrivateRoute>
            }
          />
          <Route
            path="/deposito"
            element={
              <PrivateRoute>
                <Deposito usuario={usuario} saldo={saldo} setSaldo={setSaldo} />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;