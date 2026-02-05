import Hero from "@/components/public/Hero";
import About from "@/components/public/About";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      {/* Aquí pondremos más secciones después: Skills, Projects, etc. */}
    </main>
  );
}