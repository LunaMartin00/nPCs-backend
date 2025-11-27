import sql from 'mssql';
import { config } from '../data/db/connection.js';

export const getAllBuilds = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        
        const result = await pool.request()
            .query(`
                SELECT 
                    b.id,
                    b.nombre_build,
                    b.descripcion,
                    b.fecha_creacion,
                    b.costo_total,
                    c.usuario as creador
                FROM Build b
                INNER JOIN Cliente c ON b.id_cliente = c.id
                ORDER BY b.fecha_creacion DESC
            `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error en getAllBuilds:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
