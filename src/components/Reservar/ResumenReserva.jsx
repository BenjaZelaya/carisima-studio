// src/components/Reservar/ResumenReserva.jsx
import ItemResumen from "./ItemResumen.jsx";

const ResumenReserva = ({ seleccionados, total, onRemove, onContinuar }) => {
  return (
    <div className="w-full lg:w-96 lg:sticky lg:top-8">
      <div className="bg-white rounded-3xl p-5 sm:p-7 lg:p-8 shadow-xl border border-gray-100">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">Tu Reserva</h2>
          <span className="bg-[#ff7bed]/10 text-[#ff7bed] text-sm font-bold px-4 py-1.5 rounded-full">
            {seleccionados.length} {seleccionados.length === 1 ? "servicio" : "servicios"}
          </span>
        </div>

        {seleccionados.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 italic">
              Seleccioná servicios para ver el resumen
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-[380px] lg:max-h-[450px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
              {seleccionados.map((s) => (
                <ItemResumen key={s._id} servicio={s} onRemove={onRemove} />
              ))}
            </div>

            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total</span>
                <span className="text-3xl font-black text-[#ff7bed]">
                  AR${total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={onContinuar}
                className="w-full py-4 mt-4 rounded-2xl font-bold text-base uppercase tracking-wide bg-[#ff7bed] text-white hover:bg-[#e85ed8] shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
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