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


    useBarcodeScanner((codeScan) => {
        addProduct(codeScan);
    });

    const { addToast } = useToast();

    useEffect(() => {
        if (errorGetProduct) {
            addToast({ type: "danger", message: errorGetProduct, duration: 5000 });
        }
        setErrorGetProduct(null);
    }, [errorGetProduct, addToast, setErrorGetProduct]);


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
                onClick={async () => {
                    const added = await addProduct(code);
                    if (added) setCode("");
                }}>
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
                    <tr key={item.productId}>
                        <td>{item.code || "Sin código"}</td>
                        <td>{item.description}</td>
                        <td>{formatPrice(item.unitPrice)}</td>
                        <td>
                        <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                            onBlur={(e) => handleQuantityBlur(item.productId, e.target.value)}
                        />
                        </td>
                        <td>{formatPrice(item.subtotal)}</td>
                        <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.productId)}>
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
                    disabled={!sale.items.length}
                    onClick={() => setConfirming(true)} 
                >
                    Finalizar venta
                </button>

                <ConfirmModal
                    open={confirming}
                    total={sale.total}
                    onCancel={() => setConfirming(false)}
                    onConfirm={async () => {
                        const finalized = await finalizeSale();
                        if (finalized) setConfirming(false);
                    }}
                />

            </div>
        </div>

    </div>
    );
}