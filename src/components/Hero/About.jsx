
import ValueCard from "./about/ValueCard";
import ProfessionalCard from "./About/ProfessionalCard";
import ImageReveal from "./About/ImageReveal";
import aboutImg from "../../assets/about.jpg";
import pro1Img from "../../assets/pro1.jpg";
import pro2Img from "../../assets/pro2.jpg";
import pro3Img from "../../assets/pro3.jpg";
import img1 from "../../assets/esteticaimg1.jpg";
import img2 from "../../assets/esteticaimg2.jpg";

export default function About() {
  return (
    <main className="bg-white text-black">

      {/* HERO */}
      <section className="relative bg-[#0B0B0B] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-wide leading-tight">
              Tu belleza,<br />
              <span className="text-[#E6A6C7] font-medium">
                en manos expertas
              </span>
            </h1>

            <p className="mt-6 text-gray-300 leading-relaxed">
              En Carrissima Studio combinamos estética, bienestar y
              profesionalismo para que te sientas segura, cuidada
              y auténtica en cada tratamiento.
            </p>

            <button className="
              mt-10 px-10 py-4 rounded-full
              border-2 border-[#E6A6C7]
              text-[#E6A6C7]
              hover:bg-[#E6A6C7]
              hover:text-black
              transition-all duration-300
            ">
              Reservar consulta
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 border-2 border-[#E6A6C7] rounded-3xl translate-x-4 translate-y-4"></div>
            <img
              src={aboutImg}
              alt="Carrissima Studio"
              className="relative rounded-3xl object-cover"
            />
          </div>

        </div>
      </section>

      {/* VALORES */}
      <section className="py-24 bg-[#F7E6EF]">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl text-center font-light mb-16">
            Una experiencia pensada para vos
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <ValueCard
              title="Resultados reales"
              text="Tratamientos personalizados que respetan tu esencia natural."
            />
            <ValueCard
              title="Tecnología avanzada"
              text="Equipos modernos y protocolos profesionales."
            />
            <ValueCard
              title="Atención humana"
              text="Cada sesión es un espacio de cuidado y confianza."
            />
          </div>

        </div>
      </section>

      {/* PROFESIONALES */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl text-center font-light mb-20">
            Nuestro equipo profesional
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <ProfessionalCard
              name="Carla Martínez"
              role="Cosmetóloga & Esteticista"
              description="Especialista en tratamientos faciales personalizados y cuidado de la piel."
              image={pro1Img}
            />

            <ProfessionalCard
              name="Lucía Gómez"
              role="Dermocosmiatra"
              description="Enfoque integral en bienestar, estética corporal y tecnología avanzada."
              image={pro2Img}
            />

            <ProfessionalCard
              name="María Fernández"
              role="Especialista en estética corporal"
              description="Acompañamiento profesional con resultados reales y seguros."
              image={pro3Img}
            />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <h3 className="text-3xl font-light mb-6">
          Tu momento empieza hoy
        </h3>

        <p className="text-gray-600 max-w-xl mx-auto mb-10">
          Elegí sentirte bien, verte bien y cuidarte con quienes
          entienden tu belleza.
        </p>

        <button className="
          px-12 py-4 rounded-full
          bg-black text-white
          hover:bg-[#E6A6C7]
          hover:text-black
          transition-all duration-300
        ">
          Ver agenda
        </button>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10">
        <ImageReveal src={img1} alt="Estética profesional" />
        <ImageReveal src={img2} alt="Tratamientos premium" />
      </section>

    </main>
  );
}



