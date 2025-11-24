import { config } from "../data/db/connection.js";
import { Connection, Request, TYPES } from "tedious";
import bcrypt from "bcrypt";

export const signUpStoreManager = async (req, res) => {
    const { firstNames, lastNames, email, username, password, storeName, storeUrl } = req.body;

    if (!firstNames || !lastNames || !username || !email || !password || !storeName || !storeUrl)
        return res.status(400).json({ message: "Hay campos incompletos en la información" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = new Connection(config);

    connection.on("connect", (err) => {
        if (err) return res.status(500).json({ message: "No se ha podido conectar a la base de datos", err });

        const checkQuery = "SELECT COUNT(*) AS count FROM Tienda WHERE correo_electronico = @email OR usuario = @username";

        const checkRequest = new Request(checkQuery, (err) => {
            if (err) return res.status(500).json({ message: "Error al verificar la existencia del encargado de tienda", err });
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
                return res.status(409).json({ message: "Ya existe ese encargado de tienda" });
            }

            const insertQuery = "INSERT INTO Tienda (nombres, apellidos, correo_electronico, usuario, contrasena, nombre_tienda, url_tienda) VALUES (@firstNames, @lastNames, @email, @username, @password, @storeName, @storeUrl)";

            const insertRequest = new Request(insertQuery, (err) => {
                if (err) {
                    connection.close();
                    return res.status(500).json({ message: "Error en la inserción del encargado de tienda", err });
                }
            });

            insertRequest.addParameter("firstNames", TYPES.VarChar, firstNames);
            insertRequest.addParameter("lastNames", TYPES.VarChar, lastNames);
            insertRequest.addParameter("username", TYPES.VarChar, username);
            insertRequest.addParameter("email", TYPES.VarChar, email);
            insertRequest.addParameter("password", TYPES.VarChar, hashedPassword);
            insertRequest.addParameter("storeName", TYPES.VarChar, storeName);
            insertRequest.addParameter("storeUrl", TYPES.VarChar, storeUrl);

            insertRequest.on("requestCompleted", () => {
                connection.close();
                res.status(201).json({ message: "Se ha creado el encargado de tienda" });
            });

            connection.execSql(insertRequest);
        });

        connection.execSql(checkRequest);
    });

    connection.connect();
}