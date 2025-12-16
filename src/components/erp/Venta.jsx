import "../../styles/styles.css"
import { FaArrowLeft } from 'react-icons/fa';
import { React, useState, useEffect } from 'react';
import Select from "react-select";
import Swal from 'sweetalert2';

const Venta = ()=>{ //COMPOMENTE VENTA
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
        fetch("api/products")
        .then(res => res.json())
        .then(data => setProductos(data))
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
        alert("Completa todos los campos correctamente.");
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

        const ventaResponse = await fetch('/api/venta', {
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
            fetch('/api/detail', {
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

    return(
      <div>   
        <header
          style={{
          backgroundColor: "#d7d428",
          width: "100%",
          height: "75px",
          display: "flex",
          alignItems: "center"
        }}
        >
          <text
            className='text-header'
            style={{
              padding:"0px 15px"
            }}
          >
            MinoristApp
          </text>

          <FaArrowLeft 
            size={36} 
            style={{ 
              cursor: "pointer", 
              marginRight: "2rem", 
              marginLeft: "auto",
              color: "white",
            }} 
            onClick={() => window.history.back()} 
          />
        </header>     

        <div style={{display:"flex"}}>
          <aside style={{backgroundColor: "#e1e1e1", width: "180px", height: "calc(100vh - 75px)"}}></aside> 
          
          <main
            style={{
              flex:1,
              display: "flex",
              flexDirection:"column"
            }}
          >
            <h4 style={{padding:"15px 75px"}}>Venta</h4>
            
            <div 
                style={{
                    padding:"0px 75px",
                }}
            >
                <span>
                    Fecha
                </span>
                <input 
                    style={{
                        flex: 1,
                        marginLeft:"10px"
                    }}
                    type="text" 
                    value={fechaFormateada} 
                    readOnly 
                />

            </div>
            
            <div
                style={{
                    //height: "400px",
                    paddingTop:"20px",
                    paddingLeft:"75px",
                    display:"flex",
                    //alignItems:"center",
                    flexDirection:"column",
                    //justifyContent:"center",
                    //textAlign:"center",
                }}
            >
                <table
                    style={{
                        width: "1000px",
                        //height:"400px",
                        //borderCollapse: "collapse",
                        textAlign: "center",
                        backgroundColor:"#ffffff",
                        border: "1px solid #000", 
                        
                    }}
                >
                    <thead style={{ backgroundColor: "#dad87aff", color: "#fff" }}>
                        <tr>
                            <th style={{ border: "1px solid #000", padding: "8px", width: "100px" }}>Código</th>
                            <th style={{ border: "1px solid #000", padding: "8px", width: "150px" }}>Producto</th>
                            <th style={{ border: "1px solid #000", padding: "8px", width: "20px" }}>Precio</th>
                            <th style={{ border: "1px solid #000", padding: "8px", width: "20px" }}>Cantidad</th>
                            <th style={{ border: "1px solid #000", padding: "8px", width: "20px" }}>Total</th>
                            <th style={{ border: "1px solid #000", padding: "8px", width: "20px" }}>Acción</th>
                        </tr>
                        {/* 👇 Fila para ingresar datos */}
                        <tr style={{backgroundColor:"#f1f1f1ff"}}>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>
                                <input 
                                    type="text" 
                                    style={{ width: "90%" }} 
                                    placeholder="Código" 
                                    value={codigo}
                                    onChange={e =>{ 
                                        origenCambio.current = "codigo";
                                        setCodigo(e.target.value)
                                    }} />
                            </td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>
                                <div style={{ position: "relative", width: "90%" }}>
                                    <input 
                                        type="text" 
                                        style={{ width: "100%" }} 
                                        placeholder="Producto"
                                        value={producto}
                                        onChange={e => {
                                            origenCambio.current = "producto";
                                            setProducto(e.target.value);
                                        }}
                                        onBlur={() => setTimeout(() => setSugerencias([]), 200)} 
                                    />

                                    {sugerencias.length > 0 && (
                                        <ul
                                            style={{
                                                position: "absolute",
                                                top: "100%",        // 👈 queda justo debajo del input
                                                left: 0,
                                                width: "100%",      // 👈 igual ancho que el input
                                                background: "white",
                                                border: "1px solid #999",
                                                borderRadius: "4px",
                                                listStyle: "none",
                                                padding: "0",
                                                margin: "2px 0 0 0",
                                                maxHeight: "150px",
                                                overflowY: "auto",
                                                zIndex: 100,
                                                color: "black",     // 👈 AQUI
                                            }}
                                        >
                                            {sugerencias.map((s) => (
                                                <li
                                                    key={s.id}
                                                    onClick={() => {
                                                        setCodigo(s.codigo);
                                                        setProducto(s.descripcion);
                                                        setPrecio(s.precio);
                                                        setSugerencias([]);
                                                    }}
                                                    style={{
                                                        padding: "6px 10px",
                                                        cursor: "pointer",
                                                        borderBottom: "1px solid #eee",
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                                                >
                                                    {s.descripcion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </td>

                            <td style={{ border: "1px solid #000", padding: "6px" }}>
                                <input 
                                    type="number" 
                                    style={{ width: "90%" }} 
                                    placeholder="Precio"
                                    value={precio}
                                    readOnly />
                            </td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>
                                <input 
                                    type="number" 
                                    style={{ width: "90%" }} 
                                    placeholder="Cantidad"
                                    value={cantidad}
                                    onChange={e=>setCantidad(e.target.value)} />
                            </td>
                            <td style={{ border: "1px solid #483232ff", padding: "6px" }}>
                                <input 
                                    type="number" 
                                    style={{ width: "90%" }} 
                                    placeholder="Total"
                                    value={cantidad * precio} 
                                    readOnly />
                            </td>
                            <td style={{ border: "1px solid #000", padding: "6px" }}>
                                <button onClick={handleAgregar} >Agregar</button>
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
                                <td>{v.precio}</td>
                                <td>{v.cantidad * v.precio}</td>
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

                    {/* 👇 Sección de totales */}
                    <tfoot style={{ backgroundColor: "#f4f4f4" }}>
                        <tr>
                            <td colSpan="4" style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>
                                <b>Total general:</b>
                            </td>
                            <td style={{ border: "1px solid #000", padding: "8px", fontWeight: "bold" }}>
                                {ventas.reduce((acc, venta) => acc + venta.cantidad * venta.precio, 0)}
                            </td>
                            <td style={{ border: "1px solid #000", padding: "8px", fontWeight: "bold" }}>
                                <button>Cancelar</button>
                            </td>                            
                        </tr>
                    </tfoot>

                </table>    
                
                <div
                    style={{
                        textAlign:"right",
                        //alignItems:"center",
                        //justifyContent:"center",
                    }}
                >
                    <button 
                        onClick={handleAceptar}
                        style={{
                            marginTop:"10px", 
                            textAlign:"right", 
                            marginRight:"100px"}}
                            >Aceptar compra
                    </button>
                </div>
                       
            </div>

          </main>

          <aside style={{backgroundColor: "#e1e1e1", width: "180px", height: "calc(100vh - 75px)"}}></aside> 

        </div>  
      </div>        
    )
}

export default Venta;