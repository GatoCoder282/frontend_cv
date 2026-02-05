import Hero from "@/components/public/Hero";
import Experience from "@/components/public/Experience";
import ProjectsBento from "@/components/public/ProjectsBento";
import TechStack from "@/components/public/TechStack";
import Clients from "@/components/public/Clients";
import ContactFooter from "@/components/public/ContactFooter"; 

export default function Home() {
  return (
    <main className="flex flex-col gap-0">
      <Hero />
      <Experience />
      <ProjectsBento />
      <TechStack />
      <Clients />
      <ContactFooter /> 
    </main>
  );
}