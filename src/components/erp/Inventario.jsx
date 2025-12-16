import { useState, useEffect } from "react"; //useState es un hook que permite a los componentes funcionales renderizarse en función de los 
//cambios en los estados (variables o espacios de memoria especiales dentro de un componente)
//useEffect es un hook que se ejcuta despues de cada render que el componente haga
import axios from "axios";//biblioteca de JS para realizar peticiones HTTP
import { FaArrowLeft } from 'react-icons/fa';//icono de flecha de React

const Inventario= () =>{//componente Inventario

  const [products, setProducts] = useState([]);//Estado para productos, es una lista
  
    useEffect(() => {
        fetchProducts();//Cada vez que se renderiza Inventario, se buscan los productos en la base de datos
    }, []);//este useEffect solo se ejecuta en el render inicial

  const fetchProducts = async () => {
    try {
      const response = await axios.get("api/products");
      setProducts(response.data); // guarda los productos en el estado. Se renderiza el componente nuevamente
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const [codigo, setCodigo] = useState('');//Estado para codgio, es una cadena
  const [descripcion, setDescripcion] = useState('');//Estado para descripcion, es una cadena
  const [categoria, setCategoria] = useState('');//estado para categoria, es una cadena
  const [proveedor, setProveedor] = useState('');//estado para proveedor, es una cadena
  const [precio, setPrecio] = useState();//estado para precio, esta vacios
  const [stock, setStock] = useState();//estado para stock, esta vacio

  const [modalOpen, setModalOpen] = useState(false);//estado modalOpen????, es un booleano
  const [productoEditando, setProductoEditando] = useState(null);//estado para editar producto, esta vacio
  const [formData, setFormData] = useState({//estado para formData, guarda los datos del producto
    codigo: "",
    descripcion: "",
    categoria: "",
    proveedor: "",
    precio: "",
    stock: ""
  });



  const handleSubmit = async(e)=>{//controlador de boton "Aceptar"
    e.preventDefault();

    try{
        const response = await axios.post('api/product', {//peticion para agregar un producto
            codigo,
            descripcion,
            categoria,
            proveedor,
            precio,
            stock
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        setCodigo("");
        setDescripcion("");
        setCategoria("");
        setProveedor("");
        setPrecio(0);
        setStock(0);

        fetchProducts();//al pulasr aceptar, se guardan el producto en la bd, y se vuelve a renderizas en fetchProducts;
    }catch(error){
        console.error(error);
        //alert('❌ Error al registrar');
    }

  }

  const handleEliminar = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    // Actualizar tabla
    setProducts(products.filter(p => p.id !== id));//se renderiza el componente, con la nueva lista de productos
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error eliminando el producto");
      }

      alert("Producto eliminado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  const handleEditar = (prod) => {
    setProductoEditando(prod.id);  // guardamos ID del producto que se edita
    setFormData({
      codigo: prod.codigo,
      descripcion: prod.descripcion,
      categoria: prod.categoria,
      proveedor: prod.proveedor,
      precio: prod.precio,
      stock: prod.stock
    });
    setModalOpen(true);
  };


  const guardarCambios = async () => {
    const actualizado = {
      id: productoEditando,
      ...formData,

      precio: Number(formData.precio),
      stock: Number(formData.stock)
    };

    // 👉 Guardar en tu backend (si tienes API)
    await fetch(`/api/product/${productoEditando}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizado)
    });

    // 👉 Actualizar lista local
    setProducts((prev) =>
      prev.map((p) => (p.id === productoEditando ? actualizado : p))
    );

    // 👉 Limpiar edición
    setProductoEditando(null);
    setModalOpen(false);
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
              display:"flex",
              //maxHeight:"200px",  
              flex:1,
              flexDirection:"column",
              padding:"15px 75px"
            }}
          >
                <h4 style={{paddingBottom:"20px"}}>Gestión de inventario</h4>
                <form onSubmit={handleSubmit} style={{maxHeight: "500px", overflowY: "auto"}}>
                    <table
                        style={{
                            //display: "block",
                            //maxHeight: "400px",
                            width: "1000px",//ancho
                            //height:"500px",//alto
                            textAlign: "center",//se ubica en el centro del form
                            backgroundColor:"#ffffff",//fondo color blanco
                            border: "1px solid #000",//se desraca el borde
                            borderCollapse: "collapse",//cada celda no tiene borde
                            margin: "auto",//espacio automatico
                            fontFamily: "sans-serif", // tipo de letra
                        }} 
                    >
                        <thead style={{ backgroundColor: "#dad87aff", color: "#fff" }}>
                            <tr>
                                <th style={{ border: "1px solid #000", padding: "8px", width: "150px" }}>Código</th>
                                <th style={{ border: "1px solid #000", padding: "8px", width: "150px" }}>Descripción</th>
                                <th style={{ border: "1px solid #000", padding: "8px", width: "20px" }}>Categoria</th>
                                <th style={{ border: "1px solid #000", padding: "8px", width: "20px" }}>Proveedor</th>
                                <th style={{ border: "1px solid #000", padding: "8px", width: "20px" }}>Precio</th>
                                <th style={{ border: "1px solid #000", padding: "8px", width: "20px" }}>Stock</th>
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
                                        onChange={(e) => setCodigo(e.target.value)}/>
                                </td>
                                <td style={{ border: "1px solid #000", padding: "6px" }}>
                                    <input 
                                        type="text" 
                                        style={{ width: "90%" }} 
                                        placeholder="Descripción" 
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}/>
                                </td>
                                <td style={{ border: "1px solid #000", padding: "6px" }}>
                                    <input 
                                        type="text" 
                                        style={{ width: "90%" }} 
                                        placeholder="Categoría" 
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value)}/>
                                </td>
                                <td style={{ border: "1px solid #000", padding: "6px" }}>
                                    <input 
                                        type="text" 
                                        style={{ width: "90%" }} 
                                        placeholder="Proveedor" 
                                        value={proveedor}
                                        onChange={(e) => setProveedor(e.target.value)}/>
                                </td>
                                <td style={{ border: "1px solid #000", padding: "6px" }}>
                                    <input 
                                        type="number" 
                                        style={{ width: "90%" }} 
                                        placeholder="Precio" 
                                        value ={precio}
                                        onChange={(e) => setPrecio(e.target.value)} />
                                </td>
                                <td style={{ border: "1px solid #000", padding: "6px" }}>
                                    <input 
                                        type="number" 
                                        style={{ width: "90%" }} 
                                        placeholder="Stock" 
                                        value = {stock} 
                                        onChange={(e) => setStock(e.target.value)} />
                                </td>
                                <td style={{ border: "1px solid #000", padding: "6px" }}>
                                    <button type="submit">Añadir</button>
                                </td>
                                {/*<td style={{ border: "1px solid #000", padding: "6px" }}>
                                    <button>Agregar</button>
                                </td>*/}
                            </tr>
                        </thead>

                        {/*<form id="nuevoProducto" method="POST" action=""></form>*/}

                        

                        <tbody style={{
                            //display: "block",         // 👈 Esto permite que height funcione
                            //height: "auto",          // 👈 Alto fijo del área de datos
                            maxHeight: "400px", // 👈 altura máxima
                            overflowY: "auto", // 👈 scroll cuando se pasa del límite
                        }}>
                                {products.length >0 ? (
                                    products.map((prod) => (
                                        <tr style={{
                                                //display: "table",
                                                //width: "150px",
                                                height: "auto",
                                                border: "1px solid #000", 
                                                padding: "2px 6px", 
                                                lineHeight: "1.2" }} 
                                            //la key debe ser id. Así se evitan errores en el DOM
                                            key={prod.id}> 
                                            <td style={{
                                                //width:"150px",
                                                //height:"auto",
                                                border: "1px solid #000", 
                                                padding: "0", 
                                                lineHeight: "1.2" }}>{prod.codigo}</td>
                                            <td style={{
                                                border: "1px solid #000", 
                                                padding: "0",
                                                lineHeight: "1.2" }}>{prod.descripcion}</td>
                                            <td style={{
                                                border: "1px solid #000", 
                                                padding: "0", 
                                                lineHeight: "1.2" }}>{prod.categoria}</td>
                                            <td style={{
                                                border: "1px solid #000", 
                                                padding: "0", 
                                                lineHeight: "1.2" }}>{prod.proveedor}</td>
                                            <td style={{
                                                border: "1px solid #000", 
                                                padding: "0", 
                                                lineHeight: "1.2" }}>{prod.precio}</td>
                                            <td style={{
                                                border: "1px solid #000", 
                                                padding: "0", 
                                                lineHeight: "1.2" }}>{prod.stock}</td>

                                            {/* --- NUEVA COLUMNA DE ACCIONES --- */}
                                            <td
                                              style={{
                                                border: "1px solid #000",
                                                padding: "4px",
                                                //display: "flex",
                                                //gap: "4px",
                                                lineHeight: "1.2",
                                                justifyContent: "center",
                                              }}
                                            >
                                              {/* Botón Editar */}
                                              <button
                                                style={{
                                                  backgroundColor: "#4caf50",
                                                  color: "white",
                                                  border: "none",
                                                  padding: "4px 6px",
                                                  fontSize: "12px",
                                                  cursor: "pointer",
                                                  borderRadius: "3px",
                                                }}
                                                onClick={() => handleEditar(prod)}
                                              >
                                                Editar
                                              </button>

                                              {/* Botón Eliminar */}
                                              <button
                                                style={{
                                                  backgroundColor: "#f44336",
                                                  color: "white",
                                                  border: "none",
                                                  padding: "4px 6px",
                                                  fontSize: "12px",
                                                  cursor: "pointer",
                                                  borderRadius: "3px",
                                                }}
                                                onClick={() => handleEliminar(prod.id)}
                                              >
                                                Eliminar
                                              </button>
                                            </td>                                                
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">No hay productos registrados</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </form>
          </main>

          <aside style={{backgroundColor: "#e1e1e1", width: "180px", height: "calc(100vh - 75px)"}}></aside> 

        </div>
        {modalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backdropFilter: "blur(2px)",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                animation: "fadeIn 0.2s ease",
              }}
            >
              <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
                Editar producto
              </h3>

              <label style={{ fontSize: "14px", fontWeight: 600 }}>Código</label>
              <input
                type="text"
                value={formData.codigo}
                placeholder="Código"
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
              />

              <label style={{ fontSize: "14px", fontWeight: 600 }}>Descripción</label>
              <input
                type="text"
                value={formData.descripcion}
                placeholder="Descripción"
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />

              <label style={{ fontSize: "14px", fontWeight: 600 }}>Categoria</label>
              <input
                type="text"
                value={formData.categoria}
                placeholder="Categoría"
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
              />

              <label style={{ fontSize: "14px", fontWeight: 600 }}>Proveedor</label>
              <input
                type="text"
                value={formData.proveedor}
                placeholder="Proveedor"
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                onChange={(e) =>
                  setFormData({ ...formData, proveedor: e.target.value })
                }
              />

              <label style={{ fontSize: "14px", fontWeight: 600 }}>Precio</label>
              <input
                type="number"
                value={formData.precio}
                placeholder="Precio"
                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
              />

              <label style={{ fontSize: "14px", fontWeight: 600 }}>Stock</label>
              <input
                type="number"
                value={formData.stock}
                placeholder="Stock"
                style={{ width: "100%", marginBottom: "15px", padding: "8px" }}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setModalOpen(false);
                    setProductoEditando(null);
                  }}
                >
                  Cancelar
                </button>

                <button
                  style={{
                    backgroundColor: "#4caf50",
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={guardarCambios}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
}

export default Inventario;