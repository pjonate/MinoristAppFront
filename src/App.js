import { BrowserRouter as Router, Routes, Route, useLocation  } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";

import React from 'react';
import Login from './components/Login'; // Ajusta la ruta si tu archivo está en otra carpeta
import Register from './components/Register';
import Welcome from './components/Welcome';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </AnimatePresence>
  );
}


function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;