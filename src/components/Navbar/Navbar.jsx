import { Link } from "react-router-dom";
import logo from "../../assets/logo-carissima.png";

export default function Navbar() {
    return (
        <header className="w-full border-b border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.10)]">
            <nav className="relative w-full px-8 py-4 flex items-center">

                {/* LOGO - IZQUIERDA */}
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="Carrissima Studio"
                        className="h-15"
                    />
                </div>

                {/* LINKS - CENTRADOS */}
                <div className="absolute left-1/2 -translate-x-1/2 flex gap-4">
                    <Link to="/"><NavButton>Principal</NavButton></Link>
                    <Link to="/reservar"><NavButton>Reservar</NavButton></Link>
                    <NavButton>Servicios</NavButton>
                    <NavButton>Agenda</NavButton>
                </div>

                {/* INGRESAR - DERECHA */}
                <div className="ml-auto">
                    <NavButton primary>Ingresar</NavButton>
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
                bg-[#F5F0FA]
                text-[#4B2E83]
                border-2 border-[#E6DFF2]
                shadow-[0_6px_15px_rgba(0,0,0,0.12)]
                transition-all duration-300
                hover:shadow-[0_10px_25px_rgba(0,0,0,0.18)]
                hover:-translate-y-0.5
                ${primary
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
            `}
        >
            {children}
        </button>
    );
}
