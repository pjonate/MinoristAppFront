
const API_URL = process.env.REACT_APP_API_URL;

export const searchProductsService = async (query, token) => {
    const response = await fetch(
        `${API_URL}/products/search?q=${encodeURIComponent(query)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    /*if (!response.ok) {
        throw new Error(data.error || "Error en búsqueda");
    }*/

    return data;
};


