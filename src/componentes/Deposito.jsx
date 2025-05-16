import {
  Box, Button, Grid, MenuItem, Paper, Select, TextField, Typography, Dialog, DialogContent, DialogTitle
} from "@mui/material";
import { useState, useEffect } from "react";
import { CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import userData from "../api/local/pruebaUsuario.json"; // Ajusta la ruta según sea necesario

// Función para obtener el usuario por su ID
const getUsuario = async (idUsuario) => {
  return userData.find(user => user.id === idUsuario);  // Retorna el usuario correspondiente
};

// Función para actualizar el usuario en el archivo JSON (simulado)
const actualizarUsuarios = (usuariosActualizados) => {
  // Simula la actualización del archivo JSON (en un caso real, esto se haría con una API)
  localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
};

const metodosDeposito = [
  { value: "Mercado Pago", label: "Mercado Pago" },
  { value: "Banco de La Pampa", label: "Banco de La Pampa" },
];

const Deposito = ({ usuario, saldo: propSaldo, setSaldo }) => {
  const navigate = useNavigate();

  // "Variable global" dentro del componente
  const idUsuario = usuario?.id;

  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [saldoDisponibleLocal, setSaldoDisponibleLocal] = useState(propSaldo);

  useEffect(() => {
    console.log("Prop usuario recibida en Deposito:", usuario);
  }, []); // Se ejecuta solo una vez al montarse

  useEffect(() => {
    if (!idUsuario) return;

    let usuariosGuardados = JSON.parse(localStorage.getItem("usuarios"));

    if (!usuariosGuardados || usuariosGuardados.length === 0) {
      usuariosGuardados = userData; // fallback al JSON estático
    }

    const usuarioEncontrado = usuariosGuardados.find(u => u.id === idUsuario);
    if (usuarioEncontrado) {
      const saldo = parseFloat(usuarioEncontrado.saldo);
      setSaldoDisponibleLocal(isNaN(saldo) ? 0 : saldo);
    } else {
      setSaldoDisponibleLocal(0);
    }
  }, [idUsuario]);

  const handleDepositar = () => {
    setError("");

    if (!idUsuario) {
      setError("No se ha podido identificar al usuario.");
      return;
    }

    if (!monto || !metodo || parseFloat(monto) <= 0) {
      setError("Complete todos los campos correctamente.");
      return;
    }

    // Obtener la lista de usuarios actual (desde localStorage o fallback)
    let usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || userData;

    // Buscar al usuario logueado en la lista actual
    const usuarioEncontrado = usuariosGuardados.find(user => user.id === idUsuario);

    if (!usuarioEncontrado) {
      setError("Usuario no encontrado en los datos.");
      return;
    }

    // Sumar el monto al saldo
    const nuevoSaldo = parseFloat(usuarioEncontrado.saldo) + parseFloat(monto);
    usuarioEncontrado.saldo = nuevoSaldo;

    // Guardar la lista actualizada en localStorage
    actualizarUsuarios(usuariosGuardados);
  
    // guardar la lista en el json
    // Simular la actualización del archivo JSON (en un caso real, esto se haría con una API)
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    // Actualizar el estado local y la prop de saldo
    setSaldoDisponibleLocal(nuevoSaldo);
    setSaldo(nuevoSaldo); // ¡Asegúrate de que esta línea esté aquí!
    setOpenDialog(true);

    setTimeout(() => {
      setOpenDialog(false);
      navigate("/home");
    }, 2000);
  };


  const handleCancelar = () => {
    navigate("/home");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Depósito de Dinero
        </Typography>

        <Grid container spacing={2} direction="column">
          <Grid item container spacing={2} direction="row" alignItems="center">
            <Grid item xs={12} md={6}>
              <Select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                displayEmpty
                fullWidth
                sx={{ minHeight: "56px", width: "100%" }}
              >
                <MenuItem value="" disabled>
                  Seleccionar método de depósito
                </MenuItem>
                {metodosDeposito.map((metodo) => (
                  <MenuItem key={metodo.value} value={metodo.value}>
                    {metodo.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Monto a depositar"
                type="number"
                fullWidth
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          </Grid>

          <Grid item sx={{ mt: 2 }}>
            <Typography variant="subtitle1" color="textSecondary">
              Saldo disponible: ${saldoDisponibleLocal}
            </Typography>
          </Grid>

          {error && (
            <Grid item>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}

          <Grid item container spacing={2} direction="row" sx={{ mt: 3 }}>
            <Grid item>
              <Button onClick={handleCancelar}>
                Cancelar
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDepositar}
              >
                Depositar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Depósito exitoso</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <CheckCircle sx={{ fontSize: 50, color: "green" }} />
          <Typography>
            Se ha depositado ${monto} mediante {metodo}.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Deposito;