// src/components/Pago/MetodoPago.jsx
import { Building2, Wallet } from "lucide-react";

const MetodoPago = ({ seleccionado, onChange }) => {
  const metodos = [
    {
      id: "mercadopago",
      label: "Mercado Pago",
      descripcion: "Tarjetas, efectivo, transferencias",
      icon: Wallet,
      disponible: true,
    },
    {
      id: "transferencia",
      label: "Transferencia bancaria",
      descripcion: "Transferencia bancaria",
      icon: Building2,
      disponible: true,
    },
  ];

  return (
    <div className="bg-[#111111] border border-white/10 p-6">
      <h2 className="font-serif text-xl font-light text-white mb-5">Método de pago</h2>
      <div className="flex flex-col gap-3">
        {metodos.map(({ id, label, descripcion, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-4 p-4 border transition-all text-left ${
              seleccionado === id
                ? "border-white/50 bg-white/5"
                : "border-white/10 hover:border-white/25"
            }`}
          >
            <div className={`w-10 h-10 border flex items-center justify-center flex-shrink-0 ${
              seleccionado === id ? "border-white/30" : "border-white/10"
            }`}>
              <Icon size={18} className={seleccionado === id ? "text-white" : "text-white/30"} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${seleccionado === id ? "text-white" : "text-white/50"}`}>
                {label}
              </p>
              <p className={`text-xs ${seleccionado === id ? "text-white/40" : "text-white/20"}`}>
                {descripcion}
              </p>
            </div>
            {seleccionado === id && (
              <div className="w-5 h-5 border border-white/30 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetodoPago;