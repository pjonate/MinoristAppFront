import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "../styles/layout.css";

export default function MainLayout() {
    return (
    <div className="layout-root">

        <div className="layout-container">
            <div className="layout-body">
                <Sidebar />
                <main className="layout-content">
                <Outlet />
                </main>
            </div>
        </div>

    </div>
    );
}

