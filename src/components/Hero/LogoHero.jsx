import logo from "../../assets/logo-carissima.png"; 
// asegurate de poner la imagen en src/assets/

export default function LogoHero() {
  return (
    <div className="relative flex items-center justify-center mb-10">
      
      {/* CÍRCULO */}
      <div
        className="
          absolute
          w-[260px] h-[260px]
          rounded-full
          border border-gray-400
          opacity-60
        "
      />

      {/* LOGO */}
      <img
        src={logo}
        alt="Carrissima Studio"
        className="relative w-[220px]"
      />
    </div>
  );
}
