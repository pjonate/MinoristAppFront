import fondo from "../recursos/fondo_login.jpg"
import googleLogo from "../recursos/google.png";
import "../styles/styles.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

 
const Login =()=>{
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

            const response = await axios.post('/login', { name, password });
            // Laravel ya puso la cookie HttpOnly de sesión en la respuesta

            // Validar/obtener usuario y navegar
            const me = await axios.get('/user');
            if (me.status === 200) {
            // opcional: guardar me.data en contexto
            navigate('/menu', { replace: true });
            }
        } catch (err) {
            console.error(err.response ?? err);
            // maneja errores, mostrar mensaje al usuario
        }
    }

  }

  return(
    <div
      style={{
        backgroundImage: `url(${fondo})`,//imagen de fondo a utilizar
        backgroundSize: "cover",//cubrir toda la pantalla
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh", //ocupa toda la ventana
        width: "100%",
        display: "flex",//esta opcion permite que los elementos dentro de un div puedan ubicarse libremente dentro del div
        justifyContent: "center",//centra el contenido dentro de div a lo anchi
        alignItems:"center"//centra el contenido de div a lo alto
      }}
    >
      <main>
        <div
            style={{
                backgroundColor: "#ffffff",//color de fondo
                borderRadius: "16px",//radio de las esqunas
                width: "400px",//ancho en pixeles
                height: "550px",//altura en pixeles
                textAlign: "center",//ubicacion por defecto de los elementos dentro del div, en este caso en el centro
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
            }}
        >
            <div
                style= {{
                    paddingTop: "2rem"
                }}
            >
                <text
                    className="welcome-text"
                    style={{
                        fontFamily: "Brush Script"
                    }}
                >
                    Bienvenido
                </text>
            </div>
            <hr
                style={{
                    height: "2.5px",
                    backgroundColor: "black",
                    marginTop: "0.01rem"
                }}
            />

            <form
                onSubmit={handleSubmit}
                style={{
                    paddingTop: "30px",
                    display: "flex",//se pueden ubicar los elemntos dentro del elemento libremente, en este caso, dentro de un form
                    alignItems: "center",
                    flexDirection:"column",//Con "column", se apilan los elementos uno encima de otro dentro del elemento
                    gap: "2rem" //separacion de dos lineas entre cada etiqueta dentro del elemento actual, un form en este caso
                }}
            >
                <input
                    type="text"
                    name="user"
                    placeholder="Nombre de usuario"
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
                        placeholder="Contraseña"
                        autoComplete="off" 
                        style={{
                            padding: "0px 15px",
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
                    //onClick={() => navigate("/menu")}
                    style={{
                        width:"270px",
                        height:"55px",
                        borderRadius: "16px",
                        border: "None",
                        backgroundColor: "#ffb458"
                    }}
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