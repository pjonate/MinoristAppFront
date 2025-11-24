import { BrowserRouter as Router, Routes, Route, useLocation  } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";

import React from 'react';
import Login from './components/Login'; // Ajusta la ruta si tu archivo está en otra carpeta
import Register from './components/Register';
import Menu from './components/Menu';
import Venta from './components/erp/Venta';
import Inventario from './components/erp/Inventario';
import Reportes from './components/erp/Reportes';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/venta" element={<Venta />} />
        <Route path="/inventario" element={<Inventario />}></Route>
        <Route path='/reportes' element={<Reportes/>}></Route>
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