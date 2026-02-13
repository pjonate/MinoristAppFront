import { BrowserRouter as Router, Routes, Route, useLocation  } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";

import React from 'react';
import Login from './pages/Login'; // Ajusta la ruta si tu archivo está en otra carpeta
import Register from './pages/Register';
import Venta from './pages/Venta';
import Reportes from './pages/Reportes';
import Productos from './pages/Productos';


import ProtectedRoute from './auth/ProtectedRoute';

import MainLayout from './layouts/MainLayout';


function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas + layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path='/productos' element={<Productos />}/>
          <Route path="/venta" element={<Venta />} />
          <Route path="/reportes" element={<Reportes />} />
        </Route>

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