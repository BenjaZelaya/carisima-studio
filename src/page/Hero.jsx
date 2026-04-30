import { useState } from "react";
import LogoHero from "../components/Hero/LogoHero";
import LocationMap from "../components/Hero/LocationMap";
import { Link } from "react-router-dom";
import About from "../components/Hero/About";

export default function Hero() {
  const [showLocation, setShowLocation] = useState(false);

  return (
    <div className="bg-[#0a0a0a]">

      {/* HERO PRINCIPAL */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Degradado sutil de fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-white/20" />

        <LogoHero />

        <p className="text-xs tracking-widest2 uppercase text-white/40 mb-8 font-sans">
          Clinical Precision. Timeless Beauty.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link to="/reservar">
            <button className="px-10 py-3.5 text-sm font-medium tracking-widest uppercase border border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300">
              Reservar un turno
            </button>
          </Link>
          <Link to="/servicios">
            <button className="px-10 py-3.5 text-sm font-medium tracking-widest uppercase border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-all duration-300">
              Ver Servicios
            </button>
          </Link>
        </div>

        {/* LINKS SECUNDARIOS */}
        <div className="flex items-center gap-8">
          <a
            href="https://www.instagram.com/carissimastudio.ok?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
              <path d="M16.5 7.5v.01" />
            </svg>
          </a>
          <button
            onClick={() => setShowLocation(!showLocation)}
            className="text-xs tracking-widest uppercase text-white/30 hover:text-white transition-colors duration-200"
          >
            Ver ubicación
          </button>
        </div>

        {/* MAPA */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out mt-8 ${
          showLocation ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <LocationMap />
        </div>

        {/* Flecha scroll */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 animate-bounce">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0v20M1 13l7 7 7-7" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>
      </section>

      <About />
    </div>
  );
}

