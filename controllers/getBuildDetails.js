import sql from 'mssql';
import { config } from '../data/db/connection.js';

export const getBuildDetails = async (req, res) => {
    const { id } = req.params;

    try {
        let pool = await sql.connect(config);
        
        const result = await pool.request()
            .input('id_build', sql.Int, id)
            .query(`
                SELECT 
                    p.id,
                    p.nombre,
                    c.nombre as categoria,
                    bxp.cantidad,
                    p.url_imagen,
                    p.url
                FROM BuildXProducto bxp
                INNER JOIN Producto p ON bxp.id_producto = p.id
                INNER JOIN Categoria c ON p.id_categoria = c.id
                WHERE bxp.id_build = @id_build
                ORDER BY c.nombre
            `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error en getBuildDetails:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
