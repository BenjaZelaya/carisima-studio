// src/components/Reservar/TarjetaServicio.jsx
import { Check, Plus } from "lucide-react";

const TarjetaServicio = ({ servicio, isSelected, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(servicio)}
      className={`group flex gap-4 p-4 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-white/50 bg-white/5"
          : "border-white/10 hover:border-white/25 bg-transparent"
      }`}
    >
      <div className="flex-shrink-0">
        <img
          src={servicio.img || "https://via.placeholder.com/80?text=?"}
          alt={servicio.nombreProducto}
          className="w-20 h-20 object-cover contrast-110"
          onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=?"; }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-serif text-lg font-light leading-tight ${
            isSelected ? "text-white" : "text-white/70 group-hover:text-white"
          } transition-colors`}>
            {servicio.nombreProducto}
          </h3>
          <p className="text-white/60 text-sm whitespace-nowrap">
            AR${Number(servicio.precio || 0).toLocaleString()}
          </p>
        </div>
        <p className="text-xs text-white/30 line-clamp-2 mt-2">
          {servicio.descripcion || "Sin descripción disponible"}
        </p>
      </div>

      <div className={`flex-shrink-0 w-8 h-8 border flex items-center justify-center self-center transition-all ${
        isSelected ? "border-white bg-white text-black" : "border-white/15 text-white/20 group-hover:border-white/30"
      }`}>
        {isSelected ? <Check size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2} />}
      </div>
    </div>
  );
};

export default TarjetaServicio;