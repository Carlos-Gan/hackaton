import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mapa from "./pages/Mapa";
import PagoCamion from "./pages/PagoCamion";
import Inicio from "./pages/Inicio";

// App principal con las rutas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/pagar" element={<PagoCamion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;