const API_URL = process.env.REACT_APP_API_URL;

export const createProductService = async (product, token) => {
  const response = await fetch(`${API_URL}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al crear producto");
  }

  return data;
};