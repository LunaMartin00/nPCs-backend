
import sql from 'mssql';
import { config } from '../data/db/connection.js'

export const addProduct = async (req, res) => {
    const {
        nombre,
        precio,
        fecha_de_lanzamiento,
        id_categoria,
        url,
        url_imagen,
        id_tienda,
        cantidad_disponible,
        precio_de_tienda
    } = req.body;

    // Validaciones básicas
    if (!nombre || !precio || !id_categoria || !url || !url_imagen || !id_tienda || !cantidad_disponible || !precio_de_tienda) {
        return res.status(400).json({ 
            message: "Todos los campos obligatorios deben ser completados" 
        });
    }

    if (parseFloat(precio) <= 0 || parseFloat(precio_de_tienda) <= 0) {
        return res.status(400).json({ 
            message: "Los precios deben ser mayores a 0" 
        });
    }

    if (parseInt(cantidad_disponible) < 0) {
        return res.status(400).json({ 
            message: "La cantidad no puede ser negativa" 
        });
    }

    try {
        let pool = await sql.connect(config);

        // 1. Verificar si el producto ya existe (mismo nombre y misma tienda)
        const existingProduct = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('id_tienda', sql.Int, id_tienda)
            .query(`
                SELECT p.id 
                FROM Producto p
                INNER JOIN TiendaXProducto txp ON p.id = txp.id_producto
                WHERE p.nombre = @nombre AND txp.id_tienda = @id_tienda
            `);

        if (existingProduct.recordset.length > 0) {
            return res.status(409).json({ 
                message: "Este producto ya existe en la tienda seleccionada" 
            });
        }

        // 2. Insertar el producto en la tabla Producto
        const productResult = await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('precio', sql.Decimal(10, 2), precio)
            .input('fecha_de_lanzamiento', sql.Date, fecha_de_lanzamiento || null)
            .input('id_categoria', sql.Int, id_categoria)
            .input('url', sql.VarChar, url)
            .input('url_imagen', sql.VarChar, url_imagen)
            .query(`
                INSERT INTO Producto (nombre, precio, fecha_de_lanzamiento, id_categoria, url, url_imagen)
                OUTPUT INSERTED.id
                VALUES (@nombre, @precio, @fecha_de_lanzamiento, @id_categoria, @url, @url_imagen)
            `);

        const productId = productResult.recordset[0].id;

        // 3. Insertar la relación en TiendaXProducto
        await pool.request()
            .input('id_tienda', sql.Int, id_tienda)
            .input('id_producto', sql.Int, productId)
            .input('cantidad_disponible', sql.Int, cantidad_disponible)
            .input('precio_de_tienda', sql.Decimal(10, 2), precio_de_tienda)
            .query(`
                INSERT INTO TiendaXProducto (id_tienda, id_producto, cantidad_disponible, precio_de_tienda)
                VALUES (@id_tienda, @id_producto, @cantidad_disponible, @precio_de_tienda)
            `);

        res.status(201).json({
            message: "Producto agregado exitosamente",
            productId: productId,
            productName: nombre
        });

    } catch (error) {
        console.error("Error en addProduct:", error);
        
        if (error.number === 547) { // Foreign key violation
            res.status(400).json({ 
                message: "Error en las relaciones: categoría o tienda no válida" 
            });
        } else if (error.number === 2627) { // Unique constraint violation
            res.status(409).json({ 
                message: "El producto ya existe en el sistema" 
            });
        } else {
            res.status(500).json({ 
                message: "Error interno del servidor", 
                error: error.message 
            });
        }
    }
};