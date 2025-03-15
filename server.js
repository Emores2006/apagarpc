const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Define una clave secreta para autenticación
const SECRET_KEY = "mi_clave_secreta_123";

app.post("/shutdown", (req, res) => {
  const { ip, delay, key } = req.body;

  // Verificar la clave secreta antes de ejecutar comandos
  if (key !== SECRET_KEY) {
    return res.status(403).json({ error: "Acceso no autorizado" });
  }

  const command =
    delay > 0
      ? `ssh user@${ip} 'sudo shutdown -h +${delay}'`
      : `ssh user@${ip} 'sudo shutdown -h now'`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ message: `Comando de apagado enviado a ${ip}` });
  });
});

app.listen(3000, () => console.log("Servidor corriendo en el puerto 3000"));
