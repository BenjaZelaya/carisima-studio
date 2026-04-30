// src/components/Packs/AgendarSesionModal.jsx
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import CalendarioSemanal from "../SeleccionHorario/CalendarioSemanal.jsx";
import ListaHorarios from "../SeleccionHorario/ListaHorarios.jsx";

const AgendarSesionModal = ({ packCompraId, sesion, onClose, onSuccess }) => {
  const { token } = useAuth();

  const [disponibilidad, setDisponibilidad] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const hoy = new Date().toISOString().split("T")[0];
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/horarios/disponibilidad?fecha=${hoy}`,
          { headers: { "x-token": token } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Error al cargar disponibilidad");
        setDisponibilidad(data.disponibilidad || []);
      } catch (err) {
        setError(err.message || "Error al cargar disponibilidad");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token]);

  // Actualizar horarios al cambiar fecha
  useEffect(() => {
    if (!fechaSeleccionada) return;
    setHoraSeleccionada(null);
    const diaDisponible = disponibilidad.find((d) => d.fecha === fechaSeleccionada);
    const horariosLibres = diaDisponible?.turnos
      ?.filter((t) => typeof t === "string" || !t.ocupado)
      .map((t) => (typeof t === "string" ? t : t.hora)) || [];
    setHorariosDisponibles(horariosLibres);
  }, [fechaSeleccionada, disponibilidad]);

  const handleSemana = (offset) => {
    if (offset < 0 || offset > 1) return;
    setSemanaOffset(offset);
    setFechaSeleccionada(null);
    setHoraSeleccionada(null);
  };

  const handleAgendar = async () => {
    if (!fechaSeleccionada || !horaSeleccionada) return;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/packs/compras/${packCompraId}/sesiones/${sesion._id}/agendar`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-token": token },
          body: JSON.stringify({ fecha: fechaSeleccionada, horaInicio: horaSeleccionada }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al agendar la sesión");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Error al agendar");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111111] border border-white/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-[#111111] z-10">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-0.5">
              Sesión {sesion?.numero}
            </p>
            <h2 className="text-sm font-medium text-white tracking-wide">Agendar sesión</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/8 transition text-white/40">
            <X size={16} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1">
          {error && (
            <div className="border border-red-500/20 bg-red-500/8 px-4 py-3 mb-6">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={22} className="text-white/40 animate-spin" />
            </div>
          ) : (
            <>
              {/* Selector de fecha */}
              <div className="mb-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-5">
                  Elegí una fecha
                </p>
                <CalendarioSemanal
                  disponibilidad={disponibilidad}
                  fechaSeleccionada={fechaSeleccionada}
                  onSeleccionar={setFechaSeleccionada}
                  semanaOffset={semanaOffset}
                  onSemana={handleSemana}
                />
              </div>

              {/* Selector de horario */}
              {fechaSeleccionada && (
                <div className="mb-8">
                  <ListaHorarios
                    turnos={horariosDisponibles}
                    horarioSeleccionado={horaSeleccionada}
                    onSeleccionar={setHoraSeleccionada}
                  />
                </div>
              )}

              {/* Resumen */}
              {fechaSeleccionada && horaSeleccionada && (
                <div className="border border-white/15 bg-white/5 px-4 py-3">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-1.5">
                    Sesión a agendar
                  </p>
                  <p className="text-sm text-white/80">
                    <span className="text-white">
                      {new Date(fechaSeleccionada + "T00:00:00").toLocaleDateString("es-AR")}
                    </span>
                    {" a las "}
                    <span className="text-white">{horaSeleccionada}hs</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-white/10 sticky bottom-0 bg-[#111111]">
          <button
            onClick={onClose}
            disabled={enviando}
            className="flex-1 py-3 border border-white/15 text-white/50 text-xs tracking-[0.15em] uppercase hover:bg-white/5 hover:text-white transition disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            onClick={handleAgendar}
            disabled={enviando || !fechaSeleccionada || !horaSeleccionada || loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black text-xs font-semibold tracking-[0.15em] uppercase hover:bg-white/90 transition disabled:opacity-40"
          >
            {enviando && <Loader2 size={14} className="animate-spin" />}
            {enviando ? "Agendando..." : "Confirmar fecha"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgendarSesionModal;
