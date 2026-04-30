// src/components/Configuracion/PanelAdmin.jsx
import { useState } from "react";
import { Package, Tag, Calendar, CalendarDays, Users } from "lucide-react";
import GestionProductos from "./admin/GestionProductos.jsx";
import GestionCategorias from "./admin/GestionCategorias.jsx";
import GestionTurnos from "./admin/GestionTurnos.jsx";
import AgendaAdmin from "./admin/AgendaAdmin.jsx";
import GestionUsuarios from "./admin/GestionUsuarios.jsx";

const TABS = [
  { id: "turnos", label: "Turnos", icon: Calendar },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "productos", label: "Productos", icon: Package },
  { id: "categorias", label: "Categorías", icon: Tag },
  { id: "usuarios", label: "Usuarios", icon: Users },
];

const PanelAdmin = () => {
  const [seccion, setSeccion] = useState("turnos");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Panel Admin</h1>
      <p className="text-gray-400 text-sm mb-6">Gestioná turnos, productos, categorías y agenda</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSeccion(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              seccion === id
                ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {seccion === "turnos" && <GestionTurnos />}
      {seccion === "agenda" && <AgendaAdmin />}
      {seccion === "productos" && <GestionProductos />}
      {seccion === "categorias" && <GestionCategorias />}
      {seccion === "usuarios" && <GestionUsuarios />}
    </div>
  );
};

export default PanelAdmin;