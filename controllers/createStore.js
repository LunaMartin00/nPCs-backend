import { config } from "../data/db/connection.js";
import { Connection, Request, TYPES } from "tedious";

export const createStore = async (req, res) => {
    const { name, url } = req.body;

    if (!name || !url)
        return res.status(400).json({ message: "Hay campos incompletos en la información" });

    const connection = new Connection(config);

    connection.on("connect", (err) => {
        if (err) return res.status(500).json({ message: "No se ha podido conectar a la base de datos", err });

        const checkQuery = "SELECT COUNT(*) AS count FROM Tienda WHERE nombre = @name OR url = @url";

        const checkUserRequest = new Request(checkQuery, (err) => {
            if (err) return res.status(500).json({ message: "Error al verificar la existencia de la tienda", err });
        });

        checkUserRequest.addParameter("name", TYPES.VarChar, name);
        checkUserRequest.addParameter("url", TYPES.VarChar, url);

        let storeExists = false;
        checkUserRequest.on("row", (columns) => {
            if (columns[0].value > 0) storeExists = true;
        });

        checkUserRequest.on("requestCompleted", () => {
            if (storeExists) {
                connection.close();
                return res.status(409).json({ message: "Ya existe esta tienda" });
            }

            const insertQuery = "INSERT INTO Tienda (nombre, url) VALUES (@name, @url)";

            const insertRequest = new Request(insertQuery, (err) => {
                if (err) {
                    connection.close();
                    return res.status(500).json({ message: "Error en la inserción de la tienda", err });
                }
            });

            insertRequest.addParameter("name", TYPES.VarChar, name);
            insertRequest.addParameter("url", TYPES.VarChar, url);

            insertRequest.on("requestCompleted", () => {
                connection.close();
                res.status(201).json({ message: "Se ha creado la tienda" });
            });

            connection.execSql(insertRequest);
        });

        connection.execSql(checkUserRequest);
    });

    connection.connect();
};