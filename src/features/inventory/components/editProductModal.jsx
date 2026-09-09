import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export const EditProductModal = ({ open, onClose, onUpdate, product }) => {

  const [form, setForm] = useState({
    codigo: "",
    categoria: "",
    descripcion: "",
    proveedor: "",
    precio: "",
    stock: ""
  });

  // 🔥 cargar datos cuando cambia el producto
  useEffect(() => {
    if (product) {
      setForm({
        codigo: product.codigo || "",
        categoria: product.categoria || "",
        descripcion: product.descripcion || "",
        proveedor: product.proveedor || "",
        precio: product.precio || "",
        stock: product.stock || ""
      });
    }
  }, [product]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!form.descripcion) return;

    onUpdate({
      ...form,
      id: product.id, // 🔥 CLAVE
      precio: Number(form.precio),
      stock: Number(form.stock)
    });

    onClose();
  };

  return createPortal(
    <div className="confirm-overlay">
      <div className="confirm-box">

        <h3>Editar producto</h3>

        <input
          className="form-control mb-2"
          name="codigo"
          value={form.codigo}
          disabled // 🔒 no editable
        />

        <input
          className="form-control mb-2"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <input
          className="form-control mb-2"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          placeholder="Categoría"
        />

        <input
          className="form-control mb-2"
          name="proveedor"
          value={form.proveedor}
          onChange={handleChange}
          placeholder="Proveedor"
        />

        <input
          className="form-control mb-2"
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          placeholder="Precio"
        />

        <input
          className="form-control mb-3"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
        />

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn btn-warning" onClick={handleSubmit}>
            Actualizar
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};