import { Camera, PackageCheck } from "lucide-react";

const statusLabels = {
  pendiente: "Pendiente",
  recibido: "Recibido",
};

export const PedidosTable = ({ pedidos, loading, onGenerateInventory }) => {
  if (loading) return <div className="p-5 text-center text-muted">Cargando pedidos...</div>;

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle pedidos-table">
        <thead className="table-light">
          <tr>
            <th>Producto</th>
            <th>Proveedor</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {!pedidos.length ? (
            <tr><td colSpan="6" className="text-center text-muted py-5">Todavía no hay pedidos registrados.</td></tr>
          ) : pedidos.map((pedido) => (
            <tr key={pedido.id_pedido}>
              <td>
                <div className="fw-semibold">{pedido.producto?.descripcion || "Producto eliminado"}</div>
                <small className="text-muted">{pedido.producto?.codigo || "Sin código"}</small>
              </td>
              <td>{pedido.proveedor || "Sin proveedor"}</td>
              <td>{pedido.cantidad}</td>
              <td>{pedido.fecha_pedido}</td>
              <td><span className={`badge ${pedido.estado === "recibido" ? "text-bg-success" : "text-bg-warning"}`}>{statusLabels[pedido.estado] || pedido.estado}</span></td>
              <td className="text-end">
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary" disabled title="La captura de foto estará disponible próximamente">
                    <Camera size={16} />
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-primary" disabled={pedido.estado !== "pendiente"} onClick={() => onGenerateInventory(pedido)}>
                    <PackageCheck size={16} className="me-1" />
                    Generar inventario
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};