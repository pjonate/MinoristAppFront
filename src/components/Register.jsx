import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import { FaArrowLeft } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState('');
  //const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) alert('El nombre es obligatorio');

    /*if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'El correo no tiene un formato válido';
    }*/

    if (!password) {
      alert('La contraseña es obligatoria');
    } else if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
    }

    return newErrors;
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post('/api/register', {
          name,
          password
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      
        //alert('✅ Usuario registrado con éxito');
        //console.log(response.data);
        navigate("/");
        // Si llega aquí, el registro fue exitoso
      } catch(error){
        console.error(error);
        alert('❌ Error al registrar');
      }
    }
  };

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
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center"
            }}
          >
            <div
              style={{
                //border: "2px solid black",
                backgroundColor: "#ffffff",//color de fondo
                borderRadius: "16px",//radio de las esqunasS
                width: "400px",//ancho en pixeles
                height: "300px",//altura en pixeles
                textAlign: "center",//ubicacion por defecto de los elementos dentro del div, en este caso en el centro
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",//desplazameinto horizontal, desplazamiento vertical, cuanto se difumina, color
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  paddingTop:"15px",
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:"1rem"
                }}
              >
                <h4>Crear sesión</h4>
                <input
                  type="text"
                  name="user"
                  placeholder='Nombre de usuario'
                  style={{
                    padding: "0px 15px", //espacio arriba 0px, hacia el lado 15px
                    border: "None",
                    backgroundColor:"#f5f5f3",
                    borderRadius: "16px",
                    width: "270px",
                    height: "55px",
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />


                <div style={{ position: "relative"}}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder='Contraseña'
                    autoComplete="off" 
                    style={{
                      padding: "0px 15px", //espacio arriba 0px, hacia el lado 15px
                      border: "None",
                      backgroundColor:"#f5f5f3",
                      borderRadius: "16px",
                      width: "270px",
                      height: "55px",
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                          position: "absolute",
                          right: "10px",
                          top: "0",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          color: "#555",
                      }}
                  >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </span>
                </div>
                <button
                  type="submit"
                  style={{
                    width:"270px",
                    height:"55px",
                    borderRadius: "16px",
                    border: "None",
                    backgroundColor: "#ffb458"
                  }}
                >
                  Registrarse
                </button>
              </form>  
            </div>
          </main>

          <aside style={{backgroundColor: "#e1e1e1", width: "180px", height: "calc(100vh - 75px)"}}></aside> 

          {/* Formulario centrado 
          <div className="col-12 col-md-8 d-flex justify-content-center align-items-center">
            <div className="bg-white p-5 rounded shadow w-100" style={{ maxWidth: '400px' }}>
              <h2 className="mb-4 text-center text-dark blue">Crear cuenta</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nombre" 
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                  />
                  {errors.name && <div className='text-danger'>{errors.name}</div>}
                </div>

                <div className='mb-3'>
                  <input
                    type="email"
                    className="form-control"
                    placeholder='Correo electrónico'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <div className='text-danger'>{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100">Registrarse</button>
              </form>
            </div>
          </div> */}
        </div>  
      </div>
  );
};


export default Register;


