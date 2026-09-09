import { useState } from "react";
import { createProductService } from "../services/addProductServices";
import { useAuth } from "../../context/authContext";

export const useAddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const addProduct = async (product) => {
    try {
      setLoading(true);
      setError(null);

      const data = await createProductService(product, token);

      return data; // importante para la UI

    } catch (err) {
      setError(err.message);
      throw err; // permite que el componente reaccione
    } finally {
      setLoading(false);
    }
  };

  return {
    addProduct,
    loading,
    error
  };
};