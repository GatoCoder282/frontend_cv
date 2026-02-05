"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Folder } from "lucide-react";
import { PROJECTS } from "./projectsData";

export default function ProjectsBento() {
  return (
    <section id="projects" className="py-24 px-4 bg-black/50">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Proyectos <span className="text-primary">Destacados</span>
          </h2>
          <p className="text-muted">Opción A: Estilo Bento Grid</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              // Si es featured, ocupa 2 columnas. Si no, 1.
              className={`group relative p-6 rounded-3xl border border-white/10 bg-white/5 hover:border-primary/50 transition-all overflow-hidden flex flex-col justify-between ${
                project.featured ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              {/* Fondo con gradiente sutil al hacer hover */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Contenido Superior */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white/10 rounded-full text-primary-300">
                    <Folder size={20} />
                  </div>
                  <div className="flex gap-2">
                    {project.links.repo !== "#" && (
                      <a href={project.links.repo} target="_blank" className="p-2 rounded-full bg-black/50 hover:bg-primary hover:text-white transition-colors">
                        <Github size={18} />
                      </a>
                    )}
                    {project.links.live !== "#" && (
                      <a href={project.links.live} target="_blank" className="p-2 rounded-full bg-black/50 hover:bg-secondary hover:text-white transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted text-sm line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Tags (Bottom) */}
              <div className="relative z-10 mt-4">
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs font-mono text-secondary px-2 py-1 bg-secondary/10 rounded border border-secondary/20">
                      {t}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="text-xs font-mono text-muted px-2 py-1">+More</span>
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