import { useState } from "react"
import { getProductByCodeService } from "../services/SaleServices";
import { createSaleService } from "../services/SaleServices";
import { useAuth } from "../../context/authContext";
import { getErrorMessage } from "../../../global/errors/getErrorMessage";

export const useSale = () =>{

    const { token } = useAuth();

    const [errorGetProduct, setErrorGetProduct] = useState("");

    const [sale, setSale] = useState({
        total: 0,
        items: []
    });

    const addProduct = async (code) => {

        const cleanCode = code.trim();

        // 🔍 1. revisar estado ACTUAL (no dentro de setSale)
        const existing = sale.items.find(item => item.code === cleanCode);

        // 🔴 CASO 1: ya existe → NO llamar backend
        if (existing) {

            // validar stock
            if (existing.quantity >= existing.stock) {
                console.log("No hay más stock disponible");
                return;
            }

            // actualizar localmente
            setSale(prev => {
            const items = prev.items.map(item =>
                item.code === cleanCode
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    subtotal: (item.quantity + 1) * item.unitPrice
                    }
                : item
            );

            const total = items.reduce((acc, i) => acc + i.subtotal, 0);

            return { ...prev, items, total };
            });

            return; // 🔥 corta ejecución
        }

        // 🟢 CASO 2: no existe → llamar service
        try {
            const product = await getProductByCodeService(cleanCode, token);

            setSale(prev => {
            const newItem = {
                code: product.codigo,
                description: product.descripcion,
                quantity: 1,
                unitPrice: product.precio,
                subtotal: product.precio,
                stock: product.stock // 🔥 necesario
            };

            const items = [...prev.items, newItem];
            const total = items.reduce((acc, i) => acc + i.subtotal, 0);

            return { ...prev, items, total };
            });

        } catch (err) {
            console.log("Producto no encontrado");
        }
    };

    const handleQuantityChange = (code, value) => {

    // ✅ permitir borrar el input
    if (value === "") {
        setSale(prev => {
        const items = prev.items.map(item =>
            item.code === code
            ? { ...item, quantity: "" }
            : item
        );

        return { ...prev, items };
        });
        return;
    }

    const quantity = parseInt(value);

    // ❌ si no es número, no hagas nada
    if (isNaN(quantity)) return;

    setSale(prev => {
        const items = prev.items.map(item => {
        if (item.code === code) {

            // 🔒 mínimo 1
            let safeQuantity = Math.max(1, quantity);

            // 🔴 VALIDACIÓN DE STOCK
            if (safeQuantity > item.stock) {
                console.log(`Stock máximo: ${item.stock}`);
                safeQuantity = item.stock;
            }

            return {
            ...item,
            quantity: safeQuantity,
            subtotal: safeQuantity * item.unitPrice
            };
        }

        return item;
        });

        const total = items.reduce((acc, i) => acc + i.subtotal, 0);

        return {
        ...prev,
        items,
        total
        };
    });
    };

    
    const handleQuantityBlur = (code, value) => {
        let quantity = parseInt(value);

        if (isNaN(quantity) || quantity <= 0) {
            quantity = 1;
        }

        setSale(prev => {
            const items = prev.items.map(item =>
            item.code === code
                ? {
                    ...item,
                    quantity,
                    subtotal: quantity * item.unitPrice
                }
                : item
            );

            const total = items.reduce((acc, i) => acc + i.subtotal, 0);

            return {
            ...prev,
            items,
            total
            };
        });
    };

    const removeItem = (code) => {
        setSale(prev => {
            const items = prev.items.filter(item => item.code !== code);

            const total = items.reduce((acc, i) => acc + i.subtotal, 0);

            return {
                ...prev,
                items,
                total
            };
        });
    };


    const finalizeSale = async () => {
        try {
            const response = await createSaleService(sale, token);

            // limpiar carrito
            setSale({
                items: [],
                total: 0
            });
            console.log("RESPUESTA:", response); 
            //toast.success("Venta registrada");

        } catch (err) {
            //toast.error(err.response?.data?.error || "Error al registrar venta");
            console.log("error");
        }


    };

    return { sale, addProduct, handleQuantityChange, handleQuantityBlur, removeItem, errorGetProduct, setErrorGetProduct, finalizeSale }

}