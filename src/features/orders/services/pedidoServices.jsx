const API_URL = process.env.REACT_APP_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const responseText = await response.text();
  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "No se pudo completar la solicitud");
  }

  if (data === null) {
    throw new Error("El servidor devolvió una respuesta vacía o no válida");
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