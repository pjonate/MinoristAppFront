import { useEffect, useState } from "react";
import { useToast } from "../../context/toastContext";
import { BodyInventoryTable } from "./BodyInventoryTable";
import { useInventorySearch } from "../hooks/useInventorySearch";

export const InventoryTable = () => {

    const [query, setQuery] = useState("");
    const { results, search } = useInventorySearch();

    const formatPrice = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(value);
    };

    /*useBarcodeScanner((codeScan) => {
        addProduct(codeScan);
    });*/

    const [ errorDisparado, setErrorDisparado ] = useState(false);
    const { addToast } = useToast();

    /*useEffect(() => {
        if (errorGetProduct && !errorDisparado) {
            addToast({ type: "danger", message: errorGetProduct, duration: 5000 });
            setErrorDisparado(true); // marca que ya se disparó
        }
        setErrorDisparado(false);
        setErrorGetProduct(null);
    }, [errorGetProduct, addToast]);*/


    return (
        <div className="container mt-4">

        <div className="container-fluid">
        <div className="row">
            {/* col-md-6 hace que ocupe la mitad (6 de 12 columnas) en pantallas medianas/grandes */}
            {/* col-lg-4 lo hace aún más pequeño en pantallas muy grandes */}
            <div className="col-12 col-md-9 col-lg-10">
            
            {/* Etiquetas superiores */}
            <div className="d-flex mb-1">
                <div className="flex-grow-1">
                <label className="form-label small fw-bold text-muted ms-1">Producto / Código</label>
                </div>
                {/*<div style={{ width: '150px' }}>
                <label className="form-label small fw-bold text-muted ms-1">Categoría</label>
                </div>*/}
            </div>

            {/* Buscador Proporcional */}
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Buscar por código o nombre..."
                    value ={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                    className="btn btn-primary btn-lg px-4"  
                    style={{marginRight:"20px"}}
                    onClick={() => search(query)}
                    
                >
                    Buscar
                </button>

                {/*<select 
                    className="form-select form-select-lg" 
                    style={{ maxWidth: '150px', backgroundColor: '#f8f9fa' }}
                >
                    <option value="">Todas</option>
                    <option value="bebidas">Bebidas</option>
                </select>*/}
            </div>

            </div>
        </div>
        </div>

                <div className="table-responsive">
                <table className="table table-hover align-middle pos-table">
                    <thead className="table-light">
                        <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        <BodyInventoryTable products={results}/>
                    </tbody>
                </table>
                </div>

        </div>
    );
}