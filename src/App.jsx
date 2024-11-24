import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Level1 from "./components/Level1";
import Level2 from "./components/Level2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/level1" element={<Level1 />} />
        <Route path="/level2" element={<Level2 />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
  
}


export default App;
