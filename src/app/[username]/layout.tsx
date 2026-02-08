export default function UserPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen selection:bg-primary selection:text-white">
      <main>
        {children}
      </main>
      
      {/* Footer temporal simple */}
      <footer className="py-10 text-center text-muted text-sm border-t border-white/10 mt-20">
        <p>© {new Date().getFullYear()} Portfolio. Logic & Data.</p>
      </footer>
    </div>
  );
}
