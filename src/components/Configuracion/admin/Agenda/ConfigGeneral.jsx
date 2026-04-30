// src/components/Configuracion/admin/agenda/ConfigGeneral.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { Settings } from "lucide-react";

const DIAS = [
  { num: 2, label: "Lun" },
  { num: 3, label: "Mar" },
  { num: 4, label: "Mié" },
  { num: 5, label: "Jue" },
  { num: 6, label: "Vie" },
  { num: 7, label: "Sáb" },
  { num: 1, label: "Dom" },
];

const ConfigGeneral = ({ onActualizar }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    horaInicio: "09:00",
    horaFin: "18:00",
    duracionTurno: 60,
    diasLaborales: [1, 2, 3, 4, 5],
    capacidadPorTurno: 1,
  });
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/horarios/config`);
        const data = await res.json();
        setForm({
          horaInicio: data.horaInicio || "09:00",
          horaFin: data.horaFin || "18:00",
          duracionTurno: data.duracionTurno || 60,
          diasLaborales: data.diasLaborales || [1, 2, 3, 4, 5],
          capacidadPorTurno: data.capacidadPorTurno || 1,
        });
      } catch {
        setError("Error al cargar configuración");
      }
    };
    cargar();
  }, []);

  const toggleDia = (num) => {
    setForm((prev) => ({
      ...prev,
      diasLaborales: prev.diasLaborales.includes(num)
        ? prev.diasLaborales.filter((d) => d !== num)
        : [...prev.diasLaborales, num].sort(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/horarios/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-token": token },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al guardar"); return; }
      setExito("Configuración guardada");
      onActualizar?.();
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-[#111111] border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Settings size={16} className="text-white/40" />
        <h2 className="text-sm font-medium tracking-wide text-white">Configuración general</h2>
      </div>

      {error && <div className="border border-red-500/20 text-red-400 px-4 py-3 mb-4 text-xs">{error}</div>}
      {exito && <div className="border border-white/10 bg-white/5 text-white/60 px-4 py-3 mb-4 text-xs">{exito}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Días laborales */}
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-3">Días laborales por defecto</label>
          <div className="flex gap-2 flex-wrap">
            {DIAS.map(({ num, label }) => (
              <button
                key={num}
                type="button"
                onClick={() => toggleDia(num)}
                className={`px-3 py-2 text-xs tracking-widest uppercase transition ${
                  form.diasLaborales.includes(num)
                    ? "bg-white text-black"
                    : "border border-white/15 text-white/40 hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2">Hora inicio</label>
            <input type="time" value={form.horaInicio}
              onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
              className="w-full bg-transparent border border-white/15 p-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2">Hora fin</label>
            <input type="time" value={form.horaFin}
              onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
              className="w-full bg-transparent border border-white/15 p-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2">Duración del turno (minutos)</label>
          <select value={form.duracionTurno}
            onChange={(e) => setForm({ ...form, duracionTurno: Number(e.target.value) })}
            className="w-full bg-[#111111] border border-white/15 p-2.5 text-sm text-white/70 focus:outline-none focus:border-white/40 transition">
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>1 hora</option>
            <option value={90}>1 hora 30 minutos</option>
            <option value={120}>2 horas</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-white/35 mb-2">Personas por turno (capacidad)</label>
          <input
            type="number"
            min={1}
            max={20}
            value={form.capacidadPorTurno}
            onChange={(e) => setForm({ ...form, capacidadPorTurno: Number(e.target.value) })}
            className="w-full bg-transparent border border-white/15 p-2.5 text-sm text-white/70 focus:outline-none focus:border-white/40 transition"
          />
          <p className="text-[10px] text-white/25 mt-1">Cuántas personas pueden reservar el mismo horario</p>
        </div>

        <button type="submit" disabled={cargando}
          className="w-full bg-white text-black hover:bg-white/90 py-3 text-[11px] font-semibold tracking-[0.2em] uppercase transition disabled:opacity-40 mt-2">
          {cargando ? "Guardando..." : "Guardar configuración"}
        </button>
      </form>
    </div>
  );
};

export default ConfigGeneral;