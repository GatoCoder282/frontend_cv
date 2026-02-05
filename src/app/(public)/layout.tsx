import Navbar from "@/components/public/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Quitamos bg-black aquí porque ya lo definimos globalmente en globals.css
    // Agregamos 'relative' para el posicionamiento
    <div className="relative min-h-screen selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        {children}
      </main>
      
      {/* Footer temporal simple */}
      <footer className="py-10 text-center text-muted text-sm border-t border-white/10 mt-20">
        <p>© {new Date().getFullYear()} Diego Valdez. Logic & Data.</p>
      </footer>
    </div>
  );
}