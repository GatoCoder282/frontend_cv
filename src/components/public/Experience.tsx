"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { usePortfolioContext } from "@/contexts/PortfolioContext";
import { usePublicWorkExperience } from "@/hooks/usePublicWorkExperience";

export default function Experience() {
  const { username } = usePortfolioContext();
  const { experiences, loading, error } = usePublicWorkExperience(username);

  // Ordenar experiencias: primero las que no han finalizado (Present), luego por fecha más reciente
  const sortedExperiences = [...experiences].sort((a, b) => {
    // Si a no tiene end_date (Present), va primero
    if (!a.end_date && b.end_date) return -1;
    if (a.end_date && !b.end_date) return 1;
    // Si ambas tienen end_date o ambas no tienen, ordenar por fecha más reciente
    if (a.end_date && b.end_date) {
      return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
    }
    // Si ambas no tienen fecha (Present), mantener orden original
    return 0;
  });

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
          
          {loading && (
            <div className="text-center text-muted py-12">
              Cargando experiencia...
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-12">
              Error al cargar la experiencia
            </div>
          )}

          {!loading && !error && experiences.length === 0 && (
            <div className="text-center text-muted py-12">
              No hay experiencia laboral disponible
            </div>
          )}

          {sortedExperiences.map((job, index) => (
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
                    {new Date(job.start_date).toLocaleDateString('es-ES', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                    {job.end_date ? ` - ${new Date(job.end_date).toLocaleDateString('es-ES', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}` : ' - Present'}
                  </span>
                </div>

                {/* Tarjeta de Contenido */}
                <div className="flex-1 bg-white/5 border border-white/5 p-6 rounded-2xl hover:border-primary/30 transition-colors">
                  <h3 className="text-xl font-bold text-foreground">{job.job_title}</h3>
                  <div className="flex items-center gap-2 text-primary mb-4 font-medium">
                    <Briefcase className="w-4 h-4" />
                    {job.company}
                  </div>

                  {job.location && (
                    <div className="flex items-center gap-2 text-muted text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                  )}
                  
                  {job.description && (
                    <p className="text-muted leading-relaxed text-sm md:text-base">
                      {job.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}