import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/Register.css"
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';

    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'El correo no tiene un formato válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
          email,
          password
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      
        //alert('✅ Usuario registrado con éxito');
        //console.log(response.data);
        navigate("/welcome");
        // Si llega aquí, el registro fue exitoso
      } catch(error){
        console.error(error);
        alert('❌ Error al registrar');
      }
    }
  };

  return (

      <div className="container-fluid bg-light vh-100">
        {/* Flecha hacia atrás */}
        <Link to="/" className="position-absolute top-0 start-0 m-4 text-white fs-4">
          <i className="bi bi-arrow-left"></i>
        </Link>

        <div className="row h-100">

          {/* Panel izquierdo azul */}
          <div className="col-2 d-none d-md-block bg-dark-blue h-100 p-0"></div>

          {/* Formulario centrado */}
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
                {/*<div className="text-center mb-3 text-muted">— o —</div>

                <button type="button" className="btn btn-outline-danger w-100 mb-2">
                  <i className="bi bi-google me-2"></i> Registrarse con Google
                </button>

                <button type="button" className="btn btn-outline-primary w-100">
                  <i className="bi bi-facebook me-2"></i> Registrarse con Facebook
                </button>*/}
              </form>
            </div>
          </div>

          {/* Panel derecho azul */}
          <div className="col-2 d-none d-md-block bg-dark-blue h-100 p-0"></div>
        </div>
      </div>
  );
};


export default Register;


