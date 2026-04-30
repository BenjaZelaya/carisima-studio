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
      await fetch(`${import.meta.env.VITE_API_URL}/horarios/bloqueos`, {
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
      await fetch(`${import.meta.env.VITE_API_URL}/horarios/bloqueos/${bloqueo._id}`, {
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
    <div className="bg-[#111111] border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={anteriorMes} className="p-2 hover:bg-white/8 transition text-white/40">
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-sm font-medium text-white tracking-wide">{MESES[mes]} {anio}</h2>
        <button onClick={siguienteMes} className="p-2 hover:bg-white/8 transition text-white/40">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 mb-2">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center text-[10px] tracking-widest uppercase text-white/25 py-1">{d}</div>
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
                className={`w-full aspect-square flex flex-col items-center justify-center text-xs font-medium transition-all ${
                  pasado
                    ? "text-white/10 cursor-not-allowed"
                    : bloqueado
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : disponible
                    ? "bg-white/8 text-white border border-white/20 hover:bg-white/15"
                    : "bg-transparent text-white/30 border border-white/8 hover:bg-white/5"
                } ${esHoy && !pasado ? "ring-1 ring-white/50" : ""}`}
              >
                <span>{dia}</span>
                {!pasado && (
                  <span className={`w-1 h-1 rounded-full mt-0.5 ${
                    bloqueado ? "bg-red-400" : disponible ? "bg-white/60" : "bg-white/15"
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
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#111111] border border-white/20 items-center justify-center hidden group-hover:flex transition"
                  title={bloqueado ? "Habilitar día" : "Bloquear día"}
                >
                  {bloqueado
                    ? <Unlock size={9} className="text-white/60" />
                    : <Lock size={9} className="text-red-400" />
                  }
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-white/8">
        <div className="flex items-center gap-1.5 text-[10px] text-white/30">
          <span className="w-2.5 h-2.5 rounded-full bg-white/50" /> Disponible
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/30">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Bloqueado
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/30">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" /> No laboral
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