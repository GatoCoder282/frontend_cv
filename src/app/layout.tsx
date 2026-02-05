// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Importante: Aquí se cargan los estilos de Tailwind
import { AuthProvider } from "@/contexts/AuthContext";
import { MuiThemeProvider } from "@/theme/theme";

export const metadata: Metadata = {
  title: "Diego Valdez - Portfolio",
  description: "Backend Developer & SaaS Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* El body debe estar limpio, las clases de color irán en los layouts hijos */}
      <body>
        <MuiThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}