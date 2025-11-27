import sql from 'mssql';
import { config } from '../data/db/connection.js';

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        let pool = await sql.connect(config);
        let result;

        if (!category || category === "todos") {
            // Consulta para todos los productos
            result = await pool.request().query(`
                SELECT 
                    p.id,
                    p.nombre,
                    c.nombre as categoria,
                    txp.precio_de_tienda as precio,
                    t.nombre_tienda as tienda,
                    p.url_imagen as imagen,
                    p.url as link
                FROM Producto p
                INNER JOIN Categoria c ON p.id_categoria = c.id
                INNER JOIN TiendaXProducto txp ON p.id = txp.id_producto
                INNER JOIN Tienda t ON txp.id_tienda = t.id
                ORDER BY p.nombre
            `);
        } else {
            // Consulta filtrada por categoría
            result = await pool.request()
                .input('categoria', sql.VarChar, category)
                .query(`
                    SELECT 
                        p.id,
                        p.nombre,
                        c.nombre as categoria,
                        txp.precio_de_tienda as precio,
                        t.nombre_tienda as tienda,
                        p.url_imagen as imagen,
                        p.url as link
                    FROM Producto p
                    INNER JOIN Categoria c ON p.id_categoria = c.id
                    INNER JOIN TiendaXProducto txp ON p.id = txp.id_producto
                    INNER JOIN Tienda t ON txp.id_tienda = t.id
                    WHERE c.nombre = @categoria
                    ORDER BY txp.precio_de_tienda ASC
                `);
        }

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error en getProductsByCategory:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

export const searchProducts = async (req, res) => {
    const { query } = req.query;

    try {
        if (!query || query.trim() === '') {
            return res.status(400).json({ message: "Término de búsqueda requerido" });
        }

        let pool = await sql.connect(config);
        
        const result = await pool.request()
            .input('searchQuery', sql.VarChar, `%${query}%`)
            .query(`
                SELECT 
                    p.id,
                    p.nombre,
                    c.nombre as categoria,
                    txp.precio_de_tienda as precio,
                    t.nombre_tienda as tienda,
                    p.url_imagen as imagen,
                    p.url as link
                FROM Producto p
                INNER JOIN Categoria c ON p.id_categoria = c.id
                INNER JOIN TiendaXProducto txp ON p.id = txp.id_producto
                INNER JOIN Tienda t ON txp.id_tienda = t.id
                WHERE p.nombre LIKE @searchQuery
                   OR c.nombre LIKE @searchQuery
                   OR t.nombre_tienda LIKE @searchQuery
                ORDER BY txp.precio_de_tienda ASC
            `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error en searchProducts:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};