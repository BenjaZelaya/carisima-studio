// src/components/hooks/useConfirm.jsx
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

// ─── Modal de confirmación con estilo ────────────────────────────────────────

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel, confirmText, danger }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full animate-fade-in">
        {/* Icono */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${
            danger ? "bg-red-100" : "bg-amber-100"
          }`}
        >
          <AlertTriangle
            size={26}
            className={danger ? "text-red-500" : "text-amber-500"}
          />
        </div>

        {/* Mensaje */}
        <p className="text-gray-800 font-semibold text-center text-base mb-7 leading-snug">
          {message}
        </p>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
          >
            No, volver
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition shadow-sm ${
              danger
                ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                : "bg-pink-500 hover:bg-pink-600 shadow-pink-200"
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
