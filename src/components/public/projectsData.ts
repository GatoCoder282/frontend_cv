// archivo temporal hardcodeado para mostrar proyectos en el portafolio. En un futuro, se elimina y se usa nuestr config de conexion a la api
export const PROJECTS = [
  {
    id: 1,
    title: "InMemoriam Platform",
    category: "Full Stack .NET",
    description: "Plataforma digital para interactuar con memorias de seres queridos. Implementación real con arquitectura en capas.",
    tech: [".NET Core", "Entity Framework", "MySQL", "JWT", "Swagger"], // [cite: 44]
    links: { repo: "https://github.com/GatoCoder282/InMemoriamWeb", live: "#" }, // [cite: 43]
    featured: true, // Ocupará más espacio en el Bento
  },
  {
    id: 2,
    title: "SCRAPPY ETL",
    category: "Data Engineering",
    description: "Software diseñado para automatizar procesos ETL usando Web Scraping y procesamiento de datos masivos.",
    tech: ["Python", "Pandas", "Selenium", "Streamlit", "Render"], // [cite: 77]
    links: { repo: "#", live: "https://scrappy-0mt4.onrender.com/" }, // [cite: 76]
    featured: false,
  },
  {
    id: 3,
    title: "GasolinaYa",
    category: "Web System",
    description: "Sistema de información para reservas de recarga de gasolina y gestión de colas.",
    tech: ["Javascript", "Cypress", "Netlify", "Jest"], // [cite: 49]
    links: { repo: "https://github.com/guizadasaul/proyecto_gasolina_ing_software", live: "https://gasolinayaa.netlify.app/" }, // [cite: 47, 48]
    featured: false,
  },
  {
    id: 4,
    title: "Pharmacy ERP",
    category: "Enterprise Software",
    description: "Sistema ERP aplicando patrones arquitectónicos, manejo de inventario y ventas.",
    tech: [".NET", "Razor Pages", "FluentResult", "ADO.NET"], // [cite: 40]
    links: { repo: "https://github.com/GatoCoder282/Farmacia_Arqui_Soft", live: "#" }, // [cite: 39]
    featured: true,
  },
  {
    id: 5,
    title: "Hospital Management",
    category: "Backend System",
    description: "Sistema de información para reservas y contacto de servicios de emergencia.",
    tech: ["Node.js", "Express", "SQL Server", "HTML/CSS"], // [cite: 32]
    links: { repo: "https://github.com/UCB-SIS222/hospital-2", live: "#" }, // [cite: 31]
    featured: false,
  },
];