// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Contexto
import { useAuth } from './context/AuthContext.jsx';

// Componentes / páginas
import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './page/Hero.jsx';
import Servicios from './page/Servicios.jsx';
import Reservar from './page/Reservar.jsx';
import SeleccionHorario from './page/SeleccionHorario.jsx';
import Pago from './page/Pago.jsx';
import Configuracion from './page/Configuracion.jsx';
import Login from './page/Login.jsx';
import Registro from './page/Registro.jsx';

// ─── Rutas protegidas ────────────────────────────────────────────────────────

const RutaPrivada = ({ children }) => {
  const { estaLogueado, cargando } = useAuth();
  if (cargando) return null;
  if (!estaLogueado) return <Navigate to="/login" />;
  return children;
};

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/servicios" element={<Servicios />} />

            {/* Privadas - usuario logueado */}
            <Route path="/reservar" element={
              <RutaPrivada>
                <Reservar />
              </RutaPrivada>
            } />

            <Route path="/horario" element={
              <RutaPrivada>
                <SeleccionHorario />
              </RutaPrivada>
            } />

            <Route path="/pago" element={
              <RutaPrivada>
                <Pago />
              </RutaPrivada>
            } />

            <Route path="/configuracion" element={
              <RutaPrivada>
                <Configuracion />
              </RutaPrivada>
            } />

            {/* 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-4xl font-bold">404 - Página no encontrada</h1>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;