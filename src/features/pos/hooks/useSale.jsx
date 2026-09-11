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

    const getTotal = (items) => items.reduce(
        (acc, item) => acc + (Number(item.subtotal) || 0),
        0
    );

    const addProduct = async (value) => {

        const searchValue = String(value ?? "").trim();

        if (!searchValue) {
            setErrorGetProduct("Ingresa un código o nombre de producto");
            return false;
        }

        setErrorGetProduct("");

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
                    return false;
                } else {
                    setErrorGetProduct("Producto no encontrado");
                    return false;
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
            return false;
        }

        if (product.stock <= 0) {
            setErrorGetProduct("Producto sin stock");
            return false;
        }

        const cleanCode = product.codigo;

        // Decide against the latest cart state to avoid duplicate lines on fast scans.
        setSale(prev => {
            const existing = prev.items.find(item => item.code === cleanCode);
            let items;

            if (existing) {
                const quantity = Number(existing.quantity) || 0;

                if (quantity >= existing.stock) {
                    return prev;
                }

                items = prev.items.map(item => item.code === cleanCode
                    ? {
                        ...item,
                        quantity: quantity + 1,
                        subtotal: (quantity + 1) * item.unitPrice
                    }
                    : item
                );
            } else {
            const newItem = {
                code: product.codigo,
                description: product.descripcion,
                quantity: 1,
                unitPrice: product.precio,
                subtotal: product.precio,
                stock: product.stock // 🔥 necesario
            };

                items = [...prev.items, newItem];
            }

            return { ...prev, items, total: getTotal(items) };
        });

        return true;
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

        const total = getTotal(items);

        return {
        ...prev,
        items,
        total
        };
    });
    };

    
    const handleQuantityBlur = (code, value) => {
        let quantity = parseInt(value);

        if (isNaN(quantity) || quantity <= 0) quantity = 1;

        setSale(prev => {
            const items = prev.items.map(item =>
            item.code === code
                ? {
                    ...item,
                    quantity: Math.min(quantity, item.stock),
                    subtotal: Math.min(quantity, item.stock) * item.unitPrice
                }
                : item
            );

            const total = getTotal(items);

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

            const total = getTotal(items);

            return {
                ...prev,
                items,
                total
            };
        });
    };


    const finalizeSale = async () => {
        if (!sale.items.length) {
            setErrorGetProduct("El carrito está vacío");
            return false;
        }

        try {
            const response = await createSaleService(sale, token);

            // limpiar carrito
            setSale({
                items: [],
                total: 0
            });
            console.log("RESPUESTA:", response); 
            return true;

        } catch (err) {
            setErrorGetProduct(err.message || "Error al registrar la venta");
            return false;
        }


    };

    return { sale, addProduct, handleQuantityChange, handleQuantityBlur, removeItem, errorGetProduct, setErrorGetProduct, finalizeSale }

}