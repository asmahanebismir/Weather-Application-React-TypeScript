import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Delopgave1 from "./components/Delopgave1";
import Delopgave2 from "./components/Delopgave2";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Delopgave 1</Link>
        {" | "}
        <Link to="/delopgave2">Delopgave 2</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Delopgave1 />} />
        <Route path="/delopgave2" element={<Delopgave2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
