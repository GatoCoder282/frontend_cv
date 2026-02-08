"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Briefcase } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export default function About() {
  const { profile, loading } = useProfile("droyy282");

  if (loading) {
    return (
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted animate-pulse">Cargando información...</p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <section id="about" className="py-20 px-4 relative">
      {/* Fondo sutil */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Sobre <span className="text-gradient">Mí</span>
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all">
              <h3 className="text-2xl font-bold mb-6 text-white">Información de Contacto</h3>
              
              <div className="space-y-4">
                {profile.current_title && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-muted text-sm">Posición</p>
                      <p className="text-white font-medium">{profile.current_title}</p>
                    </div>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-muted text-sm">Ubicación</p>
                      <p className="text-white font-medium">{profile.location}</p>
                    </div>
                  </div>
                )}

                {profile.phone && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-muted text-sm">Teléfono</p>
                      <p className="text-white font-medium">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Biografía extendida */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all"
          >
            <h3 className="text-2xl font-bold mb-4 text-white">Biografía</h3>
            <p className="text-muted leading-relaxed whitespace-pre-line">
              {profile.bio_summary}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
