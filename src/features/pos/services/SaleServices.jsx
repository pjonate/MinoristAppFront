import { useAuth } from "../../context/authContext";

const API_URL = process.env.REACT_APP_API_URL;

export const getProductByCodeService = async(code, token) =>{
    const cleanCode = code.trim();
    try{
        const response = await fetch(`${API_URL}/producto/${cleanCode}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error("Request failed");

            error.status = response.status;

            switch (response.status) {
                case 404:
                    error.code = "PRODUCT_NOT_FOUND";
                    break;
                case 500:
                    error.code = "SERVER_ERROR";
                    break;
            }
            //console.log("loginService:", error.code);
            throw error;
        }

        return data;

    }catch(err){
      // 👇 CLAVE
      if (err.code) {
        throw err;
      }

      throw {
        code: "NETWORK_ERROR",
      };
    }
}


export const createSaleService = async (sale, token) => {
    const response = await fetch(`${API_URL}/sales`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(sale)
    });

    // 🔴 manejar errores HTTP
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear venta");
    }

    return await response.json();
};