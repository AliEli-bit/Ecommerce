import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/components/Home";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Products from "@/pages/Products";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App;
