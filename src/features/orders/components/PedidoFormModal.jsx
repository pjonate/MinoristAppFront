import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const initialForm = {
  id_producto: "",
  proveedor: "",
  cantidad: "",
  fecha_pedido: new Date().toISOString().slice(0, 10),
  observaciones: "",
};

const initialNewProduct = {
  codigo: "",
  categoria: "",
  descripcion: "",
  proveedor: "",
  precio: "",
  stock: 0,
};

export const PedidoFormModal = ({ open, products, loading, onClose, onSave, onCreateProduct }) => {
  const [form, setForm] = useState(initialForm);
  const [newProduct, setNewProduct] = useState(initialNewProduct);
  const [productQuery, setProductQuery] = useState("");
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setNewProduct(initialNewProduct);
      setProductQuery("");
      setShowNewProduct(false);
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

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((current) => ({ ...current, [name]: value }));
  };

  const selectProduct = (product) => {
    setForm((current) => ({
      ...current,
      id_producto: String(product.id),
      proveedor: product.proveedor || "",
    }));
    setProductQuery(`${product.codigo || ""} ${product.descripcion}`.trim());
    setShowNewProduct(false);
  };

  const startNewProduct = () => {
    setShowNewProduct(true);
    setForm((current) => ({ ...current, id_producto: "" }));
    setNewProduct((current) => ({
      ...current,
      descripcion: productQuery.trim(),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let productId = form.id_producto;

    if (!productId && showNewProduct) {
      setCreatingProduct(true);

      try {
        const createdProduct = await onCreateProduct({
          ...newProduct,
          precio: Number(newProduct.precio),
          stock: 0,
        });
        productId = createdProduct.id;
        setForm((current) => ({
          ...current,
          id_producto: String(productId),
          proveedor: newProduct.proveedor,
        }));
      } catch {
        return;
      } finally {
        setCreatingProduct(false);
      }
    }

    if (!productId) return;

    await onSave({
      ...form,
      id_producto: Number(productId),
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
            placeholder="Ingrese el código o nombre del producto"
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
              <div className="pedido-product-empty">
                <div>No se encontraron productos.</div>
                <button type="button" className="btn btn-sm btn-outline-primary mt-2" onClick={startNewProduct}>
                  Registrar nuevo producto
                </button>
              </div>
            )}
          </div>

          {showNewProduct && (
            <div className="pedido-new-product mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Registrar producto nuevo</strong>
                <button type="button" className="btn btn-sm btn-link" onClick={() => setShowNewProduct(false)}>Cancelar</button>
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Código</label>
                  <input className="form-control" name="codigo" value={newProduct.codigo} onChange={handleNewProductChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nombre del producto</label>
                  <input className="form-control" name="descripcion" value={newProduct.descripcion} onChange={handleNewProductChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <input className="form-control" name="categoria" value={newProduct.categoria} onChange={handleNewProductChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Precio</label>
                  <input className="form-control" name="precio" type="number" min="0" step="0.01" value={newProduct.precio} onChange={handleNewProductChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Proveedor</label>
                  <input className="form-control" name="proveedor" value={newProduct.proveedor} onChange={handleNewProductChange} required />
                </div>
              </div>
            </div>
          )}

          <label className="form-label mt-3">O seleccionar de la lista completa</label>
          <select className="form-select mb-3" name="id_producto" value={form.id_producto} onChange={handleChange} required={!showNewProduct}>
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
            <button type="submit" className="btn btn-primary" disabled={loading || creatingProduct || (showNewProduct ? !newProduct.codigo || !newProduct.descripcion || !newProduct.categoria || !newProduct.proveedor || newProduct.precio === "" : !form.id_producto)}>
              {creatingProduct ? "Registrando producto..." : loading ? "Guardando..." : "Crear pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};