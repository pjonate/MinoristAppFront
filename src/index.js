import React from 'react'; //bibioteca de front
import ReactDOM from 'react-dom/client';//ReactDOM conecta la aplicacion React con
//el DOM del navegador
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ToastContainer } from "react-toastify";

axios.defaults.withCredentials = true; // importante: permite enviar cookies

const root = ReactDOM.createRoot(document.getElementById('root'));//React se monta en el DOM
//document: es el DOM
//document.getElementById('root); se consigue el nodo con id root del DOM
//ReactDOM.createRoot(...): es una instrucicon que le indica a React que tomara el control
//del nodo root en el DOM. Improtante, controla el nodo del DOM, no la etiqueta de HTML


//Al ingresar al enlace:
//1-Navegador descarga HTML
//2-DOM crea la estrcutra
//3-Se carga index.js y React maneja el nodo "root" del DOM

root.render(//root carga los componentes principales en el nodo root de DOM
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </React.StrictMode>
);

//React.StrcitMode: componente no visual de React que se encarga de fijar normas estrictas
//los componentes hijos de este componente
//AuthPorvider: Componente no visual desarrollada para crear logica de autenticacion y 
//navegacion entre paginas de React


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
