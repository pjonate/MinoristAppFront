import { InventoryTable } from "../components/InventoryTable";
import { TitleInventory } from "../components/TitleInventory";
import { AddProductModal } from "../components/addProductModal";
import { ImportExcelModal } from "../components/importExcelModal";
import { useAddProduct } from "../hooks/useAddProduct";
import { useImportProductsExcel } from "../hooks/useImportProductsExcel";
import { useState } from "react";

export const InventoryPage = () =>{

    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isImportExcelOpen, setIsImportExcelOpen] = useState(false);

    const { addProduct } = useAddProduct();
    const { importProductsFromFile, loading: importingExcel } = useImportProductsExcel();

    const handleCreateProduct = async (product) => {
        try {
            await addProduct(product);

            setIsAddProductOpen(false);

        } catch (err) {
            console.error("Error al crear producto:", err.message);
        }
    };

    const handleImportExcelFile = async (file) => {
        try {
            await importProductsFromFile(file);
            setIsImportExcelOpen(false);
        } catch (err) {
            console.error("Error al importar Excel:", err.message);
            throw err;
        }
    };

    return(
        <div>
        <div className="d-flex align-items-center">
            <TitleInventory />

            <div className="ms-auto d-flex gap-2 me-3">
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsAddProductOpen(true)}
                >
                    Añadir producto
                </button>

                <AddProductModal
                    open={isAddProductOpen}
                    onClose={() => setIsAddProductOpen(false)}
                    onSave={handleCreateProduct}
                />

                <button 
                    className="btn btn-secondary"
                    onClick={() => setIsImportExcelOpen(true)}
                >
                    Exportar (Excel)
                </button>

                <ImportExcelModal
                    open={isImportExcelOpen}
                    onClose={() => setIsImportExcelOpen(false)}
                    onImport={handleImportExcelFile}
                    loading={importingExcel}
                />
            </div>
        </div>

        <InventoryTable />
        </div>
    )
}

