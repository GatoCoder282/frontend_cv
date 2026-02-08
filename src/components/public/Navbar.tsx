"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, MessageSquare } from "lucide-react";
import { usePortfolioContext } from "@/contexts/PortfolioContext";
import { useProfile } from "@/hooks/useProfile";

// Definimos los links de navegación (Asegúrate de que los IDs existan en tus secciones)
const NAV_LINKS = [
  { name: "Home", href: "#" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Stack", href: "#stack" },
  { name: "Testimonials", href: "#clients" },
];

export default function Navbar() {
  const { username } = usePortfolioContext();
  const { profile } = useProfile(username);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detectar scroll para cambiar el fondo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold tracking-tighter hover:scale-105 transition-transform">
          {profile?.name || "DIEGO"}
          <span className="text-primary">{profile?.last_name || "VALDEZ"}</span>
        </Link>

        {/* MENÚ DE ESCRITORIO */}
        <nav className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted hover:text-primary transition-colors relative group"
            >
              {link.name}
              {/* Línea animada al hacer hover */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CONTACT BUTTON (Desktop) */}
        <div className="hidden md:block">
          <Link
            href="#contact"
            className="px-5 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-full hover:bg-primary hover:border-primary transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <MessageSquare size={16} />
            Contact
          </Link>
        </div>

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="md:hidden text-foreground p-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MENÚ MÓVIL (Overlay) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden backdrop-blur-xl absolute w-full"
          >
            <nav className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px bg-white/10 my-2" />

              {/* Contact button on mobile */}
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-lg font-bold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all"
              >
                <MessageSquare size={20} />
                Let’s talk
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}