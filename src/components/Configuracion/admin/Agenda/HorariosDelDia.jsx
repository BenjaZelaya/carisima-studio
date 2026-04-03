// src/components/Configuracion/admin/agenda/HorariosDelDia.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { X, Lock, Unlock } from "lucide-react";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_NOMBRE = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

const HorariosDelDia = ({ fecha, onCerrar, onActualizar }) => {
  const { token } = useAuth();
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [bloqueos, setBloqueos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fechaObj = new Date(fecha + "T00:00:00");
  const titulo = `${DIAS_NOMBRE[fechaObj.getDay()]} ${fechaObj.getDate()} de ${MESES[fechaObj.getMonth()]}`;

  const cargar = async () => {
    setCargando(true);
    try {
      const [resDisp, resBloqueos] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/horarios/disponibilidad?fecha=${fecha}`),
        fetch(`${import.meta.env.VITE_API_URL}/horarios/bloqueos`, { headers: { "x-token": token } }),
      ]);
      const dataDisp = await resDisp.json();
      const dataBloqueos = await resBloqueos.json();

      const diaDisp = dataDisp.find((d) => d.fecha === fecha);
      setDisponibilidad(diaDisp);

      const bloqueosDelDia = dataBloqueos.filter((b) => {
        const fechaBloqueo = new Date(b.fecha).toISOString().split("T")[0];
        return fechaBloqueo === fecha;
      });
      setBloqueos(bloqueosDelDia);
    } catch {
      console.error("Error al cargar horarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [fecha]);

  const bloquearHorario = async (horaInicio, horaFin) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/horarios/bloqueos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({ tipo: "horario", fecha, horaInicio, horaFin }),
      });
      await cargar();
      onActualizar?.();
    } catch {
      console.error("Error al bloquear horario");
    }
  };

  const desbloquearHorario = async (bloqueoId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/horarios/bloqueos/${bloqueoId}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      await cargar();
      onActualizar?.();
    } catch {
      console.error("Error al desbloquear horario");
    }
  };

  const esBloqueado = (hora) => bloqueos.find((b) => b.tipo === "horario" && b.horaInicio === hora);

  // Genera todos los horarios del día incluyendo los bloqueados
  // Normaliza turnos que ahora son objetos {hora, ocupado}
const turnosNormalizados = (disponibilidad?.turnos || []).map((t) =>
  typeof t === "string" ? t : t.hora
);

const todosLosHorarios = disponibilidad
  ? [
      ...turnosNormalizados,
      ...bloqueos
        .filter((b) => b.tipo === "horario")
        .map((b) => b.horaInicio)
        .filter((h) => !turnosNormalizados.includes(h)),
    ].sort()
  : [];
  const calcularHoraFin = (horaInicio) => {
    const [h, m] = horaInicio.split(":").map(Number);
    const totalMin = h * 60 + m + 60;
    return `${Math.floor(totalMin / 60).toString().padStart(2, "0")}:${(totalMin % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800">{titulo}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Administrá los horarios de este día</p>
          </div>
          <button onClick={onCerrar} className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 max-h-[400px] overflow-y-auto">
          {cargando ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !disponibilidad?.disponible && bloqueos.filter(b => b.tipo === "dia").length > 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">Este día está bloqueado completamente</p>
          ) : todosLosHorarios.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No hay horarios para este día</p>
          ) : (
            <div className="flex flex-col gap-2">
              {todosLosHorarios.map((hora) => {
                const bloqueo = esBloqueado(hora);
                return (
                  <div key={hora}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                      bloqueo ? "bg-red-50 border border-red-100" : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-semibold ${bloqueo ? "text-red-400" : "text-gray-700"}`}>
                        {hora}
                      </span>
                      {bloqueo && (
                        <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Bloqueado</span>
                      )}
                    </div>
                    <button
                      onClick={() => bloqueo
                        ? desbloquearHorario(bloqueo._id)
                        : bloquearHorario(hora, calcularHoraFin(hora))
                      }
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition ${
                        bloqueo
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-red-100 text-red-500 hover:bg-red-200"
                      }`}
                    >
                      {bloqueo ? <><Unlock size={12} /> Habilitar</> : <><Lock size={12} /> Bloquear</>}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorariosDelDia;