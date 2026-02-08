"use client";

import { motion } from "framer-motion";
import { usePublicTechnologies } from "@/hooks/usePublicTechnologies";
import { usePortfolioContext } from "@/contexts/PortfolioContext";

const CATEGORY_META = [
  { id: "backend", title: "Backend Core" },
  { id: "frontend", title: "Frontend & UI" },
  { id: "databases", title: "Data Persistence" },
  { id: "apis", title: "APIs" },
  { id: "dev_tools", title: "DevOps & Data" },
  { id: "cloud", title: "Cloud" },
  { id: "testing", title: "Testing" },
  { id: "architecture", title: "Architecture" },
  { id: "security", title: "Security" },
];

export default function TechStack() {
  const { username } = usePortfolioContext();
  const { technologies, loading } = usePublicTechnologies(username);

  const grouped = technologies.reduce<Record<string, typeof technologies>>((acc, tech) => {
    const key = tech.category || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(tech);
    return acc;
  }, {});

  const categories = [
    ...CATEGORY_META.filter((category) => grouped[category.id]?.length),
    ...Object.keys(grouped)
      .filter((key) => !CATEGORY_META.some((category) => category.id === key))
      .map((key) => ({ id: key, title: key.replace(/_/g, " ") }))
  ];

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
        </motion.div>

        {/* Grid de Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!loading && categories.length > 0 ? (
            categories.map((category, catIndex) => {
              const items = grouped[category.id] || [];
              const headerIcon = items.find((tech) => tech.icon_url)?.icon_url;

              return (
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
                      {headerIcon ? (
                        <img
                          src={headerIcon}
                          alt={category.title}
                          className="w-6 h-6 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs font-bold">
                          {category.title.charAt(0)}
                        </span>
                      )}
                    </span>
                    <h3 className="text-xl font-bold text-foreground">
                      {category.title}
                    </h3>
                  </div>

                  {/* Grid de Tecnologías */}
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                    {items.map((tech) => (
                      <div key={tech.id} className="relative group/icon flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-center text-3xl text-gray-400 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:border-white/20 shadow-lg">
                          {tech.icon_url ? (
                            <img
                              src={tech.icon_url}
                              alt={tech.name}
                              className="w-8 h-8 object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-gray-400">
                              {tech.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        <span className="absolute -bottom-8 opacity-0 group-hover/icon:opacity-100 transition-opacity text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20 whitespace-nowrap">
                          {tech.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-muted">
              {loading ? "Loading technologies..." : "No technologies available"}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}