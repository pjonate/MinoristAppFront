const API_URL = process.env.REACT_APP_API_URL;

export const updateProductServices = async (product, token) => {
  const response = await fetch(
    `${API_URL}/product/${product.id}`,
    {
      method: "PUT", // o PATCH si prefieres parcial
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        codigo: product.codigo,
        categoria: product.categoria,
        descripcion: product.descripcion,
        proveedor: product.proveedor,
        precio: product.precio,
        stock: product.stock
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al actualizar producto");
  }

  return data;
};