// src/components/SeleccionHorario/ListaHorarios.jsx
const ListaHorarios = ({ turnos, horarioSeleccionado, onSeleccionar }) => {
  if (!turnos || turnos.length === 0) {
    return (
      <div className="text-center py-8 text-white/25 text-xs tracking-wide mt-6">
        No hay horarios disponibles para este día
      </div>
    );
  }

  const formatearHora = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const turnosNormalizados = turnos.map((t) =>
    typeof t === "string" ? { hora: t, ocupado: false } : t
  );

  return (
    <div className="mt-8">
      <p className="text-xs tracking-widest uppercase text-white/30 mb-4">
        Horarios disponibles
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {turnosNormalizados.map(({ hora, ocupado }) => {
          const esSeleccionado = horarioSeleccionado === hora;
          return (
            <button
              key={hora}
              onClick={() => !ocupado && onSeleccionar(hora)}
              disabled={ocupado}
              className={`py-3 px-4 border text-sm transition-all ${
                ocupado
                  ? "border-white/5 text-white/15 cursor-not-allowed"
                  : esSeleccionado
                  ? "border-white bg-white text-black font-medium"
                  : "border-white/15 text-white/50 hover:border-white/40 hover:text-white"
              }`}
            >
              {formatearHora(hora)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ListaHorarios;