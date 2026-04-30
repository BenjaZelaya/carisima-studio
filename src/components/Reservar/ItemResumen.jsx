// src/components/Reservar/ItemResumen.jsx
import { X } from "lucide-react";

const ItemResumen = ({ servicio, onRemove }) => {
  return (
    <div className="border border-white/10 p-4 relative group hover:border-white/20 transition-colors">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(servicio);
        }}
        className="absolute top-3 right-3 text-white/20 hover:text-white/60 transition p-1"
      >
        <X size={14} />
      </button>

      <h4 className="font-serif text-sm font-light text-white/70 pr-7 leading-tight">
        {servicio.nombreProducto}
      </h4>

      <p className="text-white/40 text-xs mt-2">
        AR${Number(servicio.precio || 0).toLocaleString()}
      </p>
    </div>
  );
};

export default ItemResumen;