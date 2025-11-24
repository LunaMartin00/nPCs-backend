
const productsData = [
    // --- PROCESADORES ---
    {
        id: 101,
        nombre: "AMD Ryzen 5 5600X",
        categoria: "procesadores",
        precio: 205.00,
        tienda: "KPC Hardware",
        imagen: "https://kpchardware.com/10752-large_default/ryzen-5-5600x-46-ghz-6-nucleos-12-hilos.jpg?1764001215830",
        link: "https://kpchardware.com/100-cpu" 
    },
    {
        id: 102,
        nombre: "Procesador intel core i5 14400f",
        categoria: "procesadores",
        precio: 219.95,
        tienda: "Zona Digital",
        imagen: "https://api.zonadigitalsv.com/storage/products/imagen_generada65b0040c841b3.jpg",
        link: "https://www.zonadigitalsv.com/product/procesador-intel-core-i5-14400f-lga1700-6p4e16t-hasta-47ghz-20mb-requiere-gpu"
    },
    {
        id: 103,
        nombre: "AMD Ryzen 5 5500",
        categoria: "procesadores",
        precio: 110.00,
        tienda: "Kayfa Store",
        imagen: "https://kayfa-store.com/images/productos/procesador-amd-ryzen-5-55000223.jpg",
        link: "https://kayfa-store.com/product/procesador-amd-ryzen-5-55000223"
    },
    // --- TARJETAS GRÁFICAS ---
    {
        id: 201,
        nombre: "ASROCK Challenger D Radeon RX 6600 8GB",
        categoria: "tarjetas-graficas",
        precio: 315.00,
        tienda: "KPC Hardware",
        imagen: "https://kpchardware.com/14260-large_default/asrock-challenger-d-rx-6600-8gb-gddr6.jpg?1764001700414",
        link: "https://kpchardware.com/tarjeta-grafica/2957-asrock-challenger-d-rx-6600-8gb-gddr6.html"
    },
    {
        id: 202,
        nombre: "Sapphire PULSE AMD Radeon™ RX 7600 8GB",
        categoria: "tarjetas-graficas",
        precio: 379.00,
        tienda: "AEON",
        imagen: "https://aeon.com.sv/web/image/product.product/96241/image_1024/%5B17508%5D%20Tarjeta%20de%20Video%20Sapphire%20PULSE%20AMD%20Radeon%E2%84%A2%20RX%207600%208GB%20?unique=ad6fc45",
        link: "https://aeon.com.sv/shop/17508-tarjeta-de-video-sapphire-pulse-amd-radeontm-rx-7600-8gb-104675?category=405"
    },
    {
        id: 203,
        nombre: "Gigabyte RTX 5060 TI WindForce - OC - 8GB DDR7",
        categoria: "tarjetas-graficas",
        precio: 575.00,
        tienda: "Kayfa Store",
        imagen: "https://www.kayfa-store.com/images/productos/tarjeta-de-video-gigabyte-rtx-5060-ti-windforce--oc--8gb-ddr7-02247.png",
        link: "https://www.kayfa-store.com/product/tarjeta-de-video-gigabyte-rtx-5060-ti-windforce--oc--8gb-ddr7-02247"
    },
    // --- FUENTES DE PODER ---
    {
        id: 401,
        nombre: "RAIDMAX COBRA GOLD / 800W / 80+ GOLD",
        categoria: "fuentes-poder",
        precio: 125.00,
        tienda: "KPC Hardware",
        imagen: "https://kpchardware.com/12911-large_default/raidmax-cobra-gold-800w-80-gold.jpg?1764001999390",
        link: "https://kpchardware.com/fuente-de-poder/2461-raidmax-cobra-gold-800w-80-gold.html"
    },
    {
        id: 402,
        nombre: "Thermaltake Smart BM2 550W 80+ Bronze",
        categoria: "fuentes-poder",
        precio: 34.00,
        tienda: "AEON",
        imagen: "https://aeon.com.sv/web/image/product.product/89846/image_1024/%5B13204%5D%20FUENTE%20DE%20PODER%20Thermaltake%20Smart%20RGB%20600W%2080%20PLUS%20White%20PS-SPR-0600NHFAWU-1?unique=3eac35c", 
        link: "https://aeon.com.sv/shop/13204-fuente-de-poder-thermaltake-smart-rgb-600w-80-plus-white-ps-spr-0600nhfawu-1-98298?category=464"
    },
    {
        id: 403,
        nombre: "Seasonic FOCUS GX-750 750W 80+ Gold",
        categoria: "fuentes-poder",
        precio: 170.00,
        tienda: "Kayfa Store",
        imagen: "https://www.kayfa-store.com/images/productos/fuente-de-poder-seasonic-focus-gx750-gold882016002762.png",
        link: "https://www.kayfa-store.com/product/fuente-de-poder-seasonic-focus-gx750-gold882016002762"
    }
];

export const getProductsByCategory = (req, res) => {
    const { category } = req.params;

    try {
        
        if (!category || category === "todos") {
            return res.status(200).json(productsData);
        }

        const filteredProducts = productsData.filter(
            product => product.categoria.toLowerCase() === category.toLowerCase()
        );

        res.status(200).json(filteredProducts);

    } catch (error) {
        console.error("Error en getProductsByCategory:", error);
        res.status(500).json({ message: "Error interno simulado" });
    }
};