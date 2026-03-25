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

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Horarios disponibles
      </h3>
      <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#ff7bed transparent" }}
      >
        {turnos.map((turno) => {
          const { hora, periodo } = formatearHora(turno);
          const esSeleccionado = horarioSeleccionado === turno;

          return (
            <button
              key={turno}
              onClick={() => onSeleccionar(turno)}
              className={`flex items-center justify-between px-5 py-3.5 rounded-xl border-2 transition-all ${
                esSeleccionado
                  ? "border-[#ff7bed] bg-[#ff7bed]/5 text-[#ff7bed]"
                  : "border-gray-100 bg-gray-50 hover:border-[#ff7bed]/40 hover:bg-pink-50/50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🕐</span>
                <span className="font-semibold">{hora}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                esSeleccionado ? "bg-[#ff7bed]/20 text-[#ff7bed]" : "bg-gray-200 text-gray-500"
              }`}>
                {periodo}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ListaHorarios;