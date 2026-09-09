import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../features/context/authContext"

export const ProtectedRoute = () => {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}