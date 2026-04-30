// src/components/Reservar/ResumenReserva.jsx
import ItemResumen from "./ItemResumen.jsx";

const ResumenReserva = ({ seleccionados, total, onRemove, onContinuar }) => {
  return (
    <div className="w-full lg:w-96 lg:sticky lg:top-8">
      <div className="bg-[#111111] border border-white/10 p-6 lg:p-8">

        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-light text-white">Tu Reserva</h2>
          <span className="border border-white/15 text-white/50 text-xs px-3 py-1 tracking-wide">
            {seleccionados.length} {seleccionados.length === 1 ? "servicio" : "servicios"}
          </span>
        </div>

        {seleccionados.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-white/10">
            <p className="text-white/25 text-sm">
              Seleccioná servicios para ver el resumen
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 mb-8">
              {seleccionados.map((s) => (
                <ItemResumen key={s._id} servicio={s} onRemove={onRemove} />
              ))}
            </div>

            <div className="pt-5 border-t border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/50 text-sm">Total</span>
                <span className="font-serif text-2xl font-light text-white">
                  AR${total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={onContinuar}
                className="w-full py-4 mt-2 border border-white/30 text-white text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
              >
                Confirmar y elegir fecha
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumenReserva;