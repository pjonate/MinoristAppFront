import { ClipboardList } from "lucide-react";

export const TitlePedidos = () => (
  <div className="d-flex align-items-center ms-4 mt-3">
    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "38px", height: "38px" }}>
      <ClipboardList size={18} color="white" strokeWidth={2.5} />
    </div>
    <div className="ms-2 d-flex flex-column justify-content-center">
      <span className="fw-bold fs-5 text-dark lh-1" style={{ marginBottom: "2px" }}>
        Pedidos
      </span>
    </div>
  </div>
);