import { Box, Button, Grid, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "@mui/icons-material"; // Ícono de check
import userData from "../api/local/pruebaUsuario.json"; // Asegúrate de que la ruta sea correcta

const IngresoDinero = () => {
  const [cvu, setCvu] = useState("");  // Cuenta seleccionada
  const [monto, setMonto] = useState("");  // Monto a ingresar
  const [mensaje, setMensaje] = useState("");  // Mensaje de estado
  const [saldoDisponible, setSaldoDisponible] = useState(null);  // Saldo del usuario
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [openDialog, setOpenDialog] = useState(false);  // Estado del popup
  const [dialogMessage, setDialogMessage] = useState("");  // Mensaje del popup
  const [dialogIcon, setDialogIcon] = useState(null); // Ícono del popup
  const navigate = useNavigate();

  // Obtener el usuario autenticado desde localStorage
  const usuarioAutenticado = JSON.parse(localStorage.getItem("usuarioAutenticado"));

  // Verifica si el usuario está autenticado
  const idUsuario = usuarioAutenticado ? usuarioAutenticado.id : null;

  // Función para obtener el usuario por su ID
  const getUsuario = async (idUsuario) => {
    return userData.find(user => user.id === idUsuario);  // Retorna el usuario correspondiente
  };

  // Función para actualizar el usuario en el archivo JSON (simulado)
  const actualizarUsuarios = (usuariosActualizados) => {
    // Simula la actualización del archivo JSON (en un caso real, esto se haría con una API)
    localStorage.setItem("usuarios", JSON.stringify(usuariosActualizados));
  };

  // Obtener el saldo del usuario
  useEffect(() => {
    const obtenerUsuario = async () => {
      if (!idUsuario) {
        setMensaje("No se ha encontrado un usuario autenticado.");
        setLoading(false);
        return;
      }

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

    obtenerUsuario();
  }, [idUsuario]);

  const handleDepositar = () => {
    if (!cvu || monto <= 0) {
      setMensaje("Complete todos los campos correctamente.");
      return;
    }

    const montoIngresado = parseFloat(monto);
    if (isNaN(montoIngresado)) {
      setMensaje("El monto a ingresar no es válido.");
      return;
    }

    // Actualizar el saldo del usuario con el monto ingresado
    const nuevoSaldo = saldoDisponible + montoIngresado;
    const usuarioIndex = userData.findIndex(user => user.id === idUsuario);
    if (usuarioIndex !== -1) {
      userData[usuarioIndex].saldo = nuevoSaldo;
      // Guardar los usuarios actualizados (en localStorage o archivo simulado)
      actualizarUsuarios(userData);
    }

    // Mostrar popup de éxito
    setDialogMessage(`Ingreso de $${monto} realizado con éxito a la cuenta ${cvu}`);

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
          Ingreso de dinero
        </Typography>

        {loading ? (
          <Typography>Cargando datos del usuario...</Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Selección de cuenta */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Seleccionar CVU</InputLabel>
                <Select
                  label="Seleccionar CVU"
                  value={cvu}
                  onChange={(e) => setCvu(e.target.value)}
                >
                  <MenuItem value="mercadoPago">
                    <Typography
                      noWrap
                      sx={{
                        maxWidth: "200px", // Limitar el tamaño del texto
                        overflow: "hidden", 
                        textOverflow: "ellipsis",
                      }}
                    >
                      Mercado Pago
                    </Typography>
                  </MenuItem>
                  <MenuItem value="bancoPampa">
                    <Typography
                      noWrap
                      sx={{
                        maxWidth: "200px", // Limitar el tamaño del texto
                        overflow: "hidden", 
                        textOverflow: "ellipsis",
                      }}
                    >
                      Banco de La Pampa
                    </Typography>
                  </MenuItem>
                  {/* Agrega aquí más cuentas si es necesario */}
                </Select>
              </FormControl>
            </Grid>

            {/* Monto a ingresar */}
            <Grid item xs={12}>
              <TextField
                label="Monto a ingresar"
                type="number"
                fullWidth
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Saldo disponible */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">
                Saldo disponible: ${saldoDisponible}
              </Typography>
            </Grid>

            {mensaje && (
              <Grid item xs={12}>
                <Typography variant="body1" color="primary">
                  {mensaje}
                </Typography>
              </Grid>
            )}

            {/* Botones Aceptar y Cancelar */}
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleDepositar}
              >
                Aceptar
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => navigate("/home")}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Dialog (popup) para mostrar el mensaje de éxito */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ingreso Exitoso</DialogTitle>
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

export default IngresoDinero;