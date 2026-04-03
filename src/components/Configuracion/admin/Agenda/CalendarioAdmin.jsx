// src/components/Configuracion/admin/agenda/CalendarioAdmin.jsx
import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";
import HorariosDelDia from "./HorariosDelDia.jsx";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const CalendarioAdmin = ({ disponibilidad, bloqueos, token, onActualizar }) => {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const primerDiaDelMes = new Date(anio, mes, 1).getDay();
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();

  const anteriorMes = () => {
    if (mes === 0) { setMes(11); setAnio(anio - 1); }
    else setMes(mes - 1);
  };

  const siguienteMes = () => {
    if (mes === 11) { setMes(0); setAnio(anio + 1); }
    else setMes(mes + 1);
  };

  const formatFecha = (dia) => {
    const m = String(mes + 1).padStart(2, "0");
    const d = String(dia).padStart(2, "0");
    return `${anio}-${m}-${d}`;
  };

  const esBloqueadoDia = (dia) => {
    const fecha = formatFecha(dia);
    return bloqueos.some((b) => {
      const fechaBloqueo = new Date(b.fecha).toISOString().split("T")[0];
      return fechaBloqueo === fecha && b.tipo === "dia";
    });
  };

  const estaDisponible = (dia) => {
    const fecha = formatFecha(dia);
    const disp = disponibilidad.find((d) => d.fecha === fecha);
    return disp?.disponible || false;
  };

  const esPasado = (dia) => {
    const fecha = new Date(anio, mes, dia);
    fecha.setHours(0, 0, 0, 0);
    const hoyReset = new Date();
    hoyReset.setHours(0, 0, 0, 0);
    return fecha < hoyReset;
  };

  const bloquearDia = async (dia) => {
    const fecha = formatFecha(dia);
    try {
      await fetch("http://localhost:5000/api/horarios/bloqueos", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify({ tipo: "dia", fecha }),
      });
      onActualizar();
    } catch {
      console.error("Error al bloquear día");
    }
  };

  const desbloquearDia = async (dia) => {
    const fecha = formatFecha(dia);
    const bloqueo = bloqueos.find((b) => {
      const fechaBloqueo = new Date(b.fecha).toISOString().split("T")[0];
      return fechaBloqueo === fecha && b.tipo === "dia";
    });
    if (!bloqueo) return;
    try {
      await fetch(`http://localhost:5000/api/horarios/bloqueos/${bloqueo._id}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      onActualizar();
    } catch {
      console.error("Error al desbloquear día");
    }
  };

  const handleClickDia = (dia) => {
    if (esPasado(dia)) return;
    setDiaSeleccionado(formatFecha(dia));
  };

  const celdas = [];
  for (let i = 0; i < primerDiaDelMes; i++) celdas.push(null);
  for (let i = 1; i <= diasEnMes; i++) celdas.push(i);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={anteriorMes} className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-lg font-bold text-gray-800">{MESES[mes]} {anio}</h2>
        <button onClick={siguienteMes} className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 mb-2">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Celdas */}
      <div className="grid grid-cols-7 gap-1">
        {celdas.map((dia, idx) => {
          if (!dia) return <div key={`empty-${idx}`} />;

          const pasado = esPasado(dia);
          const bloqueado = esBloqueadoDia(dia);
          const disponible = estaDisponible(dia);
          const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();

          return (
            <div key={dia} className="relative group">
              <button
                onClick={() => handleClickDia(dia)}
                disabled={pasado}
                className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all ${
                  pasado
                    ? "text-gray-200 cursor-not-allowed"
                    : bloqueado
                    ? "bg-red-50 text-red-400 border border-red-100"
                    : disponible
                    ? "bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100"
                    : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
                } ${esHoy && !pasado ? "ring-2 ring-pink-400" : ""}`}
              >
                <span>{dia}</span>
                {!pasado && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    bloqueado ? "bg-red-300" : disponible ? "bg-pink-400" : "bg-gray-300"
                  }`} />
                )}
              </button>

              {/* Botón bloquear/desbloquear en hover */}
              {!pasado && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    bloqueado ? desbloquearDia(dia) : bloquearDia(dia);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center hidden group-hover:flex transition"
                  title={bloqueado ? "Habilitar día" : "Bloquear día"}
                >
                  {bloqueado
                    ? <Unlock size={10} className="text-green-500" />
                    : <Lock size={10} className="text-red-400" />
                  }
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-pink-400" /> Disponible
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-red-300" /> Bloqueado
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-full bg-gray-300" /> No laboral
        </div>
      </div>

      {/* Modal horarios del día */}
      {diaSeleccionado && (
        <HorariosDelDia
          fecha={diaSeleccionado}
          onCerrar={() => setDiaSeleccionado(null)}
          onActualizar={() => { onActualizar(); setDiaSeleccionado(null); }}
        />
      )}
    </div>
  );
};

export default CalendarioAdmin;