import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Expenses from "./Pages/Expenses";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Expenses />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
