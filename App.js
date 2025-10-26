import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import { Connection, Request } from "tedious";

const app = express();
const PORT = 5000;
const JWT_SECRET = "f547c2b93ab5d4f3e03860c7cd2d8fee";

app.use(bodyParser.json());
app.use(cors());

const users = [];

const config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: '123456'
        }
    },
    options: {
        database: 'nPCs',
        trustServerCertificate: true
    }
}

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
app.post("/signup/cliente", async (req, res) => {
    const { firstNames, lastNames, email, username, password } = req.body;

    if (!firstNames || !lastNames || !username || !email || !password)
        return res.status(400).json({ message: "Hay campos incompletos en la información" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = new Connection(config);

    connection.on("connect", (err) => {
        if (err) return res.status(500).json({ message: "No se ha podido conectar a la base de datos", err });

        const checkQuery = `
        SELECT COUNT(*) AS count 
        FROM Cliente 
        WHERE correo_electronico = @email OR usuario = @username`;

        const checkRequest = new Request(checkQuery, (err) => {
            if (err) return res.status(500).json({ message: "Error al verificar la existencia del usuario", err });
        });

        checkRequest.addParameter("email", TYPES.VarChar, email);
        checkRequest.addParameter("username", TYPES.VarChar, username);

        let userExists = false;
        checkRequest.on("row", (columns) => {
            if (columns[0].value > 0) userExists = true;
        });

        checkRequest.on("requestCompleted", () => {
            if (userExists) {
                connection.close();
                return res.status(409).json({ message: "Ya existe ese usuario" });
            }

            const insertQuery = `INSERT INTO Cliente (nombres, apellidos, correo_electronico, usuario, contrasena)
            VALUES (@firstNames, @lastNames, @email, @username, @password)`;

            const insertRequest = new Request(insertQuery, (err) => {
                if (err) {
                    connection.close();
                    return res.status(500).json({ message: "Error en la inserción del usuario", err });
                }
            });

            insertRequest.addParameter("firstNames", TYPES.VarChar, firstNames);
            insertRequest.addParameter("lastNames", TYPES.VarChar, lastNames);
            insertRequest.addParameter("username", TYPES.VarChar, username);
            insertRequest.addParameter("email", TYPES.VarChar, email);
            insertRequest.addParameter("password", TYPES.VarChar, hashedPassword);

            insertRequest.on("requestCompleted", () => {
                connection.close();
                res.status(201).json({ message: "Se ha creado el usuario" });
            });

            connection.execSql(insertRequest);
        });

        connection.execSql(checkRequest);
    });

    connection.connect();
});

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

app.listen(PORT, () => console.log(`Servidor funcionando en: http://localhost:${PORT}`)
);