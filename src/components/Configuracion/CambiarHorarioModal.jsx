import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import CalendarioSemanal from '../SeleccionHorario/CalendarioSemanal';
import ListaHorarios from '../SeleccionHorario/ListaHorarios';

const CambiarHorarioModal = ({ turno, isOpen, onClose, onSuccess, token }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(turno?.fecha?.split('T')[0] || '');
  const [horaSeleccionada, setHoraSeleccionada] = useState(turno?.horaInicio || '');
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar disponibilidad al abrir el modal
  useEffect(() => {
    if (isOpen && turno) {
      cargarDisponibilidad();
    }
  }, [isOpen, turno]);

  // Cargar horarios cuando cambia la fecha seleccionada
  useEffect(() => {
    if (fechaSeleccionada && disponibilidad.length > 0) {
      cargarHorarios();
    }
  }, [fechaSeleccionada, disponibilidad]);

  const cargarDisponibilidad = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/horarios/disponibilidad`, {
        headers: {
          'x-token': token,
        },
      });

      if (!res.ok) {
        throw new Error('Error al cargar disponibilidad');
      }

      const disponibilidadData = await res.json();
      setDisponibilidad(disponibilidadData);
      
      // Seleccionar el primer día disponible con horarios libres
      const primerDiaDisponible = disponibilidadData?.find(
        (d) => d.disponible && d.turnos?.some((t) => !t.ocupado)
      );
      setFechaSeleccionada(primerDiaDisponible?.fecha || disponibilidadData?.[0]?.fecha || '');
    } catch (err) {
      setError('Error al cargar disponibilidad');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarHorarios = async () => {
    try {
      // Obtener horarios del día seleccionado desde disponibilidad
      const diaDisponible = disponibilidad.find((d) => d.fecha === fechaSeleccionada);
      
      if (!diaDisponible || !diaDisponible.disponible) {
        setHorariosDisponibles([]);
        setHoraSeleccionada('');
        return;
      }

      // Filtrar solo los horarios que NO están ocupados (maneja strings y objetos)
      const horariosLibres = diaDisponible.turnos
        ?.filter((t) => typeof t === 'string' || !t.ocupado)
        .map((t) => typeof t === 'string' ? t : t.hora) || [];

      setHorariosDisponibles(horariosLibres);
      
      // Auto-seleccionar la hora actual si está disponible, sino la primera disponible
      if (horariosLibres.includes(horaSeleccionada)) {
        setHoraSeleccionada(horaSeleccionada);
      } else {
        setHoraSeleccionada(horariosLibres[0] || '');
      }
    } catch (err) {
      console.error('Error al cargar horarios:', err);
      setError('Error al cargar horarios');
    }
  };

  const handleSemana = (nuevoOffset) => {
    setSemanaOffset(nuevoOffset);
  };

  const handleCambiar = async () => {
    if (!fechaSeleccionada || !horaSeleccionada) {
      setError('Por favor selecciona fecha y horario');
      return;
    }

    setEnviando(true);
    setError(null);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/turnos/${turno._id}/cambiar-horario`, {
        method: 'PATCH',
        headers: {
          'x-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha: new Date(fechaSeleccionada + 'T00:00:00').toISOString(),
          horaInicio: horaSeleccionada,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Error al cambiar el horario');
      }

      // Éxito
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al cambiar el horario');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111111] border border-white/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-[#111111] z-10">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-0.5">Turno</p>
            <h2 className="text-sm font-medium text-white tracking-wide">Cambiar horario</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/8 transition text-white/40">
            <X size={16} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1">
          {/* Resumen del turno actual */}
          <div className="border border-white/10 bg-white/4 px-4 py-3 mb-6">
            <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-1.5">Turno actual</p>
            <p className="text-sm text-white/60">
              <span className="text-white/90">
                {new Date(turno?.fecha + 'T00:00:00').toLocaleDateString('es-AR')}
              </span>
              {' a las '}
              <span className="text-white/90">{turno?.horaInicio}hs</span>
            </p>
          </div>

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
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-5">Seleccioná nueva fecha</p>
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

              {/* Resumen del nuevo horario */}
              {fechaSeleccionada && horaSeleccionada && (
                <div className="border border-white/15 bg-white/5 px-4 py-3 mb-2">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-1.5">Nuevo horario</p>
                  <p className="text-sm text-white/80">
                    <span className="text-white">
                      {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-AR')}
                    </span>
                    {' a las '}
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
            onClick={handleCambiar}
            disabled={enviando || !fechaSeleccionada || !horaSeleccionada || loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black text-xs font-semibold tracking-[0.15em] uppercase hover:bg-white/90 transition disabled:opacity-40"
          >
            {enviando && <Loader2 size={14} className="animate-spin" />}
            {enviando ? 'Cambiando...' : 'Confirmar cambio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CambiarHorarioModal;
