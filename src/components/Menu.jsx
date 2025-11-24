import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { FaChevronRight } from "react-icons/fa";
import "../styles/styles.css";

const Menu = () => {
  const navigate = useNavigate();
  return (
      <div>   
        <header
          style={{
          backgroundColor: "#d7d428",
          width: "100%",
          height: "75px",
          display: "flex",
          alignItems: "center"
        }}
        >
          <text
            className='text-header'
            style={{
              padding:"0px 15px"
            }}
          >
            MinoristApp
          </text>

          <FaArrowLeft 
            size={36} 
            style={{ 
              cursor: "pointer", 
              marginRight: "2rem", 
              marginLeft: "auto",
              color: "white",
            }} 
            onClick={() => window.history.back()} 
          />
        </header>     

        <div style={{display:"flex"}}>
          <aside style={{backgroundColor: "#e1e1e1", width: "180px", height: "calc(100vh - 75px)"}}></aside> 
          
          <main
            style={{
              flex:1,
              display: "flex",
              flexDirection:"column"
            }}
          >
            <h4 style={{padding:"15px 75px"}}>Menú</h4>
            <button
              onClick={() => navigate("/venta")}
              className='menu-button' 
              style={{
              appearance: "none", // 🔹 quita el estilo nativo del navegador
              textAlign: "left",
              backgroundColor:"#ffffffff",
              border:"none",
              borderTop: "2px solid #000000", 
              padding: "10px 75px",  }}>
                <FaChevronRight size={14} color="black" /> {/* 🔹 sin fondo */}
                Venta
            </button>

            <button 
              onClick={()=> navigate("/inventario")}
              className='menu-button' 
              style={{ 
              appearance: "none", // 🔹 quita el estilo nativo del navegador
              backgroundColor:"#ffffffff",
              textAlign: "left",
              border:"none", 
              borderTop: "2px solid #000000", 
              padding: "10px 75px", }}>
                <FaChevronRight size={14} color="black" /> {/* 🔹 sin fondo */}
                Inventario
            </button>

            <button
              onClick={()=> navigate("/reportes")} 
              className='menu-button' 
              style={{
              appearance: "none", // 🔹 quita el estilo nativo del navegador
              backgroundColor:"#ffffffff", 
              textAlign: "left",
              border:"none", 
              borderTop: "2px solid #000000",
              borderBottom:  "2px solid #000000",
              padding: "10px 75px", }}>
                <FaChevronRight size={14} color="black" /> {/* 🔹 sin fondo */}
                Reportes
            </button>
          </main>

          <aside style={{backgroundColor: "#e1e1e1", width: "180px", height: "calc(100vh - 75px)"}}></aside> 

        </div>  
      </div>
  );
};

export default Menu;