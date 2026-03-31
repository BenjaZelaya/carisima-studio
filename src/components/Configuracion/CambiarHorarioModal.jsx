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
      const res = await fetch('http://localhost:5000/api/horarios/disponibilidad', {
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

      // Filtrar solo los horarios que NO están ocupados
      const horariosLibres = diaDisponible.turnos
        ?.filter((t) => !t.ocupado)
        .map((t) => t.hora) || [];

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
      const res = await fetch(`http://localhost:5000/api/turnos/${turno._id}/cambiar-horario`, {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-800">Cambiar horario</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Resumen del turno actual */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-500 uppercase font-medium mb-2">Turno actual</p>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">
                {new Date(turno?.fecha + 'T00:00:00').toLocaleDateString('es-AR')}
              </span>
              {' a las '}
              <span className="font-semibold">{turno?.horaInicio}hs</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="text-pink-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Selector de fecha */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  Selecciona nueva fecha
                </h3>
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
                <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
                  <p className="text-xs text-blue-600 uppercase font-medium mb-2">Nuevo horario</p>
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">
                      {new Date(fechaSeleccionada + 'T00:00:00').toLocaleDateString('es-AR')}
                    </span>
                    {' a las '}
                    <span className="font-semibold">{horaSeleccionada}hs</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl sticky bottom-0">
          <button
            onClick={onClose}
            disabled={enviando}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCambiar}
            disabled={enviando || !fechaSeleccionada || !horaSeleccionada || loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition disabled:opacity-50"
          >
            {enviando && <Loader2 size={18} className="animate-spin" />}
            {enviando ? 'Cambiando...' : 'Confirmar cambio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CambiarHorarioModal;
