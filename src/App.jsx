// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes / páginas
import Navbar from './components/Navbar/Navbar.jsx';     
import Hero from './page/Hero.jsx';           
import Reservar from './page/Reservar.jsx';  
           

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black flex flex-col">
        {/* Navbar siempre visible en todas las páginas */}
        <Navbar />

        {/* Contenido principal con rutas */}
        <main className="flex-grow">
          <Routes>
            {/* Ruta principal → Hero (Home) */}
            <Route path="/" element={<Hero />} />


            {/* Ruta de reservas */}
            <Route path="/reservar" element={<Reservar />} />

            {/* Ruta 404 (opcional, pero recomendado) */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-4xl font-bold">404 - Página no encontrada</h1>
              </div>
            } />
          </Routes>
        </main>

        {/* Podrías poner un Footer aquí más adelante */}
      </div>
    </BrowserRouter>
  );
}

export default App;