// src/components/Reservar/BuscadorServicios.jsx
import { Search } from "lucide-react";

const BuscadorServicios = ({ busqueda, onChange, categorias, categoriaActiva, onCategoria }) => {
  return (
    <div className="mb-6">
      {/* Input */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
        <input
          type="text"
          placeholder="¿Qué servicio buscás?"
          value={busqueda}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-5 py-3.5 bg-transparent border border-white/15 text-white placeholder:text-white/25 outline-none text-sm tracking-wide focus:border-white/40 transition-colors"
        />
      </div>

      {/* Filtros categoría */}
      {categorias.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoria(null)}
            className={`px-4 py-1.5 text-xs tracking-widest uppercase font-medium transition-all border ${
              categoriaActiva === null
                ? "border-white text-white"
                : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/70"
            }`}
          >
            Todos
          </button>
          {categorias.map((c) => (
            <button
              key={c._id}
              onClick={() => onCategoria(c._id)}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase font-medium transition-all border ${
                categoriaActiva === c._id
                  ? "border-white text-white"
                  : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/70"
              }`}
            >
              {c.nombreCategoria}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuscadorServicios;