import { config } from "../data/db/connection.js";
import { Connection, Request, TYPES } from "tedious";

const addStoreXProduct = (storeId, productId, stock, price) => {
    const insertStoreProdQuery = "INSERT INTO TiendaXProducto (id_tienda, id_producto, cantidad_disponible, precio_de_tienda) VALUES (@storeId, @productId, @stock, @price)";
    const insertStoreProdRequest = new Request(insertStoreProdQuery, (err) => {
        connection.close();
        if (err) {
            console.error('Error al insertar TiendaXProducto:', err);
            return res.status(500).json({ message: 'Error al asociar producto con la tienda', err });
        }
    });

    insertStoreProdRequest.addParameter('storeId', TYPES.Int, storeId);
    insertStoreProdRequest.addParameter('productId', TYPES.Int, productId);
    insertStoreProdRequest.addParameter('stock', TYPES.Int, stock);
    insertStoreProdRequest.addParameter('price', TYPES.Money, price);

    insertStoreProdRequest.on('requestCompleted', () => {
        res.status(201).json({ message: 'Producto agregado correctamente'});
    });

    connection.execSql(insertStoreProdRequest);
}

const getCategoryId = (category) => {
    if (!category || typeof category !== "string") return null;
    const key = category.trim().toLowerCase();
    const map = {
        cpu: 1,
        gpu: 2
    };
    return map[key] ?? null;
};

export const addProducts = async (req, res) => {
    const { name, price, launchDate, category, url, imageUrl, stock } = req.body;
    const storeId=req.user?.userId

    if (!name || !price || !category || !launchDate || !url || !stock)
        return res.status(400).json({ message: "Hay campos incompletos en la información" });

    const connection = new Connection(config);

    const idCategory = getCategoryId(category);
    if (idCategory === null) return res.status(400).json({ message: "Categoría desconocida" });

    if (idCategory === 1) {
        const { cores, cpuSpeed, integratedGraphics } = req.body;
        if (cores == null || cpuSpeed == null || !integratedGraphics)
            return res.status(400).json({ message: "Faltan atributos específicos para CPU" });
    }

    if (idCategory === 2) {
        const { chipset, memory, memorySpeed, size, brand } = req.body;
        if (!chipset || memory == null || memorySpeed == null || !size || !brand)
            return res.status(400).json({ message: "Faltan atributos específicos para GPU" });
    }

    connection.on("connect", (err) => {
        if (err) return res.status(500).json({ message: "No se ha podido conectar a la base de datos", err });

        const insertQuery = "INSERT INTO Producto (nombre, precio, fecha_de_lanzamiento, id_categoria, url, url_imagen) VALUES (@name, @price, @launchDate, @idCategory, @url, @imageUrl); SELECT SCOPE_IDENTITY() AS id;";

        const insertRequest = new Request(insertQuery, (err) => {
            if (err) {
                connection.close();
                return res.status(500).json({ message: "Error en la inserción del producto", err });
            }
        });

        insertRequest.addParameter("name", TYPES.VarChar, name);
        insertRequest.addParameter("price", TYPES.Money, price);
        insertRequest.addParameter("launchDate", TYPES.VarChar, launchDate);
        insertRequest.addParameter("idCategory", TYPES.Int, idCategory);
        insertRequest.addParameter("url", TYPES.VarChar, url);
        insertRequest.addParameter("imageUrl", TYPES.VarChar, imageUrl);

        let newProductId = null;
        insertRequest.on("row", (columns) => {
            // Obteniendo el valor de la nueva ID
            if (columns && columns[0]) newProductId = Number(columns[0].value);
        });

        insertRequest.on("requestCompleted", () => {
            if (!newProductId) {
                connection.close();
                return res.status(201).json({ message: "Se ha creado el producto" });
            }

            const insertSpecific = () => {
                if (idCategory === 1) {
                    const { cores, cpuSpeed, integratedGraphics } = req.body;
                    const cpuQuery = "INSERT INTO CPU (id_producto, cantidad_de_nucleos, velocidad_de_cpu, graficos_integrados) VALUES (@id, @cores, @speed, @integratedGraphics)";
                    const cpuReq = new Request(cpuQuery, (err) => {
                        if (err) {
                            connection.close();
                            return res.status(500).json({ message: "Error al insertar detalles de CPU", err });
                        }
                    });
                    cpuReq.addParameter("id", TYPES.Int, newProductId);
                    cpuReq.addParameter("cores", TYPES.Int, cores);
                    cpuReq.addParameter("speed", TYPES.Int, cpuSpeed);
                    cpuReq.addParameter("integratedGraphics", TYPES.VarChar, integratedGraphics);
                    cpuReq.on("requestCompleted", () => {
                        addStoreXProduct(storeId, newProductId, stock, price);
                        connection.close();
                        res.status(201).json({ message: "Se ha creado el producto y detalles de CPU" });
                    });
                    connection.execSql(cpuReq);


                } else if (idCategory === 2) {
                    const { chipset, memory, memorySpeed, size, brand } = req.body;
                    const gpuQuery = "INSERT INTO GPU (id_producto, chipset, memoria, velocidad_de_memoria, tamano, marca) VALUES (@id, @chipset, @memory, @memorySpeed, @size, @brand)";
                    const gpuReq = new Request(gpuQuery, (err) => {
                        if (err) {
                            connection.close();
                            return res.status(500).json({ message: "Error al insertar detalles de GPU", err });
                        }
                    });
                    gpuReq.addParameter("id", TYPES.Int, newProductId);
                    gpuReq.addParameter("chipset", TYPES.VarChar, chipset);
                    gpuReq.addParameter("memory", TYPES.Int, memory);
                    gpuReq.addParameter("memorySpeed", TYPES.Int, memorySpeed);
                    gpuReq.addParameter("size", TYPES.VarChar, size);
                    gpuReq.addParameter("brand", TYPES.VarChar, brand);
                    gpuReq.on("requestCompleted", () => {
                        addStoreXProduct(storeId, newProductId, stock, price);
                        connection.close();
                        res.status(201).json({ message: "Se ha creado el producto y detalles de GPU" });
                    });
                    connection.execSql(gpuReq);
                } else {
                    connection.close();
                    res.status(201).json({ message: "Se ha creado el producto" });
                }
            };

            if (idCategory === 1 || idCategory === 2) {
                insertSpecific();
            } else {
                connection.close();
                res.status(201).json({ message: "Se ha creado el producto" });
            }
        });

        connection.execSql(insertRequest);
    });

    connection.connect();
};