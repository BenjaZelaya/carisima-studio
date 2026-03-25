// src/components/Pago/MetodoPago.jsx
import { Building2, Wallet } from "lucide-react";

const MetodoPago = ({ seleccionado, onChange }) => {
  const metodos = [
    {
      id: "transferencia",
      label: "Transferencia bancaria",
      descripcion: "Transferencia bancaria",
      icon: Building2,
      disponible: true,
    },
    {
      id: "mercadopago",
      label: "Mercado Pago",
      descripcion: "Tarjetas, efectivo, transferencias",
      icon: Wallet,
      disponible: false, // próximamente
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-5">Método de pago</h2>
      <div className="flex flex-col gap-3">
        {metodos.map(({ id, label, descripcion, icon: Icon, disponible }) => (
          <button
            key={id}
            onClick={() => disponible && onChange(id)}
            disabled={!disponible}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              seleccionado === id
                ? "border-gray-800 bg-gray-800 text-white"
                : disponible
                ? "border-gray-200 hover:border-gray-300 bg-white"
                : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              seleccionado === id ? "bg-white/20" : "bg-gray-100"
            }`}>
              <Icon size={20} className={seleccionado === id ? "text-white" : "text-gray-600"} />
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${seleccionado === id ? "text-white" : "text-gray-800"}`}>
                {label}
              </p>
              <p className={`text-xs ${seleccionado === id ? "text-white/70" : "text-gray-400"}`}>
                {descripcion}
              </p>
            </div>
            {!disponible && (
              <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                Próximamente
              </span>
            )}
            {seleccionado === id && (
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-gray-800 text-xs font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetodoPago;