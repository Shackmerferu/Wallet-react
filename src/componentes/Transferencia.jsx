import { Box, Button, Grid, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "@mui/icons-material"; // Ícono de check
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

const Transferencia = () => {
  const [cvu, setCvu] = useState("");  // CVU o alias del destinatario
  const [monto, setMonto] = useState("");  // Monto a transferir
  const [mensaje, setMensaje] = useState("");  // Mensaje de estado
  const [saldoDisponible, setSaldoDisponible] = useState(null);  // Saldo del usuario
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [openDialog, setOpenDialog] = useState(false);  // Estado del popup
  const [dialogMessage, setDialogMessage] = useState("");  // Mensaje del popup
  const [dialogIcon, setDialogIcon] = useState(null); // Ícono del popup
  const navigate = useNavigate();
  const idUsuario = 1; // ID del usuario autenticado (puedes obtenerlo dinámicamente)

  // Obtener el saldo del usuario
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const usuario = await getUsuario(idUsuario);  // Obtener datos del usuario actual
        if (usuario) {
          const saldo = parseFloat(usuario.saldo);
          if (!isNaN(saldo)) {
            setSaldoDisponible(saldo);
          } else {
            setSaldoDisponible(0);
          }
        } else {
          setMensaje("No se pudo encontrar el usuario.");
        }
        setLoading(false);
      } catch (error) {
        setMensaje("No se pudo cargar el saldo del usuario.");
        setLoading(false);
      }
    };
    useEffect(() => {
  console.log("Prop usuario recibida en Transferencia:", usuario);
}, [usuario]);

    obtenerUsuario();
  }, [idUsuario]);

  const handleTransferir = () => {
    if (!cvu || monto <= 0) {
      setMensaje("Complete todos los campos correctamente.");
      return;
    }

    const montoTransferido = parseFloat(monto);
    if (isNaN(montoTransferido)) {
      setMensaje("El monto a transferir no es válido.");
      return;
    }

    if (montoTransferido > saldoDisponible) {
      setMensaje("Saldo insuficiente.");
      return;
    }

    // Obtener el destinatario de la transferencia
    const cuentaDestino = userData.find(user => user.name === cvu);

    if (!cuentaDestino) {
      setMensaje("El CVU o Alias no existe.");
      return;
    }

    // Actualizar el saldo del usuario que realiza la transferencia
    const nuevoSaldoOrigen = saldoDisponible - montoTransferido;
    const usuarioOrigenIndex = userData.findIndex(user => user.id === idUsuario);
    userData[usuarioOrigenIndex].saldo = nuevoSaldoOrigen;

    // Actualizar el saldo del destinatario
    const nuevoSaldoDestino = cuentaDestino.saldo + montoTransferido;
    const cuentaDestinoIndex = userData.findIndex(user => user.id === cuentaDestino.id);
    userData[cuentaDestinoIndex].saldo = nuevoSaldoDestino;

    // Guardar los usuarios actualizados (en localStorage o archivo simulado)
    actualizarUsuarios(userData);

    // Mostrar popup de éxito
    setDialogMessage(`Transferencia de $${monto} realizada con éxito a ${cvu}`);
    setDialogIcon(<CheckCircle sx={{ color: "green", fontSize: 50 }} />);
    setOpenDialog(true);

    // Limpiar campos
    setCvu("");
    setMonto("");

    // Redirigir automáticamente después de 2 segundos
    setTimeout(() => {
      setOpenDialog(false);
      navigate("/home");  // Redirigir a la pantalla de inicio
    }, 2000);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Transferencia de dinero
        </Typography>

        {loading ? (
          <Typography>Cargando datos del usuario...</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="CVU o Alias"
                fullWidth
                value={cvu}
                onChange={(e) => setCvu(e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Monto a transferir"
                type="number"
                fullWidth
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid container spacing={3} alignItems="center">
              {/* Coloca el botón de Transferir a la izquierda */}
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleTransferir}
                >
                  Transferir
                </Button>
              </Grid>
              {/* Coloca el saldo disponible a la derecha */}
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="textSecondary" align="right">
                  Saldo disponible: ${saldoDisponible}
                </Typography>
              </Grid>
            </Grid>

            {mensaje && (
              <Grid item xs={12}>
                <Typography variant="body1" color="primary">
                  {mensaje}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Paper>

      {/* Dialog (popup) para mostrar el mensaje de éxito */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Transferencia Exitosa</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {dialogIcon}
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          {/* No es necesario botón, ya que se redirige automáticamente */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transferencia;
