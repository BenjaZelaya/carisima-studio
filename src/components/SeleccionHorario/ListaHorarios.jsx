// src/components/SeleccionHorario/ListaHorarios.jsx
const ListaHorarios = ({ turnos, horarioSeleccionado, onSeleccionar }) => {
  if (!turnos || turnos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No hay horarios disponibles para este día
      </div>
    );
  }

  const formatearHora = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    const periodo = h >= 12 ? "PM" : "AM";
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return { hora: `${h12}:${m.toString().padStart(2, "0")}`, periodo };
  };

  // Normaliza para manejar tanto strings como objetos { hora, ocupado }
  const turnosNormalizados = turnos.map((t) =>
    typeof t === "string" ? { hora: t, ocupado: false } : t
  );

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Horarios disponibles
      </h3>
      <div
        className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#ff7bed transparent" }}
      >
        {turnosNormalizados.map(({ hora, ocupado }) => {
          const { hora: horaFormateada, periodo } = formatearHora(hora);
          const esSeleccionado = horarioSeleccionado === hora;

          return (
            <button
              key={hora}
              onClick={() => !ocupado && onSeleccionar(hora)}
              disabled={ocupado}
              className={`flex items-center justify-between px-5 py-3.5 rounded-xl border-2 transition-all ${
                ocupado
                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60"
                  : esSeleccionado
                  ? "border-[#ff7bed] bg-[#ff7bed]/5 text-[#ff7bed]"
                  : "border-gray-100 bg-gray-50 hover:border-[#ff7bed]/40 hover:bg-pink-50/50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🕐</span>
                <span className="font-semibold">{horaFormateada}</span>
              </div>
              <div className="flex items-center gap-2">
                {ocupado && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                    Reservado
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    ocupado
                      ? "bg-gray-100 text-gray-300"
                      : esSeleccionado
                      ? "bg-[#ff7bed]/20 text-[#ff7bed]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {periodo}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ListaHorarios;