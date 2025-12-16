import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    axios.get('/user')
      .then(res => { if (mounted && res.status === 200) setAuthed(true); })
      .catch(() => { if (mounted) setAuthed(false); })
      .finally(() => { if (mounted) setChecking(false); });
    return () => { mounted = false; };
  }, []);

  if (checking) return <div>Comprobando sesión...</div>;
  if (!authed) return <Navigate to="/login" />; // o "/"

  return children;
}

