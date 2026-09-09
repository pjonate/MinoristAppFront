import { createPortal } from "react-dom";
import "./confirmModal.css"

export const ConfirmModal = ({ open, onConfirm, onCancel, total }) => {
  if (!open) return null;

  return createPortal(
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>Confirmar venta</h3>
        <p>Total: ${total}</p>

        <div className="d-flex justify-content-center gap-3 mt-3">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>

          <button className="btn btn-success" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>,
    document.body // 🔥 CLAVE
  );
};