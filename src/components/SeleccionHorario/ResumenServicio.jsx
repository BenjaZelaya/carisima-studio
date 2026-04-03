// src/components/SeleccionHorario/ResumenServicio.jsx
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_NOMBRE = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

const ResumenServicio = ({ servicios, fechaSeleccionada, horarioSeleccionado, onContinuar }) => {
  const total = servicios.reduce((sum, s) => sum + (Number(s.precio) || 0), 0);

  const formatearFecha = () => {
    if (!fechaSeleccionada || !horarioSeleccionado) return null;
    const fecha = new Date(fechaSeleccionada + "T00:00:00");
    const dia = DIAS_NOMBRE[fecha.getDay()];
    const numero = fecha.getDate();
    const mes = MESES[fecha.getMonth()];
    return `${dia} ${numero} de ${mes}, ${horarioSeleccionado}hs`;
  };

  const fechaFormateada = formatearFecha();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 lg:sticky lg:top-8">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Resumen</h2>

      {/* Servicios */}
      <div className="flex flex-col gap-3 mb-5">
        {servicios.map((s) => (
          <div key={s._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <img
              src={s.img}
              alt={s.nombreProducto}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800 truncate">{s.nombreProducto}</p>
              <p className="text-xs text-[#ff7bed] font-medium">
                AR${Number(s.precio).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fecha y hora seleccionada */}
      {fechaFormateada && (
        <div className="bg-[#ff7bed]/5 border border-[#ff7bed]/20 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-gray-500 mb-0.5">Turno seleccionado</p>
          <p className="text-sm font-semibold text-[#ff7bed]">{fechaFormateada}</p>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-gray-100 pt-4 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-2xl font-black text-[#ff7bed]">
            AR${total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Botón */}
      <button
        onClick={onContinuar}
        disabled={!fechaSeleccionada || !horarioSeleccionado}
        className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wide transition-all ${
          fechaSeleccionada && horarioSeleccionado
            ? "bg-[#ff7bed] text-white hover:bg-[#e85ed8] shadow-md hover:shadow-lg"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Continuar al pago
      </button>
    </div>
  );
};

export default ResumenServicio;