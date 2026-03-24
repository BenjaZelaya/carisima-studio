// src/components/Reservar/TarjetaServicio.jsx
import { Clock, Plus, Check } from "lucide-react";

const TarjetaServicio = ({ servicio, isSelected, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(servicio)}
      className={`group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
        isSelected
          ? "border-[#ff7bed] bg-[#ff7bed]/5"
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
    >
      <div className={`p-1 rounded-full border-2 transition-all flex-shrink-0 ${
        isSelected ? "border-[#ff7bed]/40" : "border-transparent"
      }`}>
        <img
          src={servicio.img || "https://via.placeholder.com/80?text=?"}
          alt={servicio.nombreProducto || "Servicio"}
          className="w-20 h-20 rounded-full object-cover"
          onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=?"; }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <h3 className={`font-bold text-lg sm:text-xl truncate ${
            isSelected ? "text-[#ff7bed]" : "text-gray-800"
          } group-hover:text-[#ff7bed]`}>
            {servicio.nombreProducto}
          </h3>
          <div className="text-right whitespace-nowrap">
            <p className="font-extrabold text-gray-900 text-lg sm:text-xl">
              AR${Number(servicio.precio || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mt-2">
          {servicio.descripcion || "Sin descripción disponible"}
        </p>
      </div>

      <div className={`hidden sm:flex w-12 h-12 rounded-full items-center justify-center flex-shrink-0 ${
        isSelected ? "bg-[#ff7bed] text-white" : "bg-gray-100 text-gray-400"
      }`}>
        {isSelected ? <Check size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
      </div>
    </div>
  );
};

export default TarjetaServicio;