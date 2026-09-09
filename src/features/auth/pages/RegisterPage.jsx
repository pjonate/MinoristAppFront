import { useState, useEffect } from "react";
import { useToast } from "../../context/toastContext";
import { useNavigate } from "react-router-dom";
import RegisterBoxForm from "../components/RegisterBoxForm";
import useRegister from "../hooks/useRegister";
import "./registerPage.css";

//page Register
const RegisterPage = ()=>{

    const { handleRegister, error, success, setError } = useRegister();
    const [successDisparado, setSuccessDisparado] = useState(false);
    const [errorDisparado, setErrorDisparado] = useState(false);
    const { addToast } = useToast(); //addToast es una funcion del contexto de Toast
    const navigate = useNavigate();


    useEffect(() => {
        if (success != null && !successDisparado) {
            addToast({ type: "success", message: success, duration: 5000 });
            setSuccessDisparado(true); // marca que ya se disparó
            navigate("/", { replace: true }); // reemplaza historial
        }
    }, [success, addToast, navigate]);

    useEffect(() => {
        if (error && !errorDisparado) {
            addToast({ type: "danger", message: error, duration: 5000 });
            setErrorDisparado(true); // marca que ya se disparó
        }
        setErrorDisparado(false);
        setError(null);
    }, [error, addToast]);

    return(
        <div className="div-login-page">
            <RegisterBoxForm onRegister={handleRegister} />
        </div>
    )
}

export default RegisterPage;