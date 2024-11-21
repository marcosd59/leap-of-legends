import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import History from "./components/History";
import Tutorial from "./components/Tutorial";
import Level1 from "./components/Level1";
import Level4 from "./components/Level4";
import Level5 from "./components/Level5";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<History />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/level1" element={<Level1 />} />
        <Route path="/level4" element={<Level4 />} />
        <Route path="/level5" element={<Level5 />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
