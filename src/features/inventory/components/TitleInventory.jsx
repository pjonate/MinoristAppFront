import { Package } from "lucide-react"

export const TitleInventory = () =>{
    return(
        <div className="d-flex align-items-center ms-4 mt-3">
            {/* 1. EL CÍRCULO AZUL (Reduje un poco el tamaño para que sea más sutil) */}
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                style={{ width: '38px', height: '38px' }}>
                <Package size={18} color="white" strokeWidth={2.5} />
            </div>

            {/* 2. EL TEXTO (Usamos ms-2 para que esté cerca, y mb-0 para quitar espacio abajo) */}
            <div className="ms-2 d-flex flex-column justify-content-center">
                <span className="fw-bold fs-5 text-dark lh-1" style={{ marginBottom: '2px' }}>
                    Inventario
                </span>
            </div>
        </div>
    )
}