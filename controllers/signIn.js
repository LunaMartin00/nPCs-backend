import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../keys/keys.js";
import { config } from "../data/db/connection.js";
import { Connection, Request, TYPES } from "tedious";

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    const connection = new Connection(config);

    if (!email || !password)
        return console.error("Hay campos incompletos en la información");

    connection.on("connect", async (err) => {
        if (err) return console.error("No se ha podido conectar a la base de datos", err);

        const signInQuery = "SELECT * FROM Cliente WHERE correo_electronico = @correo_electronico";

        const checkRequest = new Request(signInQuery, (err, rowCount) => {
            if (err) return console.error("Error al verificar la existencia del usuario", err);

            if (rowCount < 1) {
                return console.log("No se ha encontrado el usuario");
            }
        });

        checkRequest.addParameter("correo_electronico", TYPES.VarChar, email);

        let userFind = null;

        checkRequest.on("row", (columns) => {
            const user = {};
            columns.forEach((col) => {
                user[col.metadata.colName] = col.value;
            });
            userFind = user;
        });

        checkRequest.on("requestCompleted", async () => {
            if (!userFind) {
                return res.status(400).json({ message: "Usuario no encontrado" });
            }

            const isPasswordValid = await bcrypt.compare(password, userFind.contrasena); // false si no es cierto | true si las constraseñas coinciden
            if (!isPasswordValid)
                return res.status(400).json({ message: "Credenciales no válidas" });

            const _jwt = jwt.sign({ id: userFind.id }, JWT_SECRET, {
                expiresIn: "8h",
            });

            return res
                .status(200)
                .json({ success: true, message: "Sesión iniciada correctamente", _jwt, userFind });
        })
        connection.execSql(checkRequest);
    });
    connection.connect();
}