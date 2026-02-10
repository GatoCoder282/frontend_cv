"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Folder, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePublicFeaturedProjects } from "@/hooks/usePublicProjects";
import { usePortfolioContext } from "@/contexts/PortfolioContext";

export default function ProjectsBento() {
  const { username } = usePortfolioContext();
  const { projects, loading } = usePublicFeaturedProjects(username);

  // Función para obtener columnas al azar (1 o 2)
  const getRandomSpan = (seed: number) => {
    const random = Math.sin(seed * 12.9898) * 43758.5453;
    const normalized = random - Math.floor(random);
    return normalized > 0.5 ? 2 : 1;
  };
  return (
    <section id="projects" className="py-24 px-4 bg-black/50">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {!loading && projects.length > 0 ? (
            projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              // Si es featured, ocupa 2 columnas. Si no, 1.
              className={`group relative p-6 rounded-3xl border border-white/10 bg-white/5 hover:border-primary/50 transition-all overflow-hidden flex flex-col justify-between ${
                getRandomSpan(project.id) === 2 ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              {/* Imagen de fondo si existe */}
              {project.thumbnail_url && (
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity">
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Contenido Superior */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/10 rounded-full text-secondary">
                      <Folder size={20} />
                    </div>
                    <span className="text-sm font-semibold text-secondary capitalize">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {project.repo_url && project.repo_url !== "#" && (
                      <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-black/50 hover:bg-primary hover:text-white transition-colors">
                        <Github size={18} />
                      </a>
                    )}
                    {project.live_url && project.live_url !== "#" && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-black/50 hover:bg-secondary hover:text-white transition-colors">
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

              {/* Tags (Bottom) - Tecnologías del proyecto */}
              <div className="relative z-10 mt-4 space-y-3">
                {project.technologies && project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech.id} className="text-xs font-mono text-secondary px-2 py-1 bg-secondary/10 rounded border border-secondary/20">
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-xs font-mono text-muted px-2 py-1">+{project.technologies.length - 4} more</span>
                    )}
                  </div>
                ) : null}                
                {/* Botón Ver Detalles */}
                <Link 
                  href={`/${username}/projects/${project.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/60 text-white font-medium rounded-full hover:bg-secondary/80 transition-all duration-300 hover:gap-3 group/link shadow-lg hover:shadow-xl"
                >
                  View Details
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link></div>
            </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted py-12">
              {loading ? "Loading projects..." : "No featured projects available"}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}