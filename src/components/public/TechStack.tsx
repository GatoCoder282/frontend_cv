"use client";

import { motion } from "framer-motion";
import { 
  SiPython, SiFastapi, SiDotnet, SiNodedotjs,// Backend
  SiReact, SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, // Frontend
  SiPostgresql, SiMysql, SiMongodb, SiSqlite, // Database
  SiAmazon, SiDocker, SiGit, SiPostman, SiLinux, SiPandas // Tools
} from "react-icons/si";

// ESTRUCTURA DE DATOS (Backend Ready)
// En el futuro, esto vendrá de tu API: /technologies/grouped
const TECH_CATEGORIES = [
  {
    id: "backend",
    title: "Backend Core",
    icon: <SiPython className="w-6 h-6" />, // Icono representativo de la categoría
    skills: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: ".NET Core", icon: SiDotnet, color: "#512BD4" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    ]
  },
  {
    id: "frontend",
    title: "Frontend & UI",
    icon: <SiReact className="w-6 h-6" />,
    skills: [
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" }, // Next.js es negro/blanco
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    ]
  },
  {
    id: "database",
    title: "Data Persistence",
    icon: <SiPostgresql className="w-6 h-6" />,
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "SQLite", icon: SiSqlite, color: "#003B57" },
    ]
  },
  {
    id: "tools",
    title: "DevOps & Data",
    icon: <SiDocker className="w-6 h-6" />,
    skills: [
      { name: "AWS", icon: SiAmazon, color: "#FF9900" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Pandas", icon: SiPandas, color: "#150458" }, // Data Science
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
    ]
  }
];

export default function TechStack() {
  return (
    <section id="stack" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Tech <span className="text-primary">Ecosystem</span>
          </h2>
          <p className="text-muted text-lg">
            Arquitectura tecnológica dividida por capas de especialización
          </p>
        </motion.div>

        {/* Grid de Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TECH_CATEGORIES.map((category, catIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
              // Estilo visual: "Caja de Cristal" distinta a las tarjetas de Clientes
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-primary/30 transition-all group"
            >
              {/* Título de Categoría con Icono */}
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                <span className="text-secondary p-2 bg-secondary/10 rounded-lg">
                  {category.icon}
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  {category.title}
                </h3>
              </div>

              {/* Grid de Iconos (Tecnologías) */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                {category.skills.map((tech, techIndex) => (
                  <div key={tech.name} className="relative group/icon flex flex-col items-center">
                    
                    {/* Contenedor del Icono (Círculo) */}
                    <div 
                      className="w-16 h-16 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center text-3xl text-gray-400 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:border-white/20 shadow-lg"
                      style={{ 
                        // Truco CSS: Usamos una variable para el color hover dinámico
                        // @ts-ignore
                        "--hover-color": tech.color 
                      }}
                    >
                      {/* El icono en sí */}
                      <tech.icon 
                        className="transition-colors duration-300 group-hover/icon:text-(--hover-color)" 
                      />
                    </div>

                    {/* Tooltip (Nombre) - Aparece abajo al hover */}
                    <span className="absolute -bottom-8 opacity-0 group-hover/icon:opacity-100 transition-opacity text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 whitespace-nowrap">
                      {tech.name}
                    </span>
                    
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}