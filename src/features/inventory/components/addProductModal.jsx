import { useState } from "react";
import { createPortal } from "react-dom";

export const AddProductModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    codigo: "",
    categoria: "",
    descripcion: "",
    proveedor: "",
    precio: "",
    stock: ""
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // validación básica
    if (!form.codigo || !form.descripcion) return;

      onSave({
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock)
      });

      // limpiar
      setForm({
        codigo: "",
        categoria: "",
        descripcion: "",
        proveedor: "",
        precio: 0,
        stock: 0
      });

      onClose();
  };

  return createPortal(
    <div className="confirm-overlay">
      <div className="confirm-box">

        <h3>Añadir producto</h3>

        <input
          className="form-control mb-2"
          name="codigo"
          placeholder="Código"
          value={form.codigo}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="descripcion"
          placeholder="Nombre"
          value={form.descripcion}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="categoria"
          placeholder="Categoría"
          value={form.categoria}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="proveedor"
          placeholder="Proveedor"
          value={form.proveedor}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          name="precio"
          type="number"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Guardar
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};