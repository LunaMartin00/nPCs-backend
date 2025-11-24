import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../keys/keys.js";
import { config } from "../data/db/connection.js";
import { Connection, Request, TYPES } from "tedious";

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    const connection = new Connection(config);

    if (!email || !password)
        return res.status(400).json({ message: "Hay campos incompletos en la información"});

    connection.on("connect", async (err) => {
        if (err) return res.status(500).json("No se ha podido conectar a la base de datos", err);

        const managerQuery = "SELECT * FROM Tienda WHERE correo_electronico = @correo_electronico";
        const managerRequest = new Request(managerQuery, (err) => {
            if (err) {
                connection.close();
                return res.status(500).json({ message: "Error al verificar la existencia del encargado de tienda", err });
            }
        });

        managerRequest.addParameter("correo_electronico", TYPES.VarChar, email);

        let userFind = null;
        let role = null;

        managerRequest.on("row", (columns) => {
            const user = {};
            columns.forEach((col) => {
                user[col.metadata.colName] = col.value;
            });
            userFind = user;
            role = "encargado de tienda";
        });

        managerRequest.on("requestCompleted", async () => {
            const proceedAuth = async () => {
                if (!userFind) {
                    connection.close();
                    return res.status(400).json({ message: "Usuario no encontrado" });
                }

                const isPasswordValid = await bcrypt.compare(password, userFind.contrasena);
                if (!isPasswordValid) {
                    connection.close();
                    return res.status(400).json({ message: "Credenciales no válidas" });
                }

                const userId = userFind.id;
                const payload = { id: userId, role };
                const _jwt = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

                connection.close();
                return res.status(200).json({ success: true, message: "Sesión iniciada correctamente", _jwt, role });
            };

            if (userFind) {
                return proceedAuth();
            }

            const clientQuery = "SELECT * FROM Cliente WHERE correo_electronico = @correo_electronico";
            const clientRequest = new Request(clientQuery, (err) => {
                if (err) {
                    connection.close();
                    return res.status(500).json({ message: "Error al verificar la existencia del usuario", err });
                }
            });

            clientRequest.addParameter("correo_electronico", TYPES.VarChar, email);

            clientRequest.on("row", (columns) => {
                const user = {};
                columns.forEach((col) => {
                    user[col.metadata.colName] = col.value;
                });
                userFind = user;
                role = "cliente";
            });

            clientRequest.on("requestCompleted", async () => {
                return proceedAuth();
            });

            connection.execSql(clientRequest);
        });

        connection.execSql(managerRequest);
    });

    connection.connect();
}