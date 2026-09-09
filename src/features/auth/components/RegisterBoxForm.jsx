import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../../global/styles/global.css"

const RegisterBoxForm = ({ onRegister, ReturnToLogins }) =>{
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="card p-4 shadow-sm">
            <div className="div-title-text-login">
                <h3 className="text-center mb-3">
                    Crear Cuenta
                </h3>
            </div>
            <hr className="line-title-login"/>

            <form
                className="form-login"
            >
                <div className="name-form-login">
                    <input
                        className="form-control mb-2"
                        type="text"
                        name="user"
                        placeholder="Nombre de usuario"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className= "password-form-login">
                    <input
                        className="form-control mb-3"
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

                {/* Botón login principal */}
                <button  
                    className= "boton-login" 
                    type="button" 
                    onClick={() => onRegister({ name, password })}
                >
                    Registrar
                </button>
            </form>

        </div>
    )
}

export default RegisterBoxForm;