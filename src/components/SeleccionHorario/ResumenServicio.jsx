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
    <div className="bg-[#111111] border border-white/10 p-6 lg:sticky lg:top-8">
      <h2 className="font-serif text-xl font-light text-white mb-6">Resumen</h2>

      {/* Servicios */}
      <div className="flex flex-col gap-3 mb-6">
        {servicios.map((s) => (
          <div key={s._id} className="flex items-center gap-3">
            <img
              src={s.img}
              alt={s.nombreProducto}
              className="w-12 h-12 object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm font-light text-white/70 truncate">{s.nombreProducto}</p>
              <p className="text-xs text-white/30">
                AR${Number(s.precio).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fecha seleccionada */}
      {fechaFormateada && (
        <div className="border border-white/10 px-4 py-3 mb-6">
          <p className="text-xs text-white/30 mb-1 tracking-wide">Turno seleccionado</p>
          <p className="text-sm text-white/70">{fechaFormateada}</p>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-white/10 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-sm">Total</span>
          <span className="font-serif text-xl font-light text-white">
            AR${total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Botón */}
      <button
        onClick={onContinuar}
        disabled={!fechaSeleccionada || !horarioSeleccionado}
        className={`w-full py-3.5 text-sm font-medium tracking-widest uppercase transition-all duration-300 border ${
          fechaSeleccionada && horarioSeleccionado
            ? "border-white/30 text-white hover:bg-white hover:text-black"
            : "border-white/10 text-white/20 cursor-not-allowed"
        }`}
      >
        Continuar al pago
      </button>
    </div>
  );
};

export default ResumenServicio;