// src/page/Registro.jsx
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

const Registro = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", password: "", telefono: "",
  });
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
      const resRegistro = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const dataRegistro = await resRegistro.json();
      if (!resRegistro.ok) {
        setError(dataRegistro.msg || dataRegistro.errors?.[0]?.msg || "Error al registrarse");
        return;
      }
      const resLogin = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const dataLogin = await resLogin.json();
      if (!resLogin.ok) { navigate("/login"); return; }
      login(dataLogin.usuario, dataLogin.token);
      navigate("/");
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

        {/* ── LEFT: Login teaser ── */}
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

          {/* Campos decorativos */}
          <div className="flex flex-col gap-6 max-w-sm opacity-40 pointer-events-none select-none mb-8">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Dirección de email</p>
              <div className="border-b border-white/20 py-2.5 text-sm text-white/20">cliente@ejemplo.com</div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Contraseña</p>
              <div className="border-b border-white/20 py-2.5 text-sm text-white/20">••••••••</div>
            </div>
          </div>

          <Link to="/login">
            <button className="w-full max-w-sm bg-white text-black py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors">
              Autenticar
            </button>
          </Link>
        </div>

        {/* ── RIGHT: Registro ── */}
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

          {error && (
            <p className="text-red-400 text-xs tracking-wide mb-6 border-l-2 border-red-400 pl-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-sm">
            <div className="flex gap-4">
              <InputField
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Julia"
                required
              />
              <InputField
                label="Apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Pérez"
                required
              />
            </div>

            <InputField
              label="Dirección de email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />

            <InputField
              label="Teléfono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+54 (000) 000-0000"
            />

            <InputField
              label="Contraseña deseada"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <p className="text-[10px] text-white/25 leading-relaxed">
              Al registrarte aceptás nuestros{" "}
              <span className="underline underline-offset-2 cursor-pointer hover:text-white/50 transition-colors">Términos de servicio</span>{" "}
              y{" "}
              <span className="underline underline-offset-2 cursor-pointer hover:text-white/50 transition-colors">Política de privacidad</span>.
            </p>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-white text-black py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white/90 transition-colors disabled:opacity-40"
            >
              {cargando ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
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

export default Registro;
