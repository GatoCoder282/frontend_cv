"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Github, Linkedin, ArrowUpRight, Heart } from "lucide-react";

export default function ContactFooter() {
  return (
    <footer id="contact" className="relative bg-black pt-24 pb-12 overflow-hidden border-t border-white/10">
      
      {/* Fondo ambiental sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          
          {/* COLUMNA 1: About Me (Bio Resumida) */}
          <div className="space-y-6">
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white"
            >
              Diego <span className="text-primary">Valdez</span>
            </motion.h3>
            
            <p className="text-muted leading-relaxed">
              Ingeniero de Sistemas en formación con pasión por el backend robusto y la ciencia de datos. 
              Me impulsa el pragmatismo, la curiosidad constante y la búsqueda de soluciones escalables.
            </p>

            {/* Valores extraídos de tu CV [cite: 87-94] */}
            <div className="flex flex-wrap gap-2">
              {["Pragmatismo", "Curiosidad", "Mente Equilibrada", "Familia Primero"].map((val) => (
                <span key={val} className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-gray-400">
                  {val}
                </span>
              ))}
            </div>
          </div>

          {/* COLUMNA 2: Contacto Directo */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Información de Contacto</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:diegomvaldez19@gmail.com" className="flex items-center gap-3 text-muted hover:text-primary transition-colors group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Mail size={18} />
                  </div>
                  diegomvaldez19@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+59167405100" className="flex items-center gap-3 text-muted hover:text-secondary transition-colors group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-secondary/20 transition-colors">
                    <Phone size={18} />
                  </div>
                  +591 674 05 100
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted">
                <div className="p-2 bg-white/5 rounded-lg">
                  <MapPin size={18} />
                </div>
                Cochabamba, Bolivia
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Call to Action & Socials */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">¿Hablamos?</h4>
            <p className="text-muted">
              Actualmente disponible para nuevos proyectos y colaboraciones.
            </p>
            
            <a 
              href="mailto:diegomvaldez19@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all w-full md:w-auto justify-center"
            >
              Iniciar Conversación
              <ArrowUpRight size={18} />
            </a>

            <div className="flex gap-4 pt-4">
              <a href="https://github.com/GatoCoder282" target="_blank" className="p-3 bg-white/5 rounded-full hover:bg-white/20 hover:text-white transition-all text-muted">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/in/diego-valdez-8750b4330" target="_blank" className="p-3 bg-white/5 rounded-full hover:bg-[#0A66C2] hover:text-white transition-all text-muted">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM FOOTER */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Diego Valdez. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart size={14} className="text-red-500 fill-red-500" /> y Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}