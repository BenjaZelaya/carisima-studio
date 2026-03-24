// src/components/Navbar/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import logo from "../../assets/logo-carissima.png";

export default function Navbar() {
  const { estaLogueado, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full border-b border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.10)]">
      <nav className="relative w-full px-8 py-4 flex items-center">

        {/* LOGO - IZQUIERDA */}
        <div className="flex items-center">
          <img src={logo} alt="Carissima Studio" className="h-15" />
        </div>

        {/* LINKS - CENTRADOS */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-4">
          <Link to="/"><NavButton>Principal</NavButton></Link>
          <Link to="/reservar"><NavButton>Reservar</NavButton></Link>
          <Link to="/servicios"><NavButton>Servicios</NavButton></Link>
          <NavButton>Agenda</NavButton>
        </div>

        {/* DERECHA */}
        <div className="ml-auto flex items-center gap-3">
          {estaLogueado ? (
            <>
              {/* Mi perfil */}
              <Link to="/configuracion">
                <button className="flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-full border-2 bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 shadow-[0_6px_15px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:-translate-y-0.5">
                  <UserCircle size={18} className="text-pink-400" />
                  <span className="hidden sm:inline">{usuario?.nombre}</span>
                </button>
              </Link>

              {/* Cerrar sesión */}
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

      </nav>
    </header>
  );
}

/* Botón del navbar */
function NavButton({ children, primary }) {
  return (
    <button
      className={`
        px-8 py-3
        text-sm font-medium
        rounded-full
        border-2
        shadow-[0_6px_15px_rgba(0,0,0,0.12)]
        transition-all duration-300
        hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)]
        hover:-translate-y-0.5
        ${primary
          ? "bg-[#ff7bed] text-white border-[#ff7bed] hover:opacity-90"
          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
        }
      `}
    >
      {children}
    </button>
  );
}