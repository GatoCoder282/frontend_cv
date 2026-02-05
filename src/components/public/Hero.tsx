"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, FileText, Download, User } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/hooks/useProfile";
import Image from "next/image";

export default function Hero() {
  const { profile, loading } = useProfile();

  // Valores por defecto si no hay perfil
  const displayName = profile ? `${profile.name} ${profile.last_name}` : "Diego Valdez";
  const displayTitle = profile?.current_title || "Backend Developer & Data Engineer";
  const displayBio = profile?.bio_summary || "Transformo datos complejos en arquitecturas de software eficientes. Especializado en el ecosistema Python, .NET y Arquitecturas Cloud (AWS/Azure). Enfocado en escalabilidad y optimización de procesos ETL.";
  const displayPhoto = profile?.photo_url;

  return (
    <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden px-4">
      
      {/* --- FONDO INTERACTIVO (EL TOQUE "FACHERÍSIMO") --- */}
      
      {/* 1. Foco de luz principal (Índigo/Azul profundo) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-full blur-[120px] pointer-events-none" />
      
      {/* 2. Foco de luz secundario (Verde suave/Emerald) */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* 3. Malla sutil para textura (Opcional, le da toque técnico) */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

      <div className="z-10 text-center max-w-5xl">
        
        {/* FOTO DE PERFIL (si existe) */}
        {displayPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-[0_0_30px_rgba(79,70,229,0.3)]">
              <Image 
                src={displayPhoto} 
                alt={displayName}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        )}

        {/* ETIQUETA SUPERIOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6 px-4 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-md"
        >
          <span className="text-secondary text-xs font-bold tracking-widest uppercase">
            Disponible para nuevos proyectos
          </span>
        </motion.div>

        {/* TÍTULO PRINCIPAL */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white"
        >
          {loading ? (
            <span className="animate-pulse">Cargando...</span>
          ) : (
            <>
              {displayName} <br />
              <span className="text-gradient">
                {displayTitle}
              </span>
            </>
          )}
        </motion.h1>

        {/* DESCRIPCIÓN */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          {loading ? (
            <span className="animate-pulse">Cargando información...</span>
          ) : (
            displayBio
          )}
        </motion.p>

        {/* BOTONES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          {/* Botón Principal (Verde/Índigo sutil) */}
          <Link 
            href="#projects"
            className="group px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]"
          >
            Ver Proyectos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Botón CV */}
          <a 
            href="/cv.pdf" 
            target="_blank"
            className="px-8 py-4 border border-white/20 rounded-full hover:bg-white/5 transition-all flex items-center gap-2 text-white font-medium hover:border-secondary/50"
          >
            <Download className="w-5 h-5" />
            Descargar CV
          </a>
        </motion.div>

        {/* ICONOS SOCIALES (El toque de color interactivo) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex gap-8 justify-center items-center"
        >
          <a href="https://github.com/GatoCoder282" target="_blank" className="text-muted hover:text-white transition-colors transform hover:scale-110 duration-200">
            <Github className="w-8 h-8" />
          </a>
          <a href="https://linkedin.com/in/diego-valdez-8750b4330" target="_blank" className="text-muted hover:text-[#0077b5] transition-colors transform hover:scale-110 duration-200">
            <Linkedin className="w-8 h-8" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}