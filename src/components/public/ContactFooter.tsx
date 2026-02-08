"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Github, Linkedin, ArrowUpRight, Heart, Twitter, Facebook, Instagram } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { usePublicSocials } from "@/hooks/usePublicSocials";
import { usePortfolioContext } from "@/contexts/PortfolioContext";

// Mapeo de iconos según la plataforma
const getIconForPlatform = (platform: string) => {
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('github')) return Github;
  if (platformLower.includes('linkedin')) return Linkedin;
  if (platformLower.includes('twitter') || platformLower.includes('x')) return Twitter;
  if (platformLower.includes('facebook')) return Facebook;
  if (platformLower.includes('instagram')) return Instagram;
  
  return Mail;
};

export default function ContactFooter() {
  const { username } = usePortfolioContext();
  const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || '#';
  
  const { profile, loading: profileLoading } = useProfile(username);
  const { socials, loading: socialsLoading } = usePublicSocials(username);

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
              {profile ? (
                <>
                  {profile.name} <span className="text-primary">{profile.last_name}</span>
                </>
              ) : (
                'Loading...'
              )}
            </motion.h3>
            
            <p className="text-muted leading-relaxed">
              {profile?.bio_summary || 'Loading bio summary...'}
            </p>

            {/* Valores extraídos de tu CV */}
            <div className="flex flex-wrap gap-2">
              {["Pragmatism", "Curiosity", "Balanced Mind", "Family First"].map((val) => (
                <span key={val} className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-gray-400">
                  {val}
                </span>
              ))}
            </div>
          </div>

          {/* COLUMNA 2: Contacto Directo */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Contact Information</h4>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${profile?.email}`} className="flex items-center gap-3 text-muted hover:text-primary transition-colors group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Mail size={18} />
                  </div>
                  {profile?.email || 'Loading email...'}
                </a>
              </li>
              <li>
                <a href={`tel:${profile?.phone}`} className="flex items-center gap-3 text-muted hover:text-secondary transition-colors group">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-secondary/20 transition-colors">
                    <Phone size={18} />
                  </div>
                  {profile?.phone || 'Not available'}
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted">
                <div className="p-2 bg-white/5 rounded-lg">
                  <MapPin size={18} />
                </div>
                {profile?.location || 'Not specified'}
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Call to Action & Socials */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white">Let's Talk</h4>
            <p className="text-muted">
              Currently available for new projects and collaborations.
            </p>
            
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all w-full md:w-auto justify-center"
            >
              Start Conversation
              <ArrowUpRight size={18} />
            </a>

            <div className="flex gap-4 pt-4">
              {!socialsLoading && socials.length > 0 ? (
                socials.map((social) => {
                  const IconComponent = getIconForPlatform(social.platform);
                  return (
                    <a 
                      key={social.id}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 rounded-full hover:bg-white/20 hover:text-white transition-all text-muted"
                      title={social.platform}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })
              ) : (
                <span className="text-muted">Loading socials...</span>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM FOOTER */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {profile?.name || 'Diego'} {profile?.last_name || 'Valdez'}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> and Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}