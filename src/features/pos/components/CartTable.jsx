import { useEffect, useState } from "react";
import { useSale } from "../hooks/useSale";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import { useToast } from "../../context/toastContext";
import { ConfirmModal } from "./confirmModal";
import "./CartTable.css";

export const CartTable = () => {

    const formatPrice = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const { sale, addProduct, handleQuantityChange, handleQuantityBlur, removeItem, errorGetProduct, setErrorGetProduct, finalizeSale } = useSale();
    const [code, setCode] = useState("");

    const handleFinalizeClick = async () => {
        const confirmed = window.confirm(`Total: $${sale.total}\n¿Confirmar venta?`);

        if (!confirmed) return;

        await finalizeSale();
    };


    useBarcodeScanner((codeScan) => {
        addProduct(codeScan);
    });

    const [ errorDisparado, setErrorDisparado ] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (errorGetProduct && !errorDisparado) {
            addToast({ type: "danger", message: errorGetProduct, duration: 5000 });
            setErrorDisparado(true); // marca que ya se disparó
        }
        setErrorDisparado(false);
        setErrorGetProduct(null);
    }, [errorGetProduct, addToast]);


    //estado de ovelay cofimrar compra
    const [confirming, setConfirming] = useState(false);


    return (
    <div className="container mt-4">
    
        <label htmlFor="productSearch" className="form-label fw-bold text-secondary small ms-1">
            Ingresar código o nombre del producto
        </label>

        <div className="input-group mb-3">
            <input 
                type="text" 
                className="form-control form-control-lg" 
                placeholder="Escribir código o nombre..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button 
                className="btn btn-primary"
                onClick={() => addProduct(code)}>
                Agregar
            </button>
        </div>

            <div className="table-responsive">
            <table className="table table-hover align-middle pos-table">
                <thead className="table-light">
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th style={{ width: "120px" }}>Cantidad</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                {sale.items.length > 0 ? (
                    // CAMINO A: Si hay productos
                    sale.items.map((item) => (
                    <tr key={item.code}>
                        <td>{item.code}</td>
                        <td>{item.description}</td>
                        <td>{formatPrice(item.unitPrice)}</td>
                        <td>
                        <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleQuantityChange(item.code, e.target.value)}
                            onBlur={(e) => handleQuantityBlur(item.code, e.target.value)}
                        />
                        </td>
                        <td>{formatPrice(item.subtotal)}</td>
                        <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.code)}>
                            ❌
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    // CAMINO B: Si NO hay productos (el mensaje centrado)
                    <tr>
                    <td colSpan="6" className="py-3 text-center">
                        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '200px' }}>
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
                            <span style={{ fontSize: '2rem' }}>🛒</span>
                        </div>
                        <h4 className="fw-bold text-secondary">El carrito está vacío</h4>
                        <p className="text-muted">Escanea un producto para comenzar.</p>
                        </div>
                    </td>
                    </tr>
                )}
                </tbody>                

            </table>
            </div>

            <div className="card mt-4">
            <div className="card-body text-end">
                <h4>
                Total: <strong>{formatPrice(sale.total)}</strong>
                </h4>

                <button 
                    className="btn btn-success btn-lg mt-3"
                    onClick={() => setConfirming(true)} 
                >
                    Finalizar venta
                </button>

                <ConfirmModal
                    open={confirming}
                    total={sale.total}
                    onCancel={() => setConfirming(false)}
                    onConfirm={async () => {
                        await finalizeSale();
                        setConfirming(false);
                    }}
                />

            </div>
        </div>

    </div>
    );
}