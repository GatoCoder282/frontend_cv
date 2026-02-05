"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";

// Datos extraídos de tu CV [cite: 71, 80]
const JOBS = [
  {
    id: 1,
    role: "Systems and Data Analyst",
    company: "C&C, Cowork & Coffee shop",
    period: "July 2025 - Present",
    location: "Cochabamba, Bolivia",
    description: "Análisis de datos y sistemas para optimizar la operación de la cafetería, apoyando decisiones sobre inventario, ventas y experiencia del cliente. Desarrollo de software 'SCRAPPY' para automatización ETL.",
    tech: ["Python", "Streamlit", "Pandas", "Selenium"],
  },
  {
    id: 2,
    role: "Software Full-STACK Developer",
    company: "Bélica Marketing",
    period: "December 2025",
    location: "Remote / Hybrid",
    description: "Desarrollo de software diseñado para automatizar procesos ETL utilizando web scraping y procesamiento de datos. Implementación de soluciones en la nube.",
    tech: ["Node.js", "SQLite", "Strapi", "Stripe"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Título de Sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Experiencia <span className="text-primary">Profesional</span>
          </h2>
          <div className="h-1 w-24 bg-linear-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-white/10 ml-4 md:ml-12 space-y-12">
          
          {JOBS.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Punto brillante en la línea de tiempo */}
              <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-background border-2 border-secondary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />

              <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                
                {/* Fechas (Columna Izquierda en Desktop) */}
                <div className="min-w-37.5 pt-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-muted font-mono">
                    <Calendar className="w-4 h-4 text-secondary" />
                    {job.period}
                  </span>
                </div>

                {/* Tarjeta de Contenido */}
                <div className="flex-1 bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-primary/30 transition-colors">
                  <h3 className="text-xl font-bold text-foreground">{job.role}</h3>
                  <div className="flex items-center gap-2 text-primary mb-4 font-medium">
                    <Briefcase className="w-4 h-4" />
                    {job.company}
                  </div>
                  
                  <p className="text-muted leading-relaxed mb-6 text-sm md:text-base">
                    {job.description}
                  </p>

                  {/* Badges de tecnologías */}
                  <div className="flex flex-wrap gap-2">
                    {job.tech.map((t) => (
                      <span 
                        key={t} 
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary-300 border border-primary/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}