import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Contact from "./pages/Contact";
import About from "./pages/About";
import { Toaster } from "react-hot-toast"; // ✅ Import toaster

function App() {
  return (
    <Router>
      <Navbar />

      {/* ✅ Add Toaster here so it's global */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
