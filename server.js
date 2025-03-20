const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "mi_clave_secreta_123";

app.post("/shutdown", (req, res) => {
    const { port, delay, key, user } = req.body;

    if (key !== SECRET_KEY) {
        return res.status(403).json({ error: "Acceso no autorizado" });
    }

    const command = delay > 0 
        ? `ssh -p ${port} ${user}@localhost 'sudo shutdown -h +${delay}'`
        : `ssh -p ${port} ${user}@localhost 'sudo shutdown -h now'`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ message: `Comando de apagado enviado a la PC en el puerto ${port}` });
    });
});

app.listen(3000, () => console.log("Servidor corriendo en el puerto 3000"));
