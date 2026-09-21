import { useState } from "react";
import { useToast } from "../../context/toastContext";
import { PedidoFormModal } from "../components/PedidoFormModal";
import { PedidosTable } from "../components/PedidosTable";
import { TitlePedidos } from "../components/TitlePedidos";
import { usePedidos } from "../hooks/usePedidos";
import "../styles/pedidos.css";

export const PedidosPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();
  const { pedidos, products, loading, saving, error, createPedido, createProduct, generateInventory } = usePedidos();

  const handleCreate = async (pedido) => {
    try {
      await createPedido(pedido);
      setIsModalOpen(false);
      addToast({ type: "success", message: "Pedido creado correctamente", duration: 4000 });
    } catch (requestError) {
      addToast({ type: "danger", message: requestError.message, duration: 5000 });
    }
  };

  const handleCreateProduct = (product) => createProduct(product);

  const handleGenerateInventory = async (pedido) => {
    try {
      await generateInventory(pedido.id_pedido);
      addToast({ type: "success", message: "Inventario actualizado con el pedido recibido", duration: 4000 });
    } catch (requestError) {
      addToast({ type: "danger", message: requestError.message, duration: 5000 });
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <TitlePedidos />

        <div className="ms-auto d-flex gap-2 me-3">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Nuevo pedido
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mx-4 mt-3">{error}</div>}

      <section className="container mt-4">
        <PedidosTable pedidos={pedidos} loading={loading} onGenerateInventory={handleGenerateInventory} />
      </section>

      <PedidoFormModal
        open={isModalOpen}
        products={products}
        loading={saving}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreate}
        onCreateProduct={handleCreateProduct}
      />
    </div>
  );
};