// src/components/Packs/TarjetaPack.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Layers } from "lucide-react";

const TarjetaPack = ({ pack }) => {
  const navigate = useNavigate();
  const { estaLogueado } = useAuth();

  const seña = Math.round(pack.precio * ((pack.porcentajeSeña ?? 50) / 100));

  const handleComprar = () => {
    if (!estaLogueado) {
      navigate("/login");
    } else {
      navigate(`/pago-pack/${pack._id}`);
    }
  };

  return (
    <div className="bg-[#111111] border border-white/10 flex flex-col overflow-hidden group">
      {/* Imagen opcional */}
      {pack.imagen && (
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img
            src={pack.imagen}
            alt={pack.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}

      {/* Ícono si no hay imagen */}
      {!pack.imagen && (
        <div className="flex items-center justify-center py-10 border-b border-white/8 bg-white/3">
          <Layers size={32} className="text-white/20" />
        </div>
      )}

      {/* Contenido */}
      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1.5">Pack</p>
          <h3 className="font-serif text-xl font-light text-white mb-1">{pack.nombre}</h3>
          {pack.descripcion && (
            <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
              {pack.descripcion}
            </p>
          )}
        </div>

        {/* Servicios incluidos */}
        {pack.serviciosIncluidos?.length > 0 && (
          <div className="mb-4 space-y-1">
            {pack.serviciosIncluidos.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                <span className="w-1 h-1 rounded-full bg-white/25 shrink-0" />
                <span>
                  {s.cantidad > 1 && <span className="text-white/70">{s.cantidad}× </span>}
                  {s.nombre}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Sesiones */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-[10px] tracking-widest uppercase text-white/30">
            {pack.totalSesiones} sesión{pack.totalSesiones !== 1 ? "es" : ""}
          </span>
        </div>

        {/* Precio */}
        <div className="mt-auto">
          <div className="border-t border-white/10 pt-4 mb-4">
            <p className="text-2xl font-light text-white">
              AR${pack.precio.toLocaleString("es-AR")}
            </p>
            <p className="text-[10px] text-white/30 mt-1">
              Seña: AR${seña.toLocaleString("es-AR")} · Resto en el local
            </p>
          </div>

          <button
            onClick={handleComprar}
            className="w-full border border-white/30 text-white hover:bg-white hover:text-black py-3 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300"
          >
            Comprar pack
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarjetaPack;
