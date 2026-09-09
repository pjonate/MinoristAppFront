import { useState } from "react";
import { registerService } from "../services/registerService";
import { useNavigate } from "react-router-dom";
import { getSuccessMessage } from "../../../global/success/getSuccessMessage";
import { getErrorMessage } from "../../../global/errors/getErrorMessage";

export default function useRegister() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async ({ name, password }) => {
        setError(null);
        setLoading(true);

        try {
            const { code, status, data } = await registerService({ name, password })
            setLoading(false);

            const messageSuccess = code ? getSuccessMessage(code) : "";
            setSuccess(messageSuccess);
            return data;
        } catch(err) {
            const messageError = err.code ? getErrorMessage(err.code) : "";
            setError(messageError);
            setSuccess(null);
            setLoading(false);
        }
    };

    return { handleRegister, error, success, setError };
}