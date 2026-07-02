// src/page/Registro.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

const Registro = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", password: "", confirmarPassword: "", telefono: "",
  });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      const { confirmarPassword, ...datosRegistro } = form;
      const resRegistro = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosRegistro),
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
              <div className="flex-1">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Nombre</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Julia"
                  required
                  autoComplete="given-name"
                  className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/25 py-2.5 text-sm outline-none focus:border-white/60 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Apellido</label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required
                  autoComplete="family-name"
                  className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/25 py-2.5 text-sm outline-none focus:border-white/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Dirección de email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
                autoComplete="email"
                className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/25 py-2.5 text-sm outline-none focus:border-white/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Teléfono</label>
              <input
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+54 (000) 000-0000"
                required
                autoComplete="tel"
                className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/25 py-2.5 text-sm outline-none focus:border-white/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Contraseña deseada</label>
              <div className="relative">
                <input
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/25 py-2.5 text-sm outline-none focus:border-white/60 transition-colors pr-8"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={mostrarPassword} />
                </button>
              </div>
              <p className="text-[10px] text-white/20 mt-1.5">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Confirmar contraseña</label>
              <div className="relative">
                <input
                  name="confirmarPassword"
                  type={mostrarConfirmar ? "text" : "password"}
                  value={form.confirmarPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/25 py-2.5 text-sm outline-none focus:border-white/60 transition-colors pr-8"
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={mostrarConfirmar} />
                </button>
              </div>
            </div>

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
