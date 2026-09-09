import { useState } from "react";
import { updateProductServices } from "../services/updateProductServices";
import { useAuth } from "../../context/authContext";

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const updateProduct = async (product) => {
    try {
      setLoading(true);
      setError(null);

      const data = await updateProductServices(product, token);

      return data;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProduct,
    loading,
    error
  };
};