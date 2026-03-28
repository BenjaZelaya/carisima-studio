// src/components/Reservar/ItemResumen.jsx
import { X } from "lucide-react";

const ItemResumen = ({ servicio, onRemove }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl relative group hover:bg-gray-100 transition-colors">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(servicio);
        }}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-opacity p-1"
      >
        <X size={18} />
      </button>

      <h4 className="font-semibold text-gray-800 pr-8 leading-tight">
        {servicio.nombreProducto}
      </h4>

      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-gray-900 text-lg">
          AR${Number(servicio.precio || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ItemResumen;