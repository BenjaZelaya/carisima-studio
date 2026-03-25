// src/components/SeleccionHorario/CalendarioSemanal.jsx
const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const CalendarioSemanal = ({ disponibilidad, fechaSeleccionada, onSeleccionar, semanaOffset, onSemana }) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Toma los 7 días de la semana actual según offset
  const diasSemana = disponibilidad.slice(semanaOffset * 7, semanaOffset * 7 + 7);

  const mesActual = diasSemana[0]
    ? MESES[new Date(diasSemana[0].fecha + "T00:00:00").getMonth()]
    : "";

  const anioActual = diasSemana[0]
    ? new Date(diasSemana[0].fecha + "T00:00:00").getFullYear()
    : "";

  return (
    <div>
      {/* Header mes + navegación */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onSemana(semanaOffset - 1)}
          disabled={semanaOffset === 0}
          className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-30"
        >
          ←
        </button>
        <h2 className="text-lg font-bold text-gray-800">
          {mesActual} {anioActual}
        </h2>
        <button
          onClick={() => onSemana(semanaOffset + 1)}
          disabled={semanaOffset === 1}
          className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-30"
        >
          →
        </button>
      </div>

      {/* Días */}
      <div className="grid grid-cols-7 gap-2">
        {diasSemana.map((dia) => {
          const fecha = new Date(dia.fecha + "T00:00:00");
          const diaSemana = DIAS[fecha.getDay()];
          const numeroDia = fecha.getDate();
          const esSeleccionado = fechaSeleccionada === dia.fecha;
          const esHoy = fecha.toDateString() === hoy.toDateString();

          return (
            <button
              key={dia.fecha}
              onClick={() => dia.disponible && onSeleccionar(dia.fecha)}
              disabled={!dia.disponible}
              className={`flex flex-col items-center py-3 px-1 rounded-2xl transition-all ${
                esSeleccionado
                  ? "bg-[#ff7bed] text-white shadow-lg shadow-[#ff7bed]/30"
                  : dia.disponible
                  ? "hover:bg-pink-50 text-gray-700"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <span className="text-xs font-medium mb-1">{diaSemana}</span>
              <span className={`text-lg font-bold ${esHoy && !esSeleccionado ? "text-[#ff7bed]" : ""}`}>
                {numeroDia}
              </span>
              {dia.disponible && (
                <span className={`w-1.5 h-1.5 rounded-full mt-1 ${
                  esSeleccionado ? "bg-white" : "bg-[#ff7bed]"
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarioSemanal;