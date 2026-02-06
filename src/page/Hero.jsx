import { useState } from "react";
import LogoHero from "../components/Hero/LogoHero";
import ButtonIconsInstaHero from "../components/Hero/ButtonIconsInstaHero";
import ButtonHero from "../components/Hero/ButtonHero";
import LocationMap from "../components/Hero/LocationMap";
import { Link } from "react-router-dom";

export default function Hero() {
  const [showLocation, setShowLocation] = useState(false);

  return (
    <>
      <section className="flex flex-col items-center text-center gap-4 mb-15 mt-30">
        <LogoHero />
      </section>

      <section className="flex flex-col items-center gap-6">

        {/* BOTONES */}
        <div className="flex flex-col items-center gap-4">

          {/* BOTÓN INSTAGRAM */}
          <a
            href="https://www.instagram.com/carissimastudio.ok?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <ButtonIconsInstaHero>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                <path d="M16.5 7.5v.01" />
              </svg>
            </ButtonIconsInstaHero>
          </a>

         <Link to="/reservar"><ButtonHero>Reservar un Turno</ButtonHero></Link>
          <ButtonHero>Ver todos los servicios</ButtonHero>
          <ButtonHero>Agenda</ButtonHero>

          <ButtonHero onClick={() => setShowLocation(!showLocation)}>
            📍 Ver ubicación
          </ButtonHero>

        </div>

        {/* DESPLEGABLE */}
        <div
          className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${showLocation ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <LocationMap />
        </div>
      </section>
    </>
  );
}

