import { NavLink } from "react-router-dom";
import "../styles/layout.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <span className="sidebar-title">MinoristApp</span>

      <NavLink to="/venta">
        <i className="bi bi-chevron-right"></i>
        <span>Venta</span>
      </NavLink>

      <NavLink to="/productos">
        <i className="bi bi-chevron-right"></i>
        <span>Productos</span>
      </NavLink>

      <NavLink to="/reportes">
        <i className="bi bi-chevron-right"></i>
        <span>Reportes</span>
      </NavLink>
    </aside>
  );
}
