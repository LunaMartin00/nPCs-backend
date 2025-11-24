
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
    // --- PLACAS MADRE ---
    {
        id: 301,
        nombre: "ASUS PRIME B550M-A",
        categoria: "placas-madre",
        precio: 145.00,
        tienda: "KPC Hardware",
        imagen: "https://kpchardware.com/11052-large_default/asus-prime-b550m-a.jpg",
        link: "https://kpchardware.com/99-placa-base"
    },
    {
        id: 302,
        nombre: "MOTHERBOARD ASROCK B850M PRO RS WIFI AM5 MICRO ATX DDR5",
        categoria: "placas-madre",
        precio: 249.00,
        tienda: "intelmax",
        imagen: "https://tiendaintelmax.net/images/productos/MB0139.jpg",
        link: "https://tiendaintelmax.nethttps://tiendaintelmax.net/product/MB0139/family/197?srsltid=AfmBOoqJcQA6yg9JSfKvXzcurD5feYazndMZJjbF-o5ELmqK0nglr3uB"
    },
    {
        id: 303,
        nombre: "ASUS ROG Strix B850-A",
        categoria: "placas-madre",
        precio: 199.99,
        tienda: "Amazon",
        imagen: "https://m.media-amazon.com/images/I/81ZJGsaELhL._AC_SL1500_.jpg",
        link: "https://www.kayfa-store.com/product/placa-gigabyte-b550-aorus"
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
    ,
    // --- MEMORIAS RAM ---
    {
        id: 501,
        nombre: "MEMORIA RAM ADATA 32GB DDR5 4800 MHz DIMM/ AD5U480032G-S",
        categoria: "memorias-ram",
        precio: 109.90,
        tienda: "intelmax",
        imagen: "https://tiendaintelmax.net/images/productos/RAM0573.jpg",
        link: "https://tiendaintelmax.net/product/RAM0573"
    },
    {
        id: 502,
        nombre: "Memoria RAM Kingston KVR SODIMM 32GB DDR5 5600MT/s Non-ECC Unbuffered SODIMM",
        categoria: "memorias-ram",
        precio: 300.00,
        tienda: "XHT",
        imagen: "https://xht.com.sv/wp-content/uploads/2025/10/KVR56S46BD8-32_0.jpg",
        link: "https://xht.com.sv/product/memoria-ram-kingston-kvr-sodimm-32gb-ddr5-5600mt-s-non-ecc-unbuffered-sodimm/"
    },
    {
        id: 503,
        nombre: "Memoria RAM HP 879507-B21",
        categoria: "memorias-ram",
        precio: 305.00,
        tienda: "Digital Solutions",
        imagen: "https://www.digitalsolutions.com.sv/cdn/shop/products/Memoria-RAM-HP-879507-B21_1000x.jpg?v=1745867820",
        link: "https://www.digitalsolutions.com.sv/products/memoria-ram-hp-879507-091"
    }
    ,
    // --- ALMACENAMIENTO ---
    {
        id: 601,
        nombre: "Disco duro RadioShack 4401121 2 TB",
        categoria: "almacenamiento",
        precio: 89.99,
        tienda: "radioShack",
        imagen: "https://www.radioshackla.com/media/catalog/product/4/4/4401121_03_ppqtaovmnekser6m.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:",
        link: "https://www.radioshackla.com/elsalvador/disco-duro-radioshack-4401121-2-tb-427427900001/p"
    },
    {
        id: 602,
        nombre: "Disco de estado sólido SSD 480 GB A400 Kingston",
        categoria: "almacenamiento",
        precio: 78.38,
        tienda: "Tech Zone",
        imagen: "https://techzone.com.sv/wp-content/uploads/2023/09/Diapositiva1-371.jpg",
        link: "https://techzone.com.sv/store/kingston-a400/"
    },
    {
        id: 603,
        nombre: "DISCO DURO WD PURPLE 8TB 3.5 SATA WD84PURZ",
        categoria: "almacenamiento",
        precio: 249.00,
        tienda: "intelmax",
        imagen: "https://tiendaintelmax.net/images/productos/ALM0008.jpg",
        link: "https://tiendaintelmax.net/product/ALM0008"
    },
    // --- GABINETES ---
    {
        id: 701,
        nombre: "PCCOOLER i100 PRO MESH / TT TOUGHPOWER SFX 600W 80+ GOLD / PCIE 4.0 RISER - BUNDLE",
        categoria: "gabinetes",
        precio: 179.00,
        tienda: "HPC Hardware",
        imagen: "https://kpchardware.com/17410-large_default/pccooler-i100-pro-mesh-tt-toughpower-sfx-600watts-pcie-40-riser-cable-bundle-.jpg",
        link: "https://kpchardware.com/103-case"
    },
    {
        id: 702,
        nombre: "Gabinete Para Pc Marvo Gaming Blanco Vidrio Templado Rgb Ca-119",
        categoria: "gabinetes",
        precio: 42.30,
        tienda: "ACOSA",
        imagen: "https://acosa.com.sv/wp-content/uploads/2025/06/CA-119-AWH.webp",
        link: "https://acosa.com.sv/producto/gabinete-para-pc-marvo-gaming-blanco-vidrio-templado-rgb-ca-119/"
    },
    {
        id: 703,
        nombre: "Eagle Warrior H430 CG03AA",
        categoria: "gabinetes",
        precio: 32.00,
        tienda: "Random Computer",
        imagen: "https://randomcomputadoras.com/wp-content/uploads/2024/08/case-eagle-warrior-cg03aa-1.png",
        link: "https://randomcomputadoras.com/index.php/producto/eagle-warrior-h430-cg03aa/"
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