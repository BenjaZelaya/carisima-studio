// src/components/Configuracion/admin/AgendaAdmin.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import ConfigGeneral from "./Agenda/ConfigGeneral.jsx";
import CalendarioAdmin from "./Agenda/CalendarioAdmin.jsx";

const AgendaAdmin = () => {
  const { token } = useAuth();
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    setCargando(true);
    try {
      const hoy = new Date().toISOString().split("T")[0];
      const [resDisp, resBloqueos] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/horarios/disponibilidad?fecha=${hoy}`),
        fetch(`${import.meta.env.VITE_API_URL}/horarios/bloqueos`, { headers: { "x-token": token } }),
      ]);
      const dataDisp = await resDisp.json();
      const dataBloqueos = await resBloqueos.json();
      setDisponibilidad(dataDisp);
      setBloqueos(dataBloqueos);
    } catch {
      console.error("Error al cargar agenda");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    cargar();
  }, [token]);

  if (cargando) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ConfigGeneral onActualizar={cargar} />
        <CalendarioAdmin
          disponibilidad={disponibilidad}
          bloqueos={bloqueos}
          token={token}
          onActualizar={cargar}
        />
      </div>
    </div>
  );
};

export default AgendaAdmin;