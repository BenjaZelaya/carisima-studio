// src/page/SeleccionHorario.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarioSemanal from "../components/SeleccionHorario/CalendarioSemanal.jsx";
import ListaHorarios from "../components/SeleccionHorario/ListaHorarios.jsx";
import ResumenServicio from "../components/SeleccionHorario/ResumenServicio.jsx";

const SeleccionHorario = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibe los servicios seleccionados desde Reservar
  const servicios = location.state?.servicios || [];

  const [disponibilidad, setDisponibilidad] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [cargando, setCargando] = useState(true);

  // ─── Cargar disponibilidad ──────────────────────────────────────────────────

  useEffect(() => {
    if (servicios.length === 0) {
      navigate("/reservar");
      return;
    }

    const cargar = async () => {
      try {
        const hoy = new Date().toISOString().split("T")[0];
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/horarios/disponibilidad?fecha=${hoy}`
        );
        const data = await res.json();
        setDisponibilidad(data);

        // Selecciona el primer día disponible automáticamente
        const primerDia = data.find((d) => d.disponible);
        if (primerDia) setFechaSeleccionada(primerDia.fecha);
      } catch {
        console.error("Error al cargar disponibilidad");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleFecha = (fecha) => {
    setFechaSeleccionada(fecha);
    setHorarioSeleccionado(null);
  };

  const handleContinuar = () => {
    // Aquí irá el flujo de pago
    navigate("/pago", {
      state: {
        servicios,
        fecha: fechaSeleccionada,
        horario: horarioSeleccionado,
      },
    });
  };

  const turnosDelDia = disponibilidad.find((d) => d.fecha === fechaSeleccionada)?.turnos || [];

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (servicios.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/reservar")}
            className="text-white/30 hover:text-white transition-colors text-xl"
          >
            ←
          </button>
          <div>
            <h1 className="font-serif text-3xl font-light text-white">Elegí tu turno</h1>
            <p className="text-white/30 text-xs mt-1 tracking-wide">Seleccioná el día y horario que más te convenga</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Calendario + Horarios */}
          <div className="flex-1 bg-[#111111] border border-white/10 p-6">
            <CalendarioSemanal
              disponibilidad={disponibilidad}
              fechaSeleccionada={fechaSeleccionada}
              onSeleccionar={handleFecha}
              semanaOffset={semanaOffset}
              onSemana={setSemanaOffset}
            />
            <ListaHorarios
              turnos={turnosDelDia}
              horarioSeleccionado={horarioSeleccionado}
              onSeleccionar={setHorarioSeleccionado}
            />
          </div>

          {/* Resumen */}
          <div className="w-full lg:w-80">
            <ResumenServicio
              servicios={servicios}
              fechaSeleccionada={fechaSeleccionada}
              horarioSeleccionado={horarioSeleccionado}
              onContinuar={handleContinuar}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SeleccionHorario;