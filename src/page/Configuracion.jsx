// src/page/Configuracion.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Calendar, Settings, LogOut } from "lucide-react";
import MiPerfil from "../components/Configuracion/MiPerfil.jsx";
import MisTurnos from "../components/Configuracion/MisTurnos.jsx";
import PanelAdmin from "../components/Configuracion/PanelAdmin.jsx";

const tabs = [
  { id: "perfil", label: "Mi Perfil", icon: User },
  { id: "turnos", label: "Mis Turnos", icon: Calendar },
];

const Configuracion = () => {
  const { usuario, logout, esAdmin } = useAuth();
  const [tabActivo, setTabActivo] = useState("perfil");

  const tabsVisibles = esAdmin
    ? [...tabs, { id: "admin", label: "Panel Admin", icon: Settings }]
    : tabs;

  const renderContenido = () => {
    switch (tabActivo) {
      case "perfil": return <MiPerfil />;
      case "turnos": return <MisTurnos />;
      case "admin": return <PanelAdmin />;
      default: return <MiPerfil />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col">

        {/* Avatar y nombre */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-lg">
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{usuario?.nombre} {usuario?.apellido}</p>
              <p className="text-xs text-gray-400 truncate max-w-[120px]">{usuario?.email}</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1">
          {tabsVisibles.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTabActivo(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                tabActivo === id
                  ? id === "admin"
                    ? "bg-pink-500 text-white shadow-md shadow-pink-200"
                    : "bg-pink-50 text-pink-500"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Cerrar sesión */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContenido()}
      </main>

    </div>
  );
};

export default Configuracion;