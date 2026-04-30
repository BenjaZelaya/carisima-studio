// src/page/Configuracion.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Calendar, Settings2, LogOut, Menu, X, ShoppingBag } from "lucide-react";
import MiPerfil from "../components/Configuracion/MiPerfil.jsx";
import MisTurnos from "../components/Configuracion/MisTurnos.jsx";
import MisPacks from "../components/Configuracion/MisPacks.jsx";
import PanelAdmin from "../components/Configuracion/PanelAdmin.jsx";

const TABS_USER = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "turnos", label: "Mis Turnos", icon: Calendar },
  { id: "packs", label: "Mis Packs", icon: ShoppingBag },
];

const TABS_ADMIN = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "turnos", label: "Mis Turnos", icon: Calendar },
  { id: "packs", label: "Mis Packs", icon: ShoppingBag },
  { id: "admin", label: "Panel Admin", icon: Settings2 },
];

const Configuracion = () => {
  const { usuario, logout, esAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabActivo, setTabActivo] = useState(() => searchParams.get("tab") || "perfil");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tabs = esAdmin ? TABS_ADMIN : TABS_USER;

  const handleTabChange = (tabId) => {
    setTabActivo(tabId);
    setSearchParams({ tab: tabId });
    setDrawerOpen(false);
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== tabActivo) setTabActivo(tabParam);
  }, [searchParams]);

  const renderContenido = () => {
    switch (tabActivo) {
      case "perfil":  return <MiPerfil />;
      case "turnos":  return <MisTurnos />;
      case "packs":   return <MisPacks />;
      case "admin":   return <PanelAdmin />;
      default:        return <MiPerfil />;
    }
  };

  const initial = usuario?.nombre?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">

      {/* â•â•â• SIDEBAR DESKTOP â•â•â• */}
      <aside className="hidden md:flex w-52 min-h-screen bg-[#111111] border-r border-white/8 flex-col shrink-0">

        {/* Brand */}
        <div className="px-6 py-7 border-b border-white/8">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-white">
            Carissima
          </p>
          <p className="text-[9px] tracking-[0.15em] uppercase text-white/30 mt-0.5">
            Studio Management
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium transition-all ${
                tabActivo === id
                  ? "bg-white text-black"
                  : "text-white/45 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/8 flex flex-col gap-1">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-white/70 truncate">
                {usuario?.nombre} {usuario?.apellido}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium text-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </aside>

      {/* â•â•â• MOBILE HEADER â•â•â• */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#111111] border-b border-white/8 flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">Carissima</p>
          <p className="text-[9px] tracking-[0.12em] uppercase text-white/30">Studio</p>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="text-white/60 hover:text-white transition">
          <Menu size={22} />
        </button>
      </div>

      {/* â•â•â• MOBILE DRAWER â•â•â• */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <aside className="relative z-10 w-56 bg-[#111111] border-r border-white/8 flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">Carissima</p>
              <button onClick={() => setDrawerOpen(false)} className="text-white/50 hover:text-white transition">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium transition-all ${
                    tabActivo === id
                      ? "bg-white text-black"
                      : "text-white/45 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-white/8">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium text-white/30 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogOut size={14} />
                Salir
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* â•â•â• CONTENIDO â•â•â• */}
      <main className="flex-1 md:pt-0 pt-16 min-w-0">
        {renderContenido()}
      </main>

    </div>
  );
};

export default Configuracion;
