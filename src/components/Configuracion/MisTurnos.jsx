// src/components/Configuracion/MisTurnos.jsx
import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, X, Edit2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import CambiarHorarioModal from './CambiarHorarioModal';
import useConfirm from '../hooks/useConfirm.jsx';

const ESTADOS_COLOR = {
  borrador:   'bg-white/5 text-white/40 border-white/10',
  confirmado: 'bg-white/10 text-white border-white/20',
  señado:     'bg-white/8 text-white/70 border-white/15',
  pendiente:  'bg-white/5 text-white/50 border-white/10',
  cancelado:  'bg-red-500/10 text-red-400 border-red-500/20',
  completado: 'bg-white/5 text-white/30 border-white/8',
};

const formatearFecha = (fecha) => {
  const fechaStr = fecha?.split("T")[0];
  return new Date(fechaStr + "T12:00:00").toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

const MisTurnos = () => {
  const { token } = useAuth();
  const { confirm: askConfirm, ConfirmDialog } = useConfirm();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelando, setCancelando] = useState(null);
  const [cambiosDisponibles, setCambiosDisponibles] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const prevEstadosRef = useRef({});

  const cargar = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/mis-turnos`, {
        headers: { 'x-token': token },
      });
      const data = await res.json();
      if (!res.ok) { setError("Error al cargar tus turnos."); return; }
      
      const turnosRaw = data.data || data.turnos || (Array.isArray(data) ? data : []);
      const turnosData = turnosRaw.filter((t) => t.estado !== 'borrador');

      // Detectar turnos que cambiaron a "confirmado" desde el último poll
      const nuevosConfirmados = turnosData.filter((t) => {
        const estadoAnterior = prevEstadosRef.current[t._id];
        return t.estado === 'confirmado' && estadoAnterior && estadoAnterior !== 'confirmado';
      });

      if (nuevosConfirmados.length > 0) {
        const nuevas = nuevosConfirmados.map((t) => ({
          id: t._id + Date.now(),
          mensaje: `¡Tu turno del ${formatearFecha(t.fecha)} a las ${t.horaInicio}hs fue confirmado!`,
        }));
        setNotificaciones((prev) => [...prev, ...nuevas]);
        nuevas.forEach((n) => {
          setTimeout(() => {
            setNotificaciones((prev) => prev.filter((x) => x.id !== n.id));
          }, 8000);
        });
      }

      // Guardar estados actuales para la próxima comparación
      const nuevosEstados = {};
      turnosData.forEach((t) => { nuevosEstados[t._id] = t.estado; });
      prevEstadosRef.current = nuevosEstados;

      setTurnos(turnosData);
      
      // Cargar info de cambios disponibles para cada turno confirmado
      turnosData.forEach(async (turno) => {
        if (turno.estado === 'confirmado') {
          try {
            const resCambios = await fetch(
              `${import.meta.env.VITE_API_URL}/turnos/${turno._id}/cambios-disponibles`,
              { headers: { 'x-token': token } }
            );
            if (resCambios.ok) {
              const infoCambios = await resCambios.json();
              setCambiosDisponibles(prev => ({
                ...prev,
                [turno._id]: infoCambios
              }));
            }
          } catch (err) {
            console.error('Error al cargar cambios disponibles:', err);
          }
        }
      });
    } catch {
      setError("Error de conexión. Intentalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) cargar();
    
    // Polling cada 5 segundos para actualizar automáticamente cuando se procesa un pago
    const intervalo = setInterval(() => {
      if (token) cargar();
    }, 5000);
    
    return () => clearInterval(intervalo);
  }, [token]);

  const handleCancelar = async (id) => {
    if (!await askConfirm("¿Cancelar este turno?", { danger: true, confirmText: "Sí, cancelar" })) return;
    setCancelando(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/${id}/cancelar`, {
        method: 'PATCH',
        headers: { 'x-token': token },
      });
      if (res.ok) cargar();
    } catch {
      setError("Error al cancelar el turno");
    } finally {
      setCancelando(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-12 text-center">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button onClick={() => window.location.reload()}
          className="px-6 py-2 border border-white/20 text-white/60 text-xs tracking-widest uppercase hover:bg-white/5 transition">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      {ConfirmDialog}

      {/* Header */}
      <div className="border-b border-white/8 pb-6 mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">Admin / Mis Turnos</p>
        <h1 className="text-2xl font-bold tracking-tight text-white">Mis Turnos</h1>
      </div>

      {/* Notificaciones */}
      {notificaciones.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {notificaciones.map((n) => (
            <div key={n.id} className="flex items-center gap-3 bg-white/5 border border-white/15 text-white/80 px-4 py-3">
              <CheckCircle size={15} className="shrink-0 text-white/60" />
              <p className="text-sm flex-1">{n.mensaje}</p>
              <button onClick={() => setNotificaciones((prev) => prev.filter((x) => x.id !== n.id))}>
                <X size={14} className="text-white/30 hover:text-white transition" />
              </button>
            </div>
          ))}
        </div>
      )}

      {turnos.length === 0 ? (
        <div className="border border-white/8 p-16 flex flex-col items-center text-center">
          <Calendar size={28} className="text-white/20 mb-4" />
          <p className="text-white/40 text-sm">Todavía no tenés turnos reservados</p>
          <p className="text-white/25 text-xs mt-1">Cuando reserves un turno aparecerá acá</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {turnos.map((turno) => (
            <div key={turno._id} className="border border-white/10 bg-[#111111] p-5">

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="border border-white/10 p-2.5 text-white/40">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white capitalize">
                      {formatearFecha(turno.fecha)}
                    </p>
                    <div className="flex items-center gap-1.5 text-white/40 text-xs mt-0.5">
                      <Clock size={11} />
                      <span>{turno.horaInicio}hs</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-[10px] tracking-widest uppercase border ${ESTADOS_COLOR[turno.estado] || ESTADOS_COLOR.completado}`}>
                  {turno.estado}
                </span>
              </div>

              {/* Servicios */}
              <div className="pt-4 border-t border-white/8 mb-4">
                <p className="text-[10px] tracking-[0.15em] uppercase text-white/25 mb-2">Servicios</p>
                <div className="flex flex-wrap gap-2">
                  {turno.productos?.map((p) => (
                    <div key={p._id} className="flex items-center gap-2 border border-white/10 px-3 py-1.5">
                      {p.img && (
                        <img src={p.img} alt={p.nombreProducto} className="w-5 h-5 object-cover" />
                      )}
                      <span className="text-xs text-white/60">{p.nombreProducto}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="flex justify-between text-xs pt-3 border-t border-white/8 mb-4">
                <div className="text-white/40">
                  Total: <span className="text-white/80 font-medium">AR${turno.total?.toLocaleString()}</span>
                </div>
                <div className="text-white/40">
                  Seña: <span className="text-white/60">AR${turno.seña?.toLocaleString()}</span>
                </div>
              </div>

              {/* Info cambios */}
              {turno.estado === 'confirmado' && cambiosDisponibles[turno._id] && (
                <div className="border border-white/8 bg-white/3 p-3 mb-4">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-2">Cambios de horario</p>
                  <p className="text-xs text-white/50">
                    Restantes: <span className="text-white/80 font-medium">{cambiosDisponibles[turno._id].cambiosRestantes}/2</span>
                  </p>
                  {cambiosDisponibles[turno._id].tiempoRestanteHoras > 0 && (
                    <p className="text-xs text-white/40 mt-1">
                      Disponible por: <span className="text-white/60">{cambiosDisponibles[turno._id].tiempoRestanteHoras}h</span>
                    </p>
                  )}
                </div>
              )}

              {/* Botones */}
              {turno.estado === 'confirmado' && cambiosDisponibles[turno._id]?.puedesCambiar && (
                <button
                  onClick={() => { setTurnoSeleccionado(turno); setModalAbierto(true); }}
                  className="flex items-center gap-2 border border-white/20 text-white/60 hover:text-white hover:border-white/40 px-4 py-2 text-xs tracking-widest uppercase transition"
                >
                  <Edit2 size={13} />
                  Cambiar horario
                </button>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Modal para cambiar horario */}
      {turnoSeleccionado && (
        <CambiarHorarioModal
          turno={turnoSeleccionado}
          isOpen={modalAbierto}
          onClose={() => {
            setModalAbierto(false);
            setTurnoSeleccionado(null);
          }}
          onSuccess={() => cargar()}
          token={token}
        />
      )}
    </div>
  );
};

export default MisTurnos;