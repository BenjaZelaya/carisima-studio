// src/page/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/25 py-2.5 text-sm outline-none focus:border-white/60 transition-colors"
    />
  </div>
);

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Error al iniciar sesión"); return; }
      login(data.usuario, data.token);
      if (data.usuario.rol === "ADMIN_ROLE") navigate("/configuracion");
      else navigate("/");
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">

      {/* Split */}
      <div className="flex-1 flex flex-col md:flex-row">

        {/* ── LEFT: Login ── */}
        <div className="flex-1 flex flex-col justify-center px-10 py-16 md:px-16 lg:px-24 bg-[#0a0a0a] border-r border-white/8">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/35 mb-4">
            Cliente registrado
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            BIENVENIDA
          </h1>
          <p className="text-sm text-white/40 mb-10 max-w-xs leading-relaxed">
            Accedé a tu perfil personalizado y tus próximos turnos en el estudio.
          </p>

          {error && (
            <p className="text-red-400 text-xs tracking-wide mb-6 border-l-2 border-red-400 pl-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-sm">
            <InputField
              label="Dirección de email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="cliente@ejemplo.com"
              required
            />
            <InputField
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-end">
              <span className="text-[10px] tracking-[0.15em] uppercase text-white/30 hover:text-white/60 cursor-pointer transition-colors">
                ¿Olvidaste tu contraseña?
              </span>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-white text-black py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors disabled:opacity-40 mt-2"
            >
              {cargando ? "Ingresando..." : "Autenticar"}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Registro teaser ── */}
        <div className="flex-1 flex flex-col justify-center px-10 py-16 md:px-16 lg:px-24 bg-[#111111]">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/35 mb-4">
            Nueva cliente
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            NUEVA CLIENTE
          </h1>
          <p className="text-sm text-white/40 mb-10 max-w-xs leading-relaxed">
            Unite al círculo Carissima para una experiencia exclusiva en cuidado de alto nivel.
          </p>

          {/* Campos decorativos */}
          <div className="flex flex-col gap-6 max-w-sm opacity-40 pointer-events-none select-none mb-8">
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Nombre</p>
                <div className="border-b border-white/20 py-2.5 text-sm text-white/20">Nombre</div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Apellido</p>
                <div className="border-b border-white/20 py-2.5 text-sm text-white/20">Apellido</div>
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Email</p>
              <div className="border-b border-white/20 py-2.5 text-sm text-white/20">correo@ejemplo.com</div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Teléfono</p>
              <div className="border-b border-white/20 py-2.5 text-sm text-white/20">+54 (000) 000-0000</div>
            </div>
          </div>

          <Link to="/registro">
            <button className="w-full max-w-sm bg-white text-black py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors">
              Crear cuenta
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/8 px-10 py-5 flex items-center justify-between">
        <div className="flex gap-6 text-[10px] tracking-[0.15em] uppercase text-white/25">
          <span className="hover:text-white/50 cursor-pointer transition-colors">Privacidad</span>
          <span className="hover:text-white/50 cursor-pointer transition-colors">Términos</span>
        </div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-white/20">
          © 2025 Carissima Studio
        </p>
      </div>
    </div>
  );
};

export default Login;
