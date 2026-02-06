import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";


function App() {
  return (
    <>
    <div>
      <Navbar />
    </div>
    <div className="min-h-screen bg-white text-black flex items-center justify-center ">
      <div className="text-center space-y-4">
        <Hero />
      </div>
    </div>
    </>
  );
}

export default App;

