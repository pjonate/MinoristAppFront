import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Welcome.css";

function Welcome(){
  const navigate = useNavigate();
  const [startFade, setStartFade] = useState(false);

  useEffect(() => {
    // Guardar color anterior para restaurarlo si quieres
    const previousColor = document.body.style.backgroundColor;

    // Establecer fondo negro solo en esta vista
    document.body.style.backgroundColor = "#000000";

    return () => {
      // Restaurar color anterior al salir de esta vista
      document.body.style.backgroundColor = previousColor;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartFade(true);
      navigate("/"); // Redirige al inicio
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      className="vh-100 vw-100 d-flex justify-content-center align-items-center welcome-screen"
      style={{ backgroundColor: "#0b132b" }} // Azul Bootstrap
      initial={{ opacity: 1, backgroundColor: "#0b132b" }} // azul oscuro
      animate={{
        opacity: startFade ? 0 : 1,
        backgroundColor: startFade ? "#000000" : "#0d6efd" // Transición a negro
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
      >
        Bienvenidos
      </motion.h1>
    </motion.div>
  );
};

export default Welcome;
