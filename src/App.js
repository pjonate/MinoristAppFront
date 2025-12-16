import { BrowserRouter as Router, Routes, Route, useLocation  } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";

import React from 'react';
import Login from './components/Login'; // Ajusta la ruta si tu archivo está en otra carpeta
import Register from './components/Register';
import Menu from './components/Menu';
import Venta from './components/erp/Venta';
import Inventario from './components/erp/Inventario';
import Reportes from './components/erp/Reportes';

import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/venta"
          element={
            <ProtectedRoute>
              <Venta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventario"
          element={
            <ProtectedRoute>
              <Inventario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          }
        />

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