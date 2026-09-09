import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { AppLayout } from "../../features/layouts/AppLayout.jsx";
import LoginPage from "../../features/auth/pages/LoginPage.jsx"
import RegisterPage from "../../features/auth/pages/RegisterPage.jsx";
import SalePage from "../../features/pos/pages/SalePage.jsx";
import { InventoryPage } from "../../features/inventory/pages/InventoryPage.jsx";

export default function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/pos" element={<SalePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}