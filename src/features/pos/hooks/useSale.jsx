import { useState } from "react"
import { getProductByCodeService } from "../services/SaleServices";
import { searchProductsService } from "../services/SaleServices";
import { createSaleService } from "../services/SaleServices";
import { useAuth } from "../../context/authContext";

export const useSale = () =>{

    const { token } = useAuth();

    const [errorGetProduct, setErrorGetProduct] = useState("");

    const [sale, setSale] = useState({
        total: 0,
        items: []
    });

    const addProduct = async (value) => {

        const searchValue = value.trim();

        if (!searchValue) {
            setErrorGetProduct("Ingresa un código o nombre de producto");
            return;
        }

        let product;

        try {
            try {
                product = await getProductByCodeService(searchValue, token);
            } catch (codeError) {
                if (codeError.code !== "PRODUCT_NOT_FOUND") {
                    throw codeError;
                }

                const products = await searchProductsService(searchValue, token);
                const exactMatch = products.find(
                    item => item.descripcion.trim().toLowerCase() === searchValue.toLowerCase()
                );

                if (exactMatch) {
                    product = exactMatch;
                } else if (products.length === 1) {
                    product = products[0];
                } else if (products.length > 1) {
                    setErrorGetProduct("Hay varios productos con ese nombre. Escribe un nombre más específico.");
                    return;
                } else {
                    setErrorGetProduct("Producto no encontrado");
                    return;
                }
            }
        } catch (err) {
            const errorMessages = {
                PRODUCT_NOT_FOUND: "Producto no encontrado",
                OUT_OF_STOCK: "Producto sin stock",
                AUTH_REQUIRED: "Tu sesión expiró. Inicia sesión nuevamente",
                FORBIDDEN: "No tienes permisos para consultar productos",
                SERVER_ERROR: "Error del servidor al consultar el producto",
                NETWORK_ERROR: "No se pudo conectar con el servidor"
            };

            setErrorGetProduct(errorMessages[err.code] || err.message || "Error al consultar el producto");
            return;
        }

        if (product.stock <= 0) {
            setErrorGetProduct("Producto sin stock");
            return;
        }

        const cleanCode = product.codigo;

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

        // 🟢 CASO 2: no existe → agregar el producto encontrado
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