import { useState } from "react";
import { createPortal } from "react-dom";

export const ImportExcelModal = ({ open, onClose, onImport, loading }) => {
  const [error, setError] = useState("");

  if (!open) return null;

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setError("");
      await onImport(file);
      event.target.value = "";
    } catch (err) {
      setError(err.message || "No se pudo procesar el archivo.");
      event.target.value = "";
    }
  };

  const handleClose = () => {
    setError("");
    onClose();
  };

  return createPortal(
    <div className="confirm-overlay">
      <div className="confirm-box" style={{ maxWidth: "480px" }}>
        <h3>Cargar Excel</h3>

        <div className="mb-3">
          <label className="form-label fw-semibold">Selecciona el archivo</label>
          <input
            className="form-control"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <div className="alert alert-light border mb-3" role="alert">
          El archivo debe contener estas columnas: codigo, descripcion, categoria, proveedor, precio, stock.
        </div>

        {error && (
          <div className="alert alert-danger py-2 mb-3" role="alert">
            {error}
          </div>
        )}

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </button>

          <button className="btn btn-primary" type="button" disabled>
            {loading ? "Cargando..." : "Cargar archivo"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
