// src/components/Configuracion/PanelAdmin.jsx
import { useState } from "react";
import { Package, Tag, Calendar, CalendarDays, Users } from "lucide-react";
import GestionProductos from "./admin/GestionProductos.jsx";
import GestionCategorias from "./admin/GestionCategorias.jsx";
import GestionTurnos from "./admin/GestionTurnos.jsx";
import AgendaAdmin from "./admin/AgendaAdmin.jsx";
import GestionUsuarios from "./admin/GestionUsuarios.jsx";

const TABS = [
  { id: "turnos",     label: "Turnos",      icon: Calendar },
  { id: "agenda",     label: "Agenda",      icon: CalendarDays },
  { id: "productos",  label: "Servicios",   icon: Package },
  { id: "categorias", label: "CategorÃ­as",  icon: Tag },
  { id: "usuarios",   label: "Usuarios",    icon: Users },
];

const PanelAdmin = () => {
  const [seccion, setSeccion] = useState("turnos");
  const currentTab = TABS.find((t) => t.id === seccion);

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a]">

      {/* Header */}
      <div className="border-b border-white/8 px-8 py-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">
            Admin / {currentTab?.label}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {currentTab?.label}
          </h1>
        </div>
      </div>

      {/* Tabs nav */}
      <div className="border-b border-white/8 px-8">
        <div className="flex gap-0 overflow-x-auto no-scrollbar">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSeccion(id)}
              className={`flex items-center gap-2 px-5 py-4 text-[10px] tracking-[0.15em] uppercase font-medium whitespace-nowrap border-b-2 transition-all ${
                seccion === id
                  ? "border-white text-white"
                  : "border-transparent text-white/30 hover:text-white/60"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8">
        {seccion === "turnos"     && <GestionTurnos />}
        {seccion === "agenda"     && <AgendaAdmin />}
        {seccion === "productos"  && <GestionProductos />}
        {seccion === "categorias" && <GestionCategorias />}
        {seccion === "usuarios"   && <GestionUsuarios />}
      </div>
    </div>
  );
};

export default PanelAdmin;
