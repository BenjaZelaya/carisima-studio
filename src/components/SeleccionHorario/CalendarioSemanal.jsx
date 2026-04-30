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
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onSemana(semanaOffset - 1)}
          disabled={semanaOffset === 0}
          className="text-white/40 hover:text-white transition-colors disabled:opacity-20 text-lg"
        >
          ←
        </button>
        <p className="text-white/60 text-sm tracking-widest uppercase">
          {mesActual} {anioActual}
        </p>
        <button
          onClick={() => onSemana(semanaOffset + 1)}
          disabled={semanaOffset === 1}
          className="text-white/40 hover:text-white transition-colors disabled:opacity-20 text-lg"
        >
          →
        </button>
      </div>

      {/* Días */}
      <div className="grid grid-cols-7 gap-1">
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
              className={`flex flex-col items-center py-3 px-1 transition-all border ${
                esSeleccionado
                  ? "border-white bg-white text-black"
                  : dia.disponible
                  ? "border-transparent hover:border-white/20 text-white/60 hover:text-white"
                  : "border-transparent text-white/15 cursor-not-allowed"
              }`}
            >
              <span className="text-[10px] tracking-widest uppercase mb-1.5">{diaSemana}</span>
              <span className={`text-base font-light ${esHoy && !esSeleccionado ? "text-white" : ""}`}>
                {numeroDia}
              </span>
              {dia.disponible && !esSeleccionado && (
                <span className="w-1 h-1 rounded-full bg-white/30 mt-1.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarioSemanal;