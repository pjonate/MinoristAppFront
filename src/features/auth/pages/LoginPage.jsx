import LoginBoxForm from "../components/LoginBoxForm";
import useLogin from "../hooks/useLogin";
import { getErrorMessage } from "../../../global/errors/getErrorMessage";
import { useEffect, useState } from "react";
import { useToast } from "../../context/toastContext";
import "./loginPage.css";

//page Login
const LoginPage = ()=>{

    const { handleLogin, error, setError } = useLogin();
    const { addToast } = useToast();

    const [ errorDisparado, setErrorDisparado ] = useState(false);

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
            <LoginBoxForm onLogin={handleLogin}/>

        </div>
    )
}

export default LoginPage;