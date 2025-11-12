import { config } from "../data/db/connection.js";
import { Connection, Request } from "tedious";
import bcrypt from "bcrypt";

export const signUpUser = async (req, res) => {
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
};