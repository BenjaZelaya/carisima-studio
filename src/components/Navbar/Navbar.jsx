// src/components/Navbar/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { UserCircle, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState } from "react";
import logo from "../../assets/logo-carissima.png";

export default function Navbar() {
  const { estaLogueado, usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.08)] sticky top-0 z-50">
      
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Carissima Studio" className="h-11 sm:h-12" />
        </Link>

        {/* LINKS - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <NavButton to="/">Principal</NavButton>
          <NavButton to="/reservar">Reservar</NavButton>
          <NavButton to="/servicios">Servicios</NavButton>
          <NavButton to="/agenda">Agenda</NavButton>
        </div>

        {/* Acciones - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {estaLogueado ? (
            <>
              <Link to="/configuracion">
                <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-full border-2 bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 shadow-[0_6px_15px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5">
                  <UserCircle size={18} className="text-pink-400" />
                  <span className="hidden sm:inline">{usuario?.nombre || "Perfil"}</span>
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="px-5 py-3 text-sm font-medium rounded-full border-2 bg-[#ff7bed] text-white border-[#ff7bed] hover:opacity-90 shadow-[0_6px_15px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login">
              <NavButton primary>Ingresar</NavButton>
            </Link>
          )}
        </div>

        {/* BOTÓN MOBILE */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden p-3 text-gray-600 hover:text-pink-600 transition-all"
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* DRAWER MOBILE */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <img src={logo} alt="logo" className="h-10" />
          <button onClick={() => setMenuOpen(false)}>
            <X size={26} />
          </button>
        </div>

        {/* LINKS */}
        <div className="flex flex-col px-6 py-6 gap-4 text-gray-700">
          <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>Principal</MobileNavLink>
          <MobileNavLink to="/reservar" onClick={() => setMenuOpen(false)}>Reservar</MobileNavLink>
          <MobileNavLink to="/servicios" onClick={() => setMenuOpen(false)}>Servicios</MobileNavLink>
          <MobileNavLink to="/agenda" onClick={() => setMenuOpen(false)}>Agenda</MobileNavLink>
        </div>

        <div className="h-px bg-gray-100 mx-6 my-2" />

        {/* FOOTER (LOGIN / PERFIL) */}
        <div className="mt-auto px-6 pb-6">
          {estaLogueado ? (
            <>
              <Link
                to="/configuracion"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-100 mb-3"
              >
                <UserCircle size={22} className="text-pink-400" />
                {usuario?.nombre || "Mi Perfil"}
              </Link>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <button className="w-full bg-[#ff7bed] text-white py-3.5 rounded-2xl font-medium shadow-md hover:opacity-90 transition">
                Ingresar
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/* BOTÓN DESKTOP */
function NavButton({ children, primary, to }) {
  return (
    <Link to={to}>
      <button
        className={`
          px-8 py-3 text-sm font-medium rounded-full border-2 shadow-[0_6px_15px_rgba(0,0,0,0.12)]
          transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5
          ${
            primary
              ? "bg-[#ff7bed] text-white border-[#ff7bed] hover:opacity-90"
              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
          }
        `}
      >
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
      className="block px-4 py-3 rounded-2xl hover:bg-gray-100 transition"
    >
      {children}
    </Link>
  );
}