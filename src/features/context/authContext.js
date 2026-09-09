import { createContext, useContext, useState, useEffect } from "react";

// 1. Crear el context
const AuthContext = createContext(null);

// 2. Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token")
  })

  /*// 🔹 Restaurar sesión al recargar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, []);*/

  // 🔹 Guardar sesión (NO llama API)
  const login = ({ user, token }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
  };

  // 🔹 Limpiar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 3. Hook para usarlo
export function useAuth() {
  return useContext(AuthContext);
}