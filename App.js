import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;
const JWT_SECRET = "f547c2b93ab5d4f3e03860c7cd2d8fee";

app.use(bodyParser.json());
app.use(cors());

const users = [];

// Middleware: Verificacion de Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No tienes autorización para ver este recurso" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token no válido" });
        req.user = user;
        next();
    });
};

// Rutas
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Credenciales no válidas" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
});

app.get("/protected", verifyToken, (req, res) => {
    res.status(200).json({ message: "Datos protegidos accedidos", user: req.user });
});

app.listen(PORT, () => console.log('Servidor funcionando en: http://localhost:${PORT}')
);