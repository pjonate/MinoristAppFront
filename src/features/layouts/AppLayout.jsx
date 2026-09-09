import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}