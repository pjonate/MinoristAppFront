import "../styles/venta.css"
import { React, useState, useEffect, useRef } from 'react';
import Select from "react-select";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { apiFetch } from "../services/apiFetch";

const Venta = ()=>{ //COMPOMENTE VENTA

    //formatio de peso chileno
    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    });

    const hoy = new Date(); //fecha de hoy
    const fechaFormateada = hoy.toLocaleDateString("es-CL"); // formato día/mes/año

    const [codigo, setCodigo] = useState("");//hook de codigo
    const [producto, setProducto] = useState("");//hook de producto
    const [sugerencias, setSugerencias] = useState([]);//hook de sugerencias

    const [cantidad, setCantidad] = useState(0);//hook de cantidad de productos
    const [precio, setPrecio] = useState(0);//hook de precios

    const [ventas, setVentas] = useState([//hook de ventas acumuladas
        //{ id: 1, producto: "Pan", cantidad: 2, precio: 1000 },
        //{ id: 2, producto: "Leche", cantidad: 1, precio: 1200 },
    ]);

    const [productos, setProductos] = useState([]);//para el autorelleno ??

    //Efecto que se llama en el primer renderizado del componente. Trae todos los productos que estan en inventario
    useEffect(() => {
        apiFetch("/api/products")
        .then(res => res.json())
        .then(data => setProductos(data.data))
        .catch(err => console.error(err));
    }, []);

    const [editingProduct, setEditingProduct] = useState(false); //estado de edicion de producto, inhabilitado por defecto
    const [editingCodigo, setEditingCodigo] = useState(false); //estado de edicion de codigo, inhabilitado por defecto

    const origenCambio = useRef(null); // "producto" | "codigo"

    //Efecto para sugerencias de productos
    useEffect(() => {
        if (origenCambio.current !== "producto") return;

        if (!producto.trim()) {
            setSugerencias([]);
            return;
        }
        const texto = producto.toLocaleLowerCase();

        const parciales = productos.filter(p =>
            p.descripcion.toLowerCase().includes(texto)
        )

        setSugerencias(parciales.slice(0, 5));

        // Coincidencia exacta
        const exacto = productos.find(p =>
            p.descripcion.toLowerCase() === texto
        );

        if (exacto) {
            setPrecio(exacto.precio);
            setCodigo(exacto.codigo);
            setProducto(exacto.descripcion);
            setSugerencias([]);
        } else {
            setCodigo("");
            setPrecio(0);
            setCantidad(0);
        }

    }, [producto, productos]); //aunque productos no cambie, en la practica es bueno dejarlo

    //Efecto para codigo
    useEffect(()=>{
        if (origenCambio.current !== "codigo") return;
        console.log(productos);
        const exacto = productos.find(p=>
            p.codigo===codigo
        )

        if(exacto) {
            setCodigo(exacto.codigo);
            setPrecio(exacto.precio);
            setProducto(exacto.descripcion);
        } else{
            setProducto("");
            setPrecio(0);
            setCantidad(0);
        }
    }, [codigo, productos]);


    const handleAgregar = () => {
        if (!codigo || !producto || cantidad <= 0 || precio <= 0) {
            toast.error("Completa todos los campos correctamente");
            return;
        }

        const nuevaVenta = {
            id: ventas.length + 1,
            codigo,
            producto,
            cantidad: Number(cantidad),
            precio: Number(precio),
        };

        setVentas(prev => [...prev, nuevaVenta]); // ✅ añade una nueva fila
        setCodigo("");
        setProducto("");
        setPrecio(0);
        setCantidad(1);
    };

    const handleAceptar = async() => {

        const total = ventas.reduce((acc, venta) => acc + venta.cantidad * venta.precio, 0);

        Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, estoy seguro!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        '¡Hecho!',
                        'La compra ha sido confirmada.',
                        'success'
                    );
                    // Aquí puedes realizar la acción que corresponde a la confirmación de la compra
                } else {
                    Swal.fire(
                        'Cancelado',
                        'La compra ha sido cancelada.',
                        'error'
                    );
                }
            });

        const ventaResponse = await apiFetch('/api/venta', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: new Date().toISOString().split("T")[0],
                total: total
            }),
        });

        const sale = await ventaResponse.json();

        console.log(sale);

        await Promise.all(
        ventas.map((v) =>
            apiFetch('/api/detail', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_venta: sale.venta.id_sale,
                    id_producto: v.codigo,
                    cantidad: v.cantidad,
                    subtotal: v.precio*v.cantidad,
                }),
            })
        )
        );

        // --- Limpia todos los datos de la venta ---
        setVentas([]); // <-- Aquí vacías la tabla de productos
        setCantidad(0);
        console.log("Venta realizada y datos borrados.");
    }

    const seleccionarProducto = (item) => {
        setProducto(item.descripcion);
        setSugerencias([]);

    // Aquí puedes agregarlo a tu tabla de ventas si quieres
    // agregarProductoALaVenta(item);
    };

    return (
        <div className="container">
            <div className="row">

                <div className="col-md-12">
                    <div className="grid search">
                        <div className="grid-body">
                        <div className="row">
            
                            <div className="col-md-11">
                            <h2>
                                <i className="fa fa-file-o"></i> Venta
                            </h2>
                            <hr />
                            {/* Body */}
                            <div className="card-body">

                            {/* Fecha */}
                            <div className="row mb-4">
                                <div className="col-md-4">
                                <label className="form-label">Fecha</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value="12/02/2026"
                                    readOnly
                                />
                                </div>
                            </div>

                            {/* Tabla */}
                            <div className="table-responsive">
                                <table className="table table-bordered align-middle text-center">
                                <thead className="table-light">
                                    <tr>
                                    <th>Código</th>
                                    <th>Producto</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Total</th>
                                    <th>Acción</th>
                                    </tr>

                                    {/* Fila de ingreso */}
                                    <tr>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Código"
                                            value={codigo}
                                            onChange={e =>{ 
                                                origenCambio.current = "codigo";
                                                setCodigo(e.target.value)
                                            }} />
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Producto"
                                            value={producto}
                                            onChange={e => {
                                                origenCambio.current = "producto";
                                                setProducto(e.target.value);
                                            }}/>
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Precio" 
                                            value={formatoCLP.format(precio)} readOnly />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            placeholder="Cantidad" 
                                            value={cantidad}
                                            onChange={e => setCantidad(e.target.value)}/>
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Total" 
                                            value={formatoCLP.format(cantidad * precio)} readOnly />
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-sm"
                                            style={{backgroundColor:"#e8d9c4", color: "#000"}}
                                            onClick={handleAgregar} 
                                        >
                                        Agregar
                                        </button>
                                    </td>
                                    </tr>
                                </thead>

                                <tbody>
                                    {ventas.length > 0 ? (
                                        ventas.map((v, i) => (
                                        <tr key={i}>
                                            <td>{v.codigo}</td>
                                            <td>{v.producto}</td>
                                            <td>{v.cantidad}</td>
                                            <td>{formatoCLP.format(v.precio)}</td>
                                            <td>{formatoCLP.format(v.cantidad * v.precio)}</td>
                                            <td>
                                            <button onClick={() => setVentas(ventas.filter((x) => x.id !== v.id))}>
                                                Eliminar
                                            </button>
                                            </td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#555" }}>
                                            Ingrese productos
                                        </td>
                                        </tr>
                                    )}
                                </tbody>

                                <tfoot className="table-light">
                                    <tr>
                                    <td colSpan="4" className="text-end fw-bold">
                                        Total general:
                                    </td>
                                    <td className="fw-bold">
                                        {formatoCLP.format(ventas.reduce((acc, venta) => acc + venta.cantidad * venta.precio, 0))}
                                    </td>
                                    <td>
                                        <button className="btn btn-outline-secondary btn-sm">
                                        Cancelar
                                        </button>
                                    </td>
                                    </tr>
                                </tfoot>

                                </table>
                            </div>

                            {/* Botón final */}
                            <div className="d-flex justify-content-end mt-3">
                                <button 
                                    className="btn btn-buscar"
                                    style={{backgroundColor:"#e8d9c4", color: "#000"}}
                                    onClick={handleAceptar}>
                                Aceptar compra
                                </button>
                            </div>

                            </div>

                            </div>
                        </div>
                        </div>
                    </div>
            </div>
            </div>
            

        </div>
    );
};


export default Venta;