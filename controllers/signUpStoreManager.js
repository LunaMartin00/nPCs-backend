import { config } from "../data/db/connection.js";
import { Connection, Request, TYPES } from "tedious";
import bcrypt from "bcrypt";

export const signUpStoreManager = async (req, res) => {
    const { firstNames, lastNames, email, username, password, storeName } = req.body;

    if (!firstNames || !lastNames || !username || !email || !password || !storeName)
        return res.status(400).json({ message: "Hay campos incompletos en la información" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = new Connection(config);

    connection.on("connect", (err) => {
        if (err) return res.status(500).json({ message: "No se ha podido conectar a la base de datos", err });

        const findStoreQuery = "SELECT TOP 1 * FROM Tienda WHERE nombre = @storeName";
        const findStoreRequest = new Request(findStoreQuery, (err) => {
            if (err) {
                connection.close();
                return res.status(500).json({ message: "Error al buscar la tienda", err });
            }
        });

        findStoreRequest.addParameter("storeName", TYPES.VarChar, storeName);

        let storeId = null;
        findStoreRequest.on("row", (columns) => {
            storeId = columns[0].value;
        })

        findStoreRequest.on("requestCompleted", () => {
            if (!storeId) {
                connection.close();
                return res.status(404).json({ message: "Tienda no encontrada. Verifica el nombre de la tienda." });
            }
           
            const checkQuery = "SELECT COUNT(*) AS count FROM EncargadoDeTienda WHERE correo_electronico = @email OR usuario = @username";

            const checkUserRequest = new Request(checkQuery, (err) => {
                if (err) return res.status(500).json({ message: "Error al verificar la existencia del usuario", err });
            });

            checkUserRequest.addParameter("email", TYPES.VarChar, email);
            checkUserRequest.addParameter("username", TYPES.VarChar, username);

            let userExists = false;
            checkUserRequest.on("row", (columns) => {
                if (columns[0].value > 0) userExists = true;
            });

            checkUserRequest.on("requestCompleted", () => {
                if (userExists) {
                    connection.close();
                    return res.status(409).json({ message: "Ya existe este encargado de tienda" });
                }

                const insertQuery = "INSERT INTO EncargadoDeTienda (nombres, apellidos, correo_electronico, usuario, contrasena, id_tienda) VALUES (@firstNames, @lastNames, @email, @username, @password, @storeId)";

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
                insertRequest.addParameter("storeId", TYPES.Int, storeId)

                insertRequest.on("requestCompleted", () => {
                    connection.close();
                    res.status(201).json({ message: "Se ha creado el usuario" });
                });

                connection.execSql(insertRequest);
            });

            connection.execSql(checkUserRequest);
        });

        connection.execSql(findStoreRequest);
    });
}