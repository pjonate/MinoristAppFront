const API_URL = process.env.REACT_APP_API_URL;

const createProductRequestError = (response, data) => {
    const error = new Error(data?.message || data?.error || "Error al consultar el producto");
    error.status = response.status;

    if (response.status === 400) error.code = "OUT_OF_STOCK";
    if (response.status === 401) error.code = "AUTH_REQUIRED";
    if (response.status === 403) error.code = "FORBIDDEN";
    if (response.status === 404) error.code = "PRODUCT_NOT_FOUND";
    if (response.status >= 500) error.code = "SERVER_ERROR";

    return error;
};

export const getProductByCodeService = async(code, token) =>{
    const cleanCode = code.trim();
    try{
        const response = await fetch(`${API_URL}/producto/${encodeURIComponent(cleanCode)}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw createProductRequestError(response, data);
        }

        return data;

    }catch(err){
      // 👇 CLAVE
      if (err.code) {
        throw err;
      }

            throw Object.assign(new Error("No se pudo conectar con el servidor"), {
                code: "NETWORK_ERROR"
            });
    }
}

export const searchProductsService = async (query, token) => {
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) throw createProductRequestError(response, data);

    return data;
};


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