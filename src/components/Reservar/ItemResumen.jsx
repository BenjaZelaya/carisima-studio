// src/components/Reservar/ItemResumen.jsx
import { Clock, X } from "lucide-react";

const ItemResumen = ({ servicio, onRemove }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(servicio);
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-opacity"
      >
        <X size={18} />
      </button>
      <h4 className="font-semibold text-gray-800 pr-8">{servicio.nombreProducto}</h4>
      <div className="flex justify-between items-center mt-3 text-sm">
        <span className="font-bold text-gray-900">
          AR${Number(servicio.precio || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ItemResumen;