const API_URL = process.env.REACT_APP_API_URL;

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "No se pudo completar la solicitud");
  }

  return data;
}

export const getPedidosService = (token) =>
  request("/pedidos", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getProductsForPedidoService = (token) =>
  request("/all", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createPedidoService = (pedido, token) =>
  request("/pedidos", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(pedido),
  });

export const generateInventoryService = (pedidoId, token) =>
  request(`/pedidos/${pedidoId}/generar-inventario`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });