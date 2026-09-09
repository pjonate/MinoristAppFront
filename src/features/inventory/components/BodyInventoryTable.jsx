import { useState } from "react";
import { EditProductModal } from "./editProductModal";
import { useUpdateProduct } from "../hooks/useUpdateProduct";

export const BodyInventoryTable = ({ products = [] }) => {

    const formatPrice = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(value);
    };


    //editProduct estados
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { updateProduct } = useUpdateProduct();

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    const handleUpdateProduct = async (product) => {
        try {
            await updateProduct(product);

        } catch (err) {
            console.error(err.message);
        }
    };

    /* CASO 1: Hay productos cargados en la venta*/
    if (products.length > 0) {
        return products.map((item) => (
            <tr key={item.codigo} className="align-middle">
                <td>{item.codigo}</td>
                <td>{item.descripcion}</td>
                <td>{item.categoria}</td>
                <td>{formatPrice(item.precio)}</td>
                <td>{item.stock}</td>
                <td>
                    <div className="d-flex gap-1">
                        <button 
                            className="btn btn-warning btn-sm" 
                            title="Editar"
                            onClick={() => handleEditClick(item)}
                        >
                            <i className="bi bi-pencil-square"></i>
                        </button>



                        <button 
                            className="btn btn-danger btn-sm" 
                            title="Eliminar"
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
                <EditProductModal
                    open={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onUpdate={handleUpdateProduct}
                    product={selectedProduct}
                />
            </tr>
        ));
    }

    /*/ CASO 2: Si hubo una búsqueda pero no se encontró nada (opcional)
    if (searchError) {
        return (
        <tr>
            <td colSpan="6" className="py-5 text-center text-danger">
            <i className="bi bi-exclamation-circle fs-1"></i>
            <p className="mt-2 fw-bold">Producto no encontrado</p>
            </td>
        </tr>
        );
    }*/

    // CASO 3: ESTADO POR DEFECTO (El que tú pides)
    return (
        <tr>
        <td colSpan="7" className="py-5 text-center">
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '180px' }}>
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" 
                style={{ width: '60px', height: '60px' }}>
                <span style={{ fontSize: '1.5rem' }}>🔍</span>
            </div>
            <h5 className="text-secondary fw-bold">Ingresa el producto a buscar</h5>
            <p className="text-muted small">
                Ingrese el código o nombre de un producto <br />
                para comenzar la busqueda.
            </p>
            </div>
        </td>
        </tr>
    );
    };

    /*/ LUEGO EN TU JSX SIMPLEMENTE LLAMAS A LA FUNCIÓN:
    return (
    <table className="table">
        <thead>{/* ... }</thead>
        <tbody>
        {renderTableBody()}
        </tbody>
    </table>
);*/