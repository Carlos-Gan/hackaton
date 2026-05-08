import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mapa from "./pages/Mapa";
import PagoCamion from "./pages/PagoCamion";
import Inicio from "./pages/Inicio";
import Empleado from "./pages/Empeado";
import InicioSesion from "./pages/InicioSesion";
import { RutaPrivada } from "./componentes/RutaPrivada";

// App principal con las rutas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/pagar" element={<PagoCamion />} />
        <Route path="/login" element={<InicioSesion />} />
        <Route path="/empleado" element={
          <RutaPrivada>
            <Empleado />
          </RutaPrivada>
        } />
      </Routes>
    </BrowserRouter>
  );
}
export default App;