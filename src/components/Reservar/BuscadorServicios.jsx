// src/components/Reservar/BuscadorServicios.jsx
import { Search } from "lucide-react";

const BuscadorServicios = ({ busqueda, onChange, categorias, categoriaActiva, onCategoria }) => {
  return (
    <div className="mb-8">
      {/* Input búsqueda */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="¿Qué servicio buscás?"
          value={busqueda}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-5 py-4 bg-white rounded-2xl border border-gray-200 focus:border-[#ff7bed] focus:ring-2 focus:ring-[#ff7bed]/30 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Filtros por categoría */}
      {categorias.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoria(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              categoriaActiva === null
                ? "bg-[#ff7bed] text-white shadow-md shadow-[#ff7bed]/30"
                : "bg-white border border-gray-200 text-gray-500 hover:border-[#ff7bed] hover:text-[#ff7bed]"
            }`}
          >
            Todos
          </button>
          {categorias.map((c) => (
            <button
              key={c._id}
              onClick={() => onCategoria(c._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoriaActiva === c._id
                  ? "bg-[#ff7bed] text-white shadow-md shadow-[#ff7bed]/30"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-[#ff7bed] hover:text-[#ff7bed]"
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