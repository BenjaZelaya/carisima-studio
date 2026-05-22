import LogoJulietaPaz from "./LogoJulietaPaz";

export default function LogoHero() {
  return (
    <div className="flex flex-col items-center mb-6">
      <LogoJulietaPaz className="w-[200px] sm:w-[240px] text-white opacity-90 mb-8" />
      <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light tracking-[0.12em] uppercase text-white">
        Julieta Paz
      </h1>
      <p className="font-serif text-xl sm:text-2xl font-light tracking-[0.35em] uppercase text-white/40 mt-2">
        Beauty Studio
      </p>
    </div>
  );
}
