import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Level1 from "./components/Level1";
import Level5 from "./components/Level5";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/level1" element={<Level1 />} />
        <Route path="/level5" element={<Level5/>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
