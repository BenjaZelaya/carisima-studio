// src/components/Navbar/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Menu, X, Settings2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState } from "react";
import logo from "../../assets/logo-carissima.png";

export default function Navbar() {
  const { estaLogueado, usuario, logout, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
      
      <nav className="w-full px-8 sm:px-14 py-5 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Carissima Studio" className="h-10 sm:h-11 invert" />
        </Link>

        {/* LINKS - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/">Principal</NavLink>
          <NavLink to="/reservar">Reservar</NavLink>
          <NavLink to="/servicios">Servicios</NavLink>
        </div>

        {/* Acciones - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {estaLogueado ? (
            <>
              <Link to="/configuracion">
                <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-200">
                  <UserCircle size={16} className="text-white/50" />
                  <span>{usuario?.nombre || "Perfil"}</span>
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-medium rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all duration-200"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="px-6 py-2.5 text-sm font-medium rounded-full border border-white text-white hover:bg-white hover:text-black transition-all duration-200 tracking-wide">
                Ingresar
              </button>
            </Link>
          )}
        </div>

        {/* BOTÓN MOBILE */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden p-2 text-white/70 hover:text-white transition"
        >
          <Menu size={26} />
        </button>
      </nav>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* DRAWER MOBILE */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-[#0f0f0f] border-r border-white/10 z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <img src={logo} alt="logo" className="h-9 invert" />
          <button onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* LINKS */}
        <div className="flex flex-col px-4 py-6 gap-1">
          <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>Principal</MobileNavLink>
          <MobileNavLink to="/reservar" onClick={() => setMenuOpen(false)}>Reservar</MobileNavLink>
          <MobileNavLink to="/servicios" onClick={() => setMenuOpen(false)}>Servicios</MobileNavLink>
        </div>

        <div className="h-px bg-white/10 mx-6 my-2" />

        {/* FOOTER */}
        <div className="mt-auto px-6 pb-8">
          {estaLogueado ? (
            <>
              <Link
                to="/configuracion"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition"
              >
                <UserCircle size={20} className="text-white/40" />
                {usuario?.nombre || "Mi Perfil"}
              </Link>
              <Link
                to="/configuracion?tab=turnos"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Mis Turnos
              </Link>
              {esAdmin && (
                <Link
                  to="/configuracion?tab=admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 mb-3 text-white/70 hover:text-white transition"
                >
                  <Settings2 size={20} className="text-white/40" />
                  Panel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full border border-white/20 text-white/70 py-3 rounded-xl font-medium hover:bg-white/5 hover:text-white transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="w-full border border-white text-white py-3.5 rounded-xl font-medium hover:bg-white hover:text-black transition">
                Ingresar
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/* LINK DESKTOP */
function NavLink({ children, to }) {
  return (
    <Link to={to}>
      <button className="px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white tracking-wide transition-colors duration-200 rounded-full hover:bg-white/5">
        {children}
      </button>
    </Link>
  );
}

/* LINK MOBILE */
function MobileNavLink({ children, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm tracking-wide"
    >
      {children}
    </Link>
  );
}
