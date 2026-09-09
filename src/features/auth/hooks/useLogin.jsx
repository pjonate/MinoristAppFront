import { useState } from "react";
import { loginService } from "../services/loginService";
import { useAuth } from "../../context/authContext";
import { getErrorMessage } from "../../../global/errors/getErrorMessage";


export default function useLogin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); //  authContext

  const handleLogin = async ({ name, password }) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginService({ name, password });
      //context
      login({
        user: data.user,
        token: data.token
      });
      
      console.log(data);
      setLoading(false);
      return data;
    } catch (err) {
      const messageError = err.code ? getErrorMessage(err.code) : "";
      //console.log("useLogin: ", messageError);
      setError(messageError);
      setLoading(false);
    }
  };

  return { handleLogin, error, setError };
}

