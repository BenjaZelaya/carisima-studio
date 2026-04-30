import logo from "../../assets/logo-carissima.png";

export default function LogoHero() {
  return (
    <div className="flex flex-col items-center mb-6">
      <img
        src={logo}
        alt="Carissima Studio"
        className="w-[160px] sm:w-[190px] invert opacity-90 mb-8"
      />
      <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-[0.12em] uppercase text-white">
        Carissima
      </h1>
      <p className="font-serif text-xl sm:text-2xl font-light tracking-[0.35em] uppercase text-white/40 mt-2">
        Studio
      </p>
    </div>
  );
}
