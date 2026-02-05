"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    client: "C&C Cowork & Coffee",
    role: "Gerencia",
    feedback: "Diego optimizó nuestra gestión de inventarios con un análisis de datos preciso. Su solución automatizada nos ahorra horas de trabajo manual cada semana.",
    highlight: "Optimización de Inventario"
  },
  {
    id: 2,
    client: "Bélica Marketing",
    role: "Tech Lead",
    feedback: "La implementación del proceso ETL fue impecable. Logró estructurar datos desordenados de múltiples fuentes en un dashboard claro y accionable.",
    highlight: "Automatización ETL"
  },
  {
    id: 3,
    client: "Universidad Católica",
    role: "Academic Project",
    feedback: "Excelente implementación de patrones de arquitectura en el proyecto InMemoriam. Código limpio, escalable y bien documentado.",
    highlight: "Arquitectura de Software"
  }
];

export default function Clients() {
  return (
    <section id="clients" className="py-24 px-4 bg-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Impacto <span className="text-primary">Real</span>
          </h2>
          <p className="text-muted">Lo que dicen sobre mi trabajo</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-8 rounded-2xl bg-black border border-white/10 relative hover:border-secondary/30 transition-colors"
            >
              {/* Icono de comillas grande de fondo */}
              <Quote className="absolute top-6 right-6 text-white/5 w-12 h-12" />

              <div className="text-secondary text-sm font-bold tracking-wider uppercase mb-4">
                {item.highlight}
              </div>
              
              <p className="text-muted mb-6 leading-relaxed">
                "{item.feedback}"
              </p>

              <div className="border-t border-white/10 pt-4">
                <div className="font-bold text-white">{item.client}</div>
                <div className="text-sm text-gray-500">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}