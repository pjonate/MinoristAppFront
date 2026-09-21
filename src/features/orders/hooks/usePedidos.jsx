import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  createPedidoService,
  createProductForPedidoService,
  generateInventoryService,
  getPedidosService,
  getProductsForPedidoService,
} from "../services/pedidoServices";

export const usePedidos = () => {
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [pedidosResponse, productsResponse] = await Promise.all([
        getPedidosService(token),
        getProductsForPedidoService(token),
      ]);

      setPedidos(pedidosResponse || []);
      setProducts(productsResponse || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createPedido = async (pedido) => {
    setSaving(true);
    setError("");

    try {
      const response = await createPedidoService(pedido, token);

      if (!response?.pedido) {
        throw new Error("El servidor no devolvió el pedido creado");
      }

      setPedidos((current) => [response.pedido, ...current]);
      return response.pedido;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  const createProduct = async (product) => {
    setSaving(true);
    setError("");

    try {
      const response = await createProductForPedidoService(product, token);

      if (!response?.product) {
        throw new Error("El servidor no devolvió el producto creado");
      }

      setProducts((current) => [...current, response.product]);
      return response.product;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  const generateInventory = async (pedidoId) => {
    setError("");

    try {
      const response = await generateInventoryService(pedidoId, token);

      if (!response?.pedido) {
        throw new Error("El servidor no devolvió el pedido actualizado");
      }

      setPedidos((current) => current.map((pedido) => (
        pedido.id_pedido === pedidoId ? response.pedido : pedido
      )));
      return response.pedido;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  return {
    pedidos,
    products,
    loading,
    saving,
    error,
    createPedido,
    createProduct,
    generateInventory,
    reload: loadData,
  };
};