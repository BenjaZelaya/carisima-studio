// src/components/Reservar/TarjetaServicio.jsx
import { Check, Plus } from "lucide-react";

const TarjetaServicio = ({ servicio, isSelected, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(servicio)}
      className={`group flex flex-col sm:flex-row gap-4 sm:gap-5 p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.985] ${
        isSelected
          ? "border-[#ff7bed] bg-[#ff7bed]/5"
          : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
      }`}
    >
      <div className={`p-1 rounded-2xl border-2 flex-shrink-0 self-center sm:self-start ${
        isSelected ? "border-[#ff7bed]/30" : "border-transparent"
      }`}>
        <img
          src={servicio.img || "https://via.placeholder.com/80?text=?"}
          alt={servicio.nombreProducto}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
          onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=?"; }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <h3 className={`font-bold text-lg sm:text-xl leading-tight ${
            isSelected ? "text-[#ff7bed]" : "text-gray-800"
          } group-hover:text-[#ff7bed]`}>
            {servicio.nombreProducto}
          </h3>

          <p className="font-extrabold text-xl sm:text-2xl text-gray-900 whitespace-nowrap">
            AR${Number(servicio.precio || 0).toLocaleString()}
          </p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mt-2 pr-4">
          {servicio.descripcion || "Sin descripción disponible"}
        </p>
      </div>

      {/* Icono + / ✓ */}
      <div className={`hidden sm:flex w-12 h-12 rounded-2xl items-center justify-center flex-shrink-0 self-center transition-all ${
        isSelected ? "bg-[#ff7bed] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
      }`}>
        {isSelected ? <Check size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
      </div>
    </div>
  );
};

export default TarjetaServicio;