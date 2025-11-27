import sql from 'mssql';
import { config } from '../data/db/connection.js';

export const getUserBuilds = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        let pool = await sql.connect(config);
        
        const result = await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .query(`
                SELECT * FROM Build WHERE id_cliente = @id_cliente ORDER BY fecha_creacion DESC
            `);

        const builds = result.recordset;

        res.status(200).json(builds);

    } catch (error) {
        console.error("Error en getUserBuilds:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
