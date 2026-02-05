"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Terminal, Database } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Asegúrate de importar esto

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20">
      
      {/* --- FONDOS AMBIENTALES --- */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* --- COLUMNA IZQUIERDA: TEXTO --- */}
        <div className="text-center lg:text-left">
          
          {/* Badge animado */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-primary/30 rounded-full bg-primary/10 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-primary-300 text-xs font-bold tracking-widest uppercase">
              Disponible para proyectos
            </span>
          </motion.div>

          {/* TÍTULO NUEVO */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-tight"
          >
            Software Developer <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              & IT Solutions
            </span>
          </motion.h1>

          {/* DESCRIPCIÓN */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Especialista en lógica de Backend y arquitecturas orientadas a datos. 
            Transformo requerimientos complejos en sistemas eficientes utilizando 
            <strong> Python, .NET y Tecnologías Cloud</strong>.
          </motion.p>

          {/* BOTONES (Solo navegación interna, sin links externos molestos) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link 
              href="#projects"
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Explorar Portfolio
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              href="#contact"
              className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-all text-white font-medium text-center"
            >
              Contactar
            </Link>
          </motion.div>
        </div>

        {/* --- COLUMNA DERECHA: IMAGEN CON EFECTOS --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Círculos decorativos detrás */}
          <div className="absolute inset-0 bg-linear-to-tr from-primary to-secondary rounded-full opacity-20 blur-3xl animate-pulse" />
          
          {/* Elementos flotantes (Iconos de Backend) */}
          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-0 right-10 bg-black/80 border border-white/10 p-4 rounded-xl backdrop-blur-md z-20 shadow-xl hidden md:block"
          >
            <Terminal className="text-secondary w-8 h-8" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }} 
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 left-10 bg-black/80 border border-white/10 p-4 rounded-xl backdrop-blur-md z-20 shadow-xl hidden md:block"
          >
            <Database className="text-primary w-8 h-8" />
          </motion.div>

          {/* CONTENEDOR DE LA IMAGEN */}
          <div className="relative w-75 h-75 md:w-100 md:h-100 rounded-full border-4 border-white/5 overflow-hidden shadow-2xl z-10 bg-neutral-900">
             {/* AQUÍ VA TU FOTO REAL. 
                 Sube tu foto a /public/me.png y descomenta la línea de abajo.
                 Por ahora uso un div gris de placeholder.
             */}
             {/* <Image src="/me.png" alt="Diego Valdez" fill className="object-cover" /> */}
             
             {/* Placeholder temporal hasta que pongas tu foto */}
             <div className="w-full h-full flex items-center justify-center bg-linear-to-b from-gray-800 to-black">
                <Code2 className="w-32 h-32 text-white/20" />
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}