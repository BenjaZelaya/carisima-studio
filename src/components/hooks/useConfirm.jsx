// src/components/hooks/useConfirm.jsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

// ─── Modal de confirmación con estilo ────────────────────────────────────────

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel, confirmText, danger }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-[#111111] border border-white/15 p-8 max-w-sm w-full">
        {/* Icono */}
        <div
          className={`w-10 h-10 border flex items-center justify-center mx-auto mb-6 ${
            danger ? "border-red-500/30 bg-red-500/8" : "border-white/15 bg-white/5"
          }`}
        >
          <AlertTriangle
            size={18}
            className={danger ? "text-red-400" : "text-white/50"}
          />
        </div>

        {/* Mensaje */}
        <p className="text-white/80 text-center text-sm leading-relaxed mb-8 tracking-wide">
          {message}
        </p>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-white/15 text-white/50 text-xs tracking-[0.15em] uppercase hover:bg-white/5 hover:text-white transition"
          >
            No, volver
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase transition ${
              danger
                ? "border border-red-500/40 text-red-400 hover:bg-red-500/15"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────

const useConfirm = () => {
  const [state, setState] = useState({
    open: false,
    message: "",
    resolve: null,
    danger: false,
    confirmText: "Confirmar",
  });

  const confirm = (message, { danger = false, confirmText = "Confirmar" } = {}) =>
    new Promise((resolve) => {
      setState({ open: true, message, resolve, danger, confirmText });
    });

  const handleConfirm = () => {
    state.resolve(true);
    setState((s) => ({ ...s, open: false }));
  };

  const handleCancel = () => {
    state.resolve(false);
    setState((s) => ({ ...s, open: false }));
  };

  const ConfirmDialog = (
    <ConfirmModal
      isOpen={state.open}
      message={state.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      danger={state.danger}
      confirmText={state.confirmText}
    />
  );

  return { confirm, ConfirmDialog };
};

export default useConfirm;
