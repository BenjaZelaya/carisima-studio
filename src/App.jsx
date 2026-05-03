// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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
import PagoResultado from './page/PagoResultado.jsx';
import PagoPack from './page/PagoPack.jsx';
import PagoPackResultado from './page/PagoPackResultado.jsx';

// --- Rutas protegidas ---

const RutaPrivada = ({ children }) => {
  const { estaLogueado, cargando } = useAuth();
  if (cargando) return null;
  if (!estaLogueado) return <Navigate to="/login" />;
  return children;
};

// --- Inner app (necesita BrowserRouter para useLocation) ---

function AppInner() {
  const location = useLocation();
  const hideNavbar = ["/login", "/registro"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/pago/resultado" element={<PagoResultado />} />

          <Route path="/reservar" element={<RutaPrivada><Reservar /></RutaPrivada>} />
          <Route path="/horario" element={<RutaPrivada><SeleccionHorario /></RutaPrivada>} />
          <Route path="/pago" element={<RutaPrivada><Pago /></RutaPrivada>} />
          <Route path="/configuracion" element={<RutaPrivada><Configuracion /></RutaPrivada>} />
          <Route path="/pago-pack/resultado" element={<PagoPackResultado />} />
          <Route path="/pago-pack/:packId" element={<RutaPrivada><PagoPack /></RutaPrivada>} />

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-4xl font-bold">404 - Pagina no encontrada</h1>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

// --- App ---

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
