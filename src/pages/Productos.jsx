import { React, useEffect, useState } from 'react';
import apiAxios from '../services/apiAxios';
import "../styles/prueba.css";

const Productos = () => {

    const [products, setProducts] = useState([]);//Estado para productos, es una lista
    

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [searchCode, setSearchCode] = useState("");

    useEffect(() => {
        fetchProducts(page, searchName, searchCode);
    }, [page]);


    const handleSearch = () => {
        setPage(1);
        fetchProducts(1, searchName);
    };

    const handleSearchCode = () => {
        setPage(1);
        fetchProducts(1, searchName, searchCode);
    };

    const fetchProducts = async (
        pageNumber = 1,
        name = "",
        code = ""
    ) => {
        try {
            const response = await apiAxios.get(
                `api/products?page=${pageNumber}&name=${name}&code=${code}`
            );

            setProducts(response.data.data);
            setLastPage(response.data.last_page);

        } catch (error) {
            console.error(error);
        }
    };



    //modalAgregarProducto
    const [showModal, setShowModal] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [proveedor, setProveedor] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [tipo, setTipo] = useState("unidad");

    const handleSaveProduct = async () => {
        if (!descripcion || !precio) {
            alert("Descripción y precio son obligatorios");
            return;
        }

        const payload = {
            codigo,
            categoria,
            descripcion,
            proveedor,
            precio,
            stock,
            tipo
        };

        try {
            const response = await apiAxios.post("/api/product", payload,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            );

            console.log("Producto creado:", response.data);

            setShowModal(false);

            // limpiar formulario
            setCodigo("");
            setDescripcion("");
            setCategoria("");
            setProveedor("");
            setPrecio("");
            setStock("");
            setTipo(true);

        } catch (error) {
            console.error("Error al crear producto", error);
            alert("No se pudo crear el producto");
        }
    };



  return (
    <div className="container">
      <div className="row">

        {/* SEARCH RESULT */}
        <div className="col-md-12">
          <div className="grid search">
            <div className="grid-body">
              <div className="row">

                {/* FILTERS 
                <div className="col-md-3">
                  <h2 className="grid-title">
                    <i className="fa fa-filter"></i> Filtros
                  </h2>
                  <hr />
                  {[
                    "Categoría",
                    "Proveedor",
                  ].map((cat) => (
                    <div className="checkbox" key={cat}>
                      <label>
                        <input type="checkbox" /> {cat}
                      </label>
                    </div>
                  ))}

                  <div className="mt-3"></div>

                  <h4 className="mt-3">Por precio:</h4>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="2000"
                  />
                </div>    
                */}
                {/* RESULTS */}
                <div className="col-md-11">
                  <h2>
                    <i className="fa fa-file-o"></i> Productos
                  </h2>
                  <hr />

                {/* SEARCH INPUTS */}
                <div className="row mb-3 align-items-center">

                {/* Buscador por nombre */}
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar producto por nombre..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <button
                            className="btn btn-buscar"
                            onClick={handleSearch}
                        >
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>

                {/* Buscador por código */}
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar producto por código..."
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                        />
                        <button
                            className="btn btn-buscar"
                            onClick={handleSearchCode}
                        >
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>

                </div>

                  <div style={{paddingBottom:"20px"}}>
                    <button
                            className="btn btn-buscar"
                            color='#9c6b4f'
                            onClick={() => setShowModal(true)}
                        >
                            + Agregar producto
                    </button>
                  </div>

                  <p>Mostrando resultados</p>

                  {/* TABLE RESULT */}
                  <div className="table-responsive">
                    <table className="table table-hover">
                        <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                            <td className="text-center">{p.id}</td>

                            <td>
                                <img
                                //src={p.img ?? "https://via.placeholder.com/400x300"}
                                //alt={p.name}
                                //width="100"
                                />
                            </td>

                            <td className="position-relative overflow-visible">
                            <div className="product-hover">
                                <strong>{p.descripcion}</strong>
                                <br />
                                Stock: {p.stock ?? 0}

                                <div className="product-tooltip">
                                <p><strong>Codigo:</strong> {p.codigo}</p>
                                <p><strong>Precio:</strong> ${Number(p.precio).toLocaleString("es-CL", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                })}</p>
                                <p><strong>Stock:</strong> {p.stock}</p>
                                <p><strong>Categoría:</strong> {p.categoria}</p>
                                <p><strong>Descripción:</strong> {p.descripcion}</p>
                                </div>
                            </div>
                            </td>

                            <td className="text-end">
                            ${Number(p.precio).toLocaleString("es-CL", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                  </div>

                    {/* PAGINATION */}
                    <ul className="pagination">

                    {/* Anterior */}
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button
                        className="page-link"
                        onClick={() => {
                            if (page > 1) setPage(page - 1);
                        }}
                        >
                        «
                        </button>
                    </li>

                    {/* Números dinámicos */}
                    {[...Array(lastPage)].map((_, index) => {
                        const pageNumber = index + 1;

                        return (
                        <li
                            key={pageNumber}
                            className={`page-item ${page === pageNumber ? "active" : ""}`}
                        >
                            <button
                            className="page-link"
                            onClick={() => setPage(pageNumber)}
                            >
                            {pageNumber}
                            </button>
                        </li>
                        );
                    })}

                    {/* Siguiente */}
                    <li className={`page-item ${page === lastPage ? "disabled" : ""}`}>
                        <button
                        className="page-link"
                        onClick={() => {
                            if (page < lastPage) setPage(page + 1);
                        }}
                        >
                        »
                        </button>
                    </li>

                    </ul>

                </div>
                {/* END RESULTS */}

              </div>
            </div>
          </div>
        </div>
        {/* END SEARCH RESULT */}

      </div>
        {showModal && (
        <div
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            }}
        >
            <div
            style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                minWidth: "340px",
            }}
            >
            <h5 className="mb-3">Agregar producto</h5>

            <div className="mb-2">
                <label className="form-label">Código</label>
                <input
                type="text"
                className="form-control"
                placeholder="Código de barras / SKU"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Descripción</label>
                <input
                type="text"
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Categoría</label>
                <input
                type="text"
                className="form-control"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Proveedor</label>
                <input
                type="text"
                className="form-control"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                />
            </div>

            <div className="mb-2">
                <label className="form-label">Precio</label>
                <input
                type="number"
                className="form-control"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Stock</label>
                <input
                type="number"
                className="form-control"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                />
            </div>

            <div className="form-check mb-3">
            <input
                className="form-check-input"
                type="checkbox"
                checked={tipo === 'gramo'}
                onChange={(e) =>
                setTipo(e.target.checked ? 'gramo' : 'unidad')
                }
            />
            <label className="form-check-label">
                Venta por gramo
            </label>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    >
                    Cancelar
                </button>

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleSaveProduct}
                >
                Guardar
                </button>
            </div>
            </div>
        </div>
        )}

    </div>
  );
};

export default Productos;
