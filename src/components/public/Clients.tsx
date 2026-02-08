"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { usePublicClients } from "@/hooks/usePublicClients";
import { usePortfolioContext } from "@/contexts/PortfolioContext";

export default function Clients() {
  const { username } = usePortfolioContext();
  const { clients, loading } = usePublicClients(username);
  return (
    <section id="clients" className="py-24 px-4 bg-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Real <span className="text-primary">Impact</span>
          </h2>
          <p className="text-muted">What my clients say about my work</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {!loading && clients.length > 0 ? (
            clients.map((item, index) => (
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
                {item.company || 'Client'}
              </div>
              
              <p className="text-muted mb-6 leading-relaxed">
                "{item.feedback || 'No feedback provided'}"
              </p>

              <div className="border-t border-white/10 pt-4">
                <div className="font-bold text-white">{item.name}</div>
                <div className="text-sm text-gray-500">Client</div>
              </div>
            </motion.div>
))
          ) : (
            <div className="col-span-full text-center text-muted">
              {loading ? 'Loading clients...' : 'No clients available'}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}