import googleLogo from "../recursos/google.png";
import "../styles/styles.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

 
const Login =()=>{
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  //<LoginPasswordInput password={password} setPassword={setPassword} />
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) alert('El nombre es obligatorio');

    if (!password) {
      alert('La contraseña es obligatoria');
    } 

    return newErrors;
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

    const formErrors = validate();
    setErrors(formErrors);

    if(Object.keys(formErrors).length == 0) {
        e.preventDefault();
        try {
            // Si usas Sanctum, primero: await axios.get('/sanctum/csrf-cookie');

            await login(name, password);
            navigate('/venta', { replace: true })

        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Usuario o contraseña incorrectos");
            } else {
                toast.error("Error inesperado. Intente más tarde.");
            }
          }
        }
  }

  return(
    <div className="div-login">
      <main>
        <div className="div-title-login">
            <div className="div-title-text-login">
                <text className="welcome-text-login">
                    Bienvenido
                </text>
            </div>
            <hr className="line-title-login"/>

            <form
                className="form-login"
                onSubmit={handleSubmit}
            >
                <input
                    className="input-login"
                    type="text"
                    name="user"
                    placeholder="Nombre de usuario"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div style={{ position: "relative"}}>
                    <input
                        className="input-login"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Contraseña"
                        autoComplete="off" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <span
                        className="visor-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </span>
                </div>


                <button
                    className="button-login" 
                    type="submit"
                    //onClick={() => navigate("/menu")}
                >
                    Iniciar sesión   
                </button>

                <button 
                    type="submit"
                    style={{
                        width:"270px",
                        height:"55px",
                        borderRadius: "16px",
                        backgroundColor: "#ffffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem"
                    }}
                >
                    <img
                        src={googleLogo}
                        alt="Google"
                        style={{
                            width:"20px",
                            height:"20px",
                        }}
                    />
                    Iniciar sesión con Google  
                </button>
                <text>¿No tiene cuenta?{" "}<Link to="/register">Crea una cuenta</Link></text>
            </form>
        </div>    

      </main>
    </div>
  )
}

export default Login;