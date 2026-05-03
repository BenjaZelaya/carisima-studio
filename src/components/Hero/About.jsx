import ValueCard from "./About/ValueCard";
import ProfessionalCard from "./About/ProfessionalCard";
import aboutImg from "../../assets/about.jpg";
import pro1Img from "../../assets/pro1.jpg";
import pro2Img from "../../assets/pro2.jpg";
import pro3Img from "../../assets/pro3.jpg";
import img1 from "../../assets/esteticaimg1.jpg";
import img2 from "../../assets/esteticaimg2.jpg";

export default function About() {
  return (
    <main className="bg-[#0a0a0a] text-white">

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-white/10" />
      </div>

      {/* HERO ABOUT */}
      <section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-widest2 uppercase text-white/30 mb-6 font-sans">The Sanctuary</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
            Expertise Rooted in<br />
            <span className="italic">Precision.</span>
          </h2>
          <p className="mt-8 text-white/50 leading-relaxed text-sm max-w-sm">
            Carissima es más que un estudio; es un santuario clínico donde la
            ciencia se encuentra con la estética de alta gama. Creemos en la
            aplicación meticulosa de protocolos avanzados, adaptados
            específicamente a la arquitectura única de tu piel.
          </p>
          <div className="flex gap-12 mt-12">
            <div>
              <p className="text-3xl font-serif font-light">01</p>
              <p className="text-xs tracking-widest uppercase text-white/30 mt-1">Clinical Grade</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-light">02</p>
              <p className="text-xs tracking-widest uppercase text-white/30 mt-1">Elite Curation</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src={aboutImg}
            alt="Carissima Studio"
            className="w-full object-cover contrast-110"
            style={{ aspectRatio: "3/4", maxHeight: "520px" }}
          />
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-white/10" />
      </div>

      {/* VALORES */}
      <section className="py-28 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs tracking-widest2 uppercase text-white/30 mb-4 text-center">Specialized</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-center mb-20">
            Clinical Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              title="Resultados Reales"
              text="Tratamientos personalizados que respetan tu esencia natural."
            />
            <ValueCard
              title="Tecnología Avanzada"
              text="Equipos modernos y protocolos profesionales de última generación."
            />
            <ValueCard
              title="Atención Humana"
              text="Cada sesión es un espacio de cuidado, precisión y confianza."
            />
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-white/10" />
      </div>

      {/* PROFESIONALES */}
      <section className="py-28 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs tracking-widest2 uppercase text-white/30 mb-4 text-center">The Curators</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-center mb-20">
            Clinical Practitioners
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
            <ProfessionalCard
              name="Julieta Paz"
              role="Aesthetics Specialist"
              description="Especialista en tratamientos faciales personalizados y cuidado de la piel."
              image={pro1Img}
            />
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-white/10" />
      </div>

      {/* GALERÍA */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-6">
        <img src={img1} alt="Estética profesional" className="w-full object-cover contrast-110" style={{ aspectRatio: "4/3" }} />
        <img src={img2} alt="Tratamientos premium" className="w-full object-cover contrast-110" style={{ aspectRatio: "4/3" }} />
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 bg-[#0a0a0a] text-center border-t border-white/10">
        <p className="text-xs tracking-widest2 uppercase text-white/30 mb-4">Visit Us</p>
        <h3 className="font-serif text-3xl font-light mb-6">Location &amp; Hours</h3>
        <p className="text-white/40 text-sm mb-2">Lamadrid 117, T4000 San Miguel de Tucumán, Tucumán, Argentina</p>
        <p className="text-white/30 text-xs tracking-wide">Lun – Vie: 09:00 – 20:00 &nbsp;|&nbsp; Sáb: 10:00 – 16:00</p>
      </section>

    </main>
  );
}
