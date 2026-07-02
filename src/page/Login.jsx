// src/page/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext.jsx";

// ── Íconos ────────────────────────────────────────────────────────────────────

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

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

const useFbSdk = (appId) => {
  useEffect(() => {
    if (!appId || window.FB) return;
    window.fbAsyncInit = () => {
      window.FB.init({ appId, cookie: true, xfbml: false, version: "v19.0" });
    };
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/es_LA/sdk.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [appId]);
};

const useAppleSdk = (serviceId) => {
  useEffect(() => {
    if (!serviceId || window.AppleID) return;
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => {
      window.AppleID?.auth.init({
        clientId: serviceId,
        scope: "name email",
        redirectURI: window.location.origin,
        usePopup: true,
      });
    };
    document.body.appendChild(script);
  }, [serviceId]);
};

// ── Componente ────────────────────────────────────────────────────────────────

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const fbAppId = import.meta.env.VITE_FACEBOOK_APP_ID || "";
  const appleServiceId = import.meta.env.VITE_APPLE_SERVICE_ID || "";

  useFbSdk(fbAppId);
  useAppleSdk(appleServiceId);

  // ── Login manual ─────────────────────────────────────────────────────────────

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
      if (!res.ok) {
        setError(data.msg || "Credenciales incorrectas");
        setForm((f) => ({ ...f, password: "" }));
        return;
      }
      login(data.usuario, data.token);
      if (data.usuario.rol === "ADMIN_ROLE") navigate("/configuracion");
      else navigate("/");
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  // ── OAuth común ───────────────────────────────────────────────────────────────

  const loginConBackend = async (endpoint, body) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Error al iniciar sesión");
    login(data.usuario, data.token);
    if (data.usuario.rol === "ADMIN_ROLE") navigate("/configuracion");
    else navigate("/");
  };

  // ── Google ────────────────────────────────────────────────────────────────────

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setCargando(true);
      setError(null);
      try {
        await loginConBackend("/auth/google", { accessToken: tokenResponse.access_token });
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    },
    onError: () => setError("No se pudo conectar con Google"),
  });

  // ── Facebook ──────────────────────────────────────────────────────────────────

  const handleFacebook = () => {
    if (!fbAppId) { setError("Facebook no está configurado aún"); return; }
    if (!window.FB) { setError("SDK de Facebook no cargó, reintentá"); return; }
    setError(null);
    window.FB.login(async (response) => {
      if (response.authResponse) {
        setCargando(true);
        try {
          await loginConBackend("/auth/facebook", { accessToken: response.authResponse.accessToken });
        } catch (err) {
          setError(err.message);
        } finally {
          setCargando(false);
        }
      } else {
        setError("Login con Facebook cancelado");
      }
    }, { scope: "email,public_profile" });
  };

  // ── Apple ─────────────────────────────────────────────────────────────────────

  const handleApple = async () => {
    if (!appleServiceId) { setError("Apple Sign In no está configurado aún"); return; }
    if (!window.AppleID) { setError("SDK de Apple no cargó, reintentá"); return; }
    setError(null);
    setCargando(true);
    try {
      const response = await window.AppleID.auth.signIn();
      const { id_token } = response.authorization;
      const firstName = response.user?.name?.firstName || "";
      const lastName = response.user?.name?.lastName || "";
      const email = response.user?.email || "";
      await loginConBackend("/auth/apple", { idToken: id_token, firstName, lastName, email });
    } catch (err) {
      if (err?.error !== "popup_closed_by_user") {
        setError(err?.message || "No se pudo iniciar sesión con Apple");
      }
    } finally {
      setCargando(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">

      {/* Botón volver */}
      <div className="px-10 pt-8 md:px-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver
        </button>
      </div>

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
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
                Dirección de email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="cliente@ejemplo.com"
                required
                autoComplete="email"
                className="w-full bg-transparent border-b border-white/20 text-white placeholder:text-white/25 py-2.5 text-sm outline-none focus:border-white/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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
            </div>

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

          {/* ── Separador OAuth ── */}
          <div className="max-w-sm mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] tracking-[0.15em] uppercase text-white/25 whitespace-nowrap">
              o continuar con
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ── Botones OAuth ── */}
          <div className="max-w-sm mt-5 grid grid-cols-3 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={() => { setError(null); handleGoogle(); }}
              disabled={cargando}
              className="flex items-center justify-center gap-2 border border-white/15 py-3 text-[10px] tracking-[0.1em] uppercase text-white/50 hover:border-white/35 hover:text-white/80 hover:bg-white/5 transition-all disabled:opacity-30"
              title="Continuar con Google"
            >
              <GoogleIcon />
              <span className="hidden sm:inline">Google</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={handleFacebook}
              disabled={cargando}
              className="flex items-center justify-center gap-2 border border-white/15 py-3 text-[10px] tracking-[0.1em] uppercase text-white/50 hover:border-white/35 hover:text-white/80 hover:bg-white/5 transition-all disabled:opacity-30"
              title="Continuar con Facebook"
            >
              <FacebookIcon />
              <span className="hidden sm:inline">Facebook</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={handleApple}
              disabled={cargando}
              className="flex items-center justify-center gap-2 border border-white/15 py-3 text-[10px] tracking-[0.1em] uppercase text-white/50 hover:border-white/35 hover:text-white/80 hover:bg-white/5 transition-all disabled:opacity-30"
              title="Continuar con Apple"
            >
              <AppleIcon />
              <span className="hidden sm:inline">Apple</span>
            </button>
          </div>
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
