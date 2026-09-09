import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { ShoppingCart } from "lucide-react"
import { Package } from "lucide-react";
import { useAuth } from "../context/authContext";

export const Sidebar = () => {

    const { logout } = useAuth();

    return (
        <aside className="sidebar">
            <h1 className="sidebar-title">MinoristApp</h1>

            <nav className="sidebar-nav">
                <NavLink to="/pos" className="sidebar-item">
                    <ShoppingCart size={18} className="sidebar-icon" />
                    Venta
                </NavLink>
            </nav>

            <nav className="sidebar-nav">
                <NavLink to="/inventory" className="sidebar-item">
                    <Package size={18} className="sidebar-icon" />
                    Inventario
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-button logout" onClick={logout}>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}