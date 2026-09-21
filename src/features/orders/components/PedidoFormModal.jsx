import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const initialForm = {
  id_producto: "",
  proveedor: "",
  cantidad: "",
  fecha_pedido: new Date().toISOString().slice(0, 10),
  observaciones: "",
};

export const PedidoFormModal = ({ open, products, loading, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [productQuery, setProductQuery] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setProductQuery("");
    }
  }, [open]);

  const selectedProduct = products.find(
    (product) => String(product.id) === String(form.id_producto)
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = productQuery.trim().toLowerCase();

    if (!normalizedQuery) return products;

    return products.filter((product) => (
      String(product.codigo || "").toLowerCase().includes(normalizedQuery)
      || String(product.descripcion || "").toLowerCase().includes(normalizedQuery)
      || String(product.proveedor || "").toLowerCase().includes(normalizedQuery)
    ));
  }, [productQuery, products]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    if (name === "id_producto") {
      const product = products.find((item) => String(item.id) === String(value));
      setForm((current) => ({ ...current, [name]: value, proveedor: product?.proveedor || "" }));
      setProductQuery(product ? `${product.codigo || ""} ${product.descripcion}`.trim() : "");
    }
  };

  const selectProduct = (product) => {
    setForm((current) => ({
      ...current,
      id_producto: String(product.id),
      proveedor: product.proveedor || "",
    }));
    setProductQuery(`${product.codigo || ""} ${product.descripcion}`.trim());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave({
      ...form,
      id_producto: Number(form.id_producto),
      cantidad: Number(form.cantidad),
    });
  };

  return createPortal(
    <div className="confirm-overlay">
      <div className="confirm-box pedido-form-modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Nuevo pedido</h3>
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-label">Buscar producto por código o nombre</label>
          <input
            className="form-control"
            type="search"
            placeholder="Ej: 7801235131117 o jurel san jose"
            value={productQuery}
            onChange={(event) => setProductQuery(event.target.value)}
          />

          <div className="pedido-product-results" role="listbox" aria-label="Productos encontrados">
            {filteredProducts.length ? filteredProducts.slice(0, 8).map((product) => (
              <button
                type="button"
                className={`pedido-product-option ${String(product.id) === String(form.id_producto) ? "selected" : ""}`}
                key={product.id}
                onClick={() => selectProduct(product)}
              >
                <span>
                  <strong>{product.descripcion}</strong>
                  <small>{product.codigo || "Sin código"} · {product.proveedor || "Sin proveedor"}</small>
                </span>
                <small>Stock: {product.stock}</small>
              </button>
            )) : (
              <div className="pedido-product-empty">No se encontraron productos.</div>
            )}
          </div>

          <label className="form-label mt-3">O seleccionar de la lista completa</label>
          <select className="form-select mb-3" name="id_producto" value={form.id_producto} onChange={handleChange} required>
            <option value="">Seleccionar producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.codigo ? `${product.codigo} - ` : ""}{product.descripcion}
              </option>
            ))}
          </select>

          {selectedProduct && <div className="small text-muted mb-3">Stock actual: {selectedProduct.stock}</div>}

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Proveedor</label>
              <input className="form-control" name="proveedor" value={form.proveedor} onChange={handleChange} maxLength="100" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Cantidad</label>
              <input className="form-control" name="cantidad" type="number" min="1" value={form.cantidad} onChange={handleChange} required />
            </div>
          </div>

          <label className="form-label mt-3">Fecha del pedido</label>
          <input className="form-control mb-3" name="fecha_pedido" type="date" value={form.fecha_pedido} onChange={handleChange} required />

          <label className="form-label">Observaciones</label>
          <textarea className="form-control mb-4" name="observaciones" rows="3" value={form.observaciones} onChange={handleChange} maxLength="1000" />

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !products.length}>
              {loading ? "Guardando..." : "Crear pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};