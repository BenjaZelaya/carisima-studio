// src/components/Configuracion/MisTurnos.jsx
import { Calendar } from "lucide-react";

const MisTurnos = () => {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Mis Turnos</h1>
      <p className="text-gray-400 text-sm mb-8">Historial y próximas reservas</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4">
          <Calendar size={28} className="text-pink-400" />
        </div>
        <p className="text-gray-500 font-medium">Todavía no tenés turnos reservados</p>
        <p className="text-gray-400 text-sm mt-1">Cuando reserves un turno aparecerá acá</p>
      </div>
    </div>
  );
};

export default MisTurnos;