import sql from 'mssql';
import { config } from '../data/db/connection.js';

export const createBuild = async (req, res) => {
    const { nombre_build, descripcion, costo_total, products } = req.body;
    const id_cliente = req.user?.id;

    if (!nombre_build || !id_cliente || !products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "Faltan datos requeridos o el formato es incorrecto" });
    }

    let pool;
    try {
        pool = await sql.connect(config);
    } catch (error) {
        console.error("Error al conectar a la BD:", error);
        return res.status(500).json({ message: "Error de conexión a la base de datos" });
    }

    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);
        
        const buildResult = await request
            .input('nombre_build', sql.VarChar, nombre_build)
            .input('descripcion', sql.VarChar, descripcion)
            .input('id_cliente', sql.Int, id_cliente)
            .input('costo_total', sql.Money, costo_total)
            .query(`
                INSERT INTO Build (nombre_build, descripcion, id_cliente, costo_total)
                OUTPUT INSERTED.id
                VALUES (@nombre_build, @descripcion, @id_cliente, @costo_total)
            `);

        const buildId = buildResult.recordset[0].id;

        for (const product of products) {
            const requestProduct = new sql.Request(transaction);
            await requestProduct
                .input('id_build', sql.Int, buildId)
                .input('id_producto', sql.Int, product.id_producto)
                .input('cantidad', sql.Int, product.cantidad || 1)
                .query(`
                    INSERT INTO BuildXProducto (id_build, id_producto, cantidad)
                    VALUES (@id_build, @id_producto, @cantidad)
                `);
        }

        await transaction.commit();
        res.status(201).json({ message: "Build creada exitosamente", id: buildId });

    } catch (error) {
        if (transaction._begun) await transaction.rollback();
        console.error("Error en createBuild:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};
