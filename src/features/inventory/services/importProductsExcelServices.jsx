const API_URL = process.env.REACT_APP_API_URL;

export const importProductsExcelService = async (products, token) => {
  const response = await fetch(`${API_URL}/product/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ products })
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "El servidor devolvió una respuesta no válida al importar el Excel"
    );
  }

  return data;
};
