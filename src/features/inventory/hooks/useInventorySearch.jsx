import { useState } from "react";
import { searchProductsService } from "../services/searchProductsServices";
import { useAuth } from "../../context/authContext";


export const useInventorySearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const search = async (query) => {
    // evitar búsquedas basura
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await searchProductsService(query, token);

      setResults(data);
      console.log(data);

    } catch (err) {
      // importante: tu backend devuelve 404
      setResults([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search
  };
};