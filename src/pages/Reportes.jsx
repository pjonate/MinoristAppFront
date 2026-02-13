import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";
import { apiFetch } from "../services/apiFetch";

export default function Reportes() {

  // helper: parse 'YYYY-MM-DD' or 'YYYY-MM' safely to local Date or month parts
  function parseDateLocal(value) {
    if (!value) return null;

    // si viene 'YYYY-MM-DD'
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d); // mes 0-based -> crea fecha local a medianoche
    }

    // si viene 'YYYY-MM' devolvemos null (no Date exacta), el formateo mensual usará partes
    return null;
  }

  // --- helpers: meses en español ---
  const monthNames = [
    "enero","feb","marzo","abril","mayo","jun",
    "jul","ag","sept","oct","nov","dic"
  ];

  const formatXAxisLabel = (value, periodo) => {
    if (!value) return "";

    if (periodo === "semana") {
      const d = parseDateLocal(value);
      if (!d || isNaN(d)) return value;
      // formato corto: "20/11" o "20-11"
      return d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" });
      // si quieres nombre corto del día: d.toLocaleDateString("es-CL",{ weekday: "short", day: "2-digit"})
    }

    /*
    if (periodo === "mes") {
      const parts = String(value).split("-");
      if (parts.length < 2) return value;
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const monthName = monthNames[monthIndex] || parts[1];
      return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`;
    }

    return value;*/
  };

  const formatTooltipLabel = (value, periodo) => {
    if (!value) return "";
    if (periodo === "semana") {
      const d = parseDateLocal(value);
      if (!d || isNaN(d)) return value;
      return d.toLocaleDateString("es-CL", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
    }
    if (periodo === "mes") {
      const parts = String(value).split("-");
      if (parts.length < 2) return value;
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const monthName = monthNames[monthIndex] || parts[1];
      return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`;
    }
    return value;
  };


  const [periodoRentable, setPeriodoRentable] = useState('semana'); // valor inicial
  const [datosGraficoRentable, setDatosGraficoRentable] = useState([]);

  const [periodoVentas, setPeriodoVentas] = useState('semana'); // valor inicial
  const [datosGraficoVentas, setDatosGraficoVentas] = useState([]);

  // Función para obtener datos del backend
  const ProductosMasRentables = async () => {
    try {
      const responseRentables = await apiFetch(`/api/report/productos-mas-rentables?periodo=${periodoRentable}`);
      const dataRentables = await responseRentables.json();
      setDatosGraficoRentable(dataRentables); // actualizar el estado
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  // useEffect que se ejecuta cada vez que cambia el periodo
  useEffect(() => {
    ProductosMasRentables();
  }, [periodoRentable]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0];

      // Convertir a número real (quita ".00")
      const valor = Number(item.value);

      return (
        <div
          style={{
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "13px"
          }}
        >
          <div><strong>Producto:</strong> {label}</div>
          <div>
            <strong>Total de ventas:</strong>{" "}
            {valor.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipVentas = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = Number(payload[0].value);

      return (
        <div
          style={{
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        >
          <div><strong>Fecha:</strong> {label}</div>

          <div>
            <strong>Total ventas:</strong>{" "}
            {total.toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
      );
    }
    return null;
  };


  // Función para obtener ventas diarias del backend
  const VentasDiarias = async () => {
    try {
      const responseVentas = await apiFetch(`/api/report/ventas-diarias?periodo=${periodoVentas}`);
      const dataVentas = await responseVentas.json();
      console.log("Ventas diarias ↓↓↓");
      console.log(dataVentas);
      console.log("Fin ventas diarias ↑↑↑");
      const normalizado = dataVentas.map(item => ({
        label: item.fecha ?? item.mes,
        total_ventas: Number(item.total_ventas)
      }));
      setDatosGraficoVentas(normalizado);
    } catch (error) {
      console.error("Error al obtener ventas diarias:", error);
    }
  };

  useEffect(() => {
    VentasDiarias();
  }, [periodoVentas]);

  const [productosStockBajo, setProductosStockBajo] = useState([]);

  const obtenerProductosStockBajo = async () => {
    try {
      const response = await apiFetch("/api/report/productos-stock-bajo");
      const data = await response.json();
      setProductosStockBajo(data);
    } catch (error) {
      console.error("Error al obtener productos de bajo stock:", error);
    }
  };

  useEffect(() => {
    obtenerProductosStockBajo();
  }, []);

  const [productosAntiguos, setProductosAntiguos] = useState([]);

  const obtenerProductosAntiguos = async () => {
    try {
      const responseAntiguos = await apiFetch("/api/report/productos-sin-ventas");
      const dataAntiguos = await responseAntiguos.json();
      console.log("Antiguos");
      console.log(dataAntiguos)
      setProductosAntiguos(dataAntiguos);
    } catch (error) {
      console.error("Error obteniendo productos antiguos:", error);
    }
  };

  useEffect(() => {
    obtenerProductosAntiguos();
  }, []);

  return (
      <div className="container">
        <div className="row">

            <div className="col-md-12">
                <div className="grid search">
                    <div className="grid-body">
                      <div className="row">
            
                        <div className="col-md-11">
                        <h2>
                            <i className="fa fa-file-o"></i> Reportes
                        </h2>
                        <hr />
        
                        {/* MAIN */}
                        <main
                          style={{
                            flex: 1,
                            padding: "15px 40px",
                          }}
                        >
                          <h2 style={{ marginBottom: "15px", fontSize: "20px" }}>
                            Reportes
                          </h2>

                          {/* FILA SUPERIOR */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1.5fr 2fr", // izquierda más angosta, derecha más ancha
                              gap: "12px",
                              marginBottom: "15px",
                            }}
                          >
                            {/* IZQUIERDA: GRÁFICO DE BARRAS (más angosto) */}
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: "14px",
                                borderRadius: "12px",
                                height: "300px",
                                width:"500px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <h4 style={{ margin: 0, fontSize: "16px" }}>
                                Productos que generan más ganancias
                              </h4>

                              <select
                                style={{ margin: "6px 0" }}
                                value={periodoRentable}
                                onChange={(e) => setPeriodoRentable(e.target.value)}
                              >
                                <option value="semana">Semana</option>
                                <option value="mes">Mes</option>
                                <option value="todos">Todos los tiempos</option>
                              </select>

                              <div style={{ color: "gray", marginTop: "10px", width: "100%", height: "400px" }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={datosGraficoRentable}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                      dataKey="descripcion"
                                      tick={false}          // oculta los nombres individuales
                                      label={{
                                        value: "Productos", // 👈 texto debajo del eje
                                        position: "insideBottom",
                                        offset: -5,
                                        dy: -10 
                                      }}
                                    />
                                    <YAxis
                                      tickFormatter={(value) =>
                                        value.toLocaleString("es-CL", { 
                                          style: "currency", 
                                          currency: "CLP", 
                                          maximumFractionDigits: 0 // opcional: sin decimales
                                        })
                                      }
                                      tick={{ fontSize: 11 }} 
                                    >
                                    </YAxis>

                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ display: "none" }} />
                                    
                                    {/* barra principal */}
                                    <Bar dataKey="total_ventas" fill="#8884d8" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* DERECHA COMPLETA: GRÁFICO LINEAL MÁS ALTO Y MÁS ANCHO */}
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: "14px",
                                borderRadius: "12px",
                                height: "300px",       // más alto
                                width:"500px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <h4 style={{ margin: 0, fontSize: "16px" }}>Ventas por semana</h4>

                              <select
                                style={{ margin: "6px 0" }}
                                value={periodoVentas}
                                onChange={(e) => setPeriodoVentas(e.target.value)}
                              >
                                <option value="semana">Semana</option>
                                <option value="mes">Mes</option>
                              </select>
                              <div style={{ width: "90%", margin: "0 auto" }}>
                                <ResponsiveContainer width="100%" height={200}>
                                  <LineChart 
                                    data={datosGraficoVentas}
                                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    {/* XAxis usa dataKey="label" y el tickFormatter que depende del periodo */}
                                    <XAxis
                                      dataKey="label"
                                      tickFormatter={(v) => {
                                        console.log("Tick recibido:", v)
                                        return formatXAxisLabel(v, periodoVentas)
                                      }}
                                      //tickFormatter={(v) => formatXAxisLabel(v, periodoVentas)}//ticks son los elementos que se muestrane en el
                                      //eje X, tickFormater es un parametro que define como se mostraran los ticks
                                      //v: es el valor original del tick
                                      //formatXAxisLabel: es la funcion que cambia ese tick
                                      //periodoVentas: parametro que servira para el cambio de vision en el tcik
                                      interval={0}                 /* forzar mostrar todas las etiquetas (ajusta si se enciman) */
                                      tick={periodoVentas === "mes" ? false : { fontSize: 11 }}
                                      label={
                                        periodoVentas === "mes"
                                          ? { value: "Meses", position: "insideBottom", dy: 5 }
                                          : null
                                      }
                                    />

                                    <YAxis
                                      tickFormatter={(value) =>
                                        value.toLocaleString("es-CL", { 
                                          style: "currency", 
                                          currency: "CLP", 
                                          maximumFractionDigits: 0 // opcional: sin decimales
                                        })
                                      }
                                      tick={{ fontSize: 11 }} 
                                    >
                                    </YAxis>

                                    <Tooltip content={<CustomTooltipVentas />} />

                                    <Line
                                      type="monotone"
                                      dataKey="total_ventas"
                                      stroke="#8884d8"
                                      strokeWidth={3}
                                      dot={{ r: 4 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>

                            </div>
                          </div>

                          {/* FILA INFERIOR (igual que antes) */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "12px",
                            }}
                          >
                            {/* IZQUIERDA: STOCK BAJO */}
                            <div
                              style={{
                                //width:"600px",
                                backgroundColor: "white",
                                padding: "12px",
                                borderRadius: "12px",
                                height: "220px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                              }}
                            >
                              <h4 style={{ fontSize: "16px", margin: 0 }}>
                                Productos con stock bajo
                              </h4>

                              <table
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                  marginTop: "8px",
                                  fontSize: "14px",
                                }}
                              >
                                <thead style={{ backgroundColor: "#e8d9c4" }}>
                                  <tr>
                                    <th style={{ width: "70%", border: "1px solid #000", padding: "4px" }}>
                                      Producto
                                    </th>
                                    <th style={{ width: "30%", border: "1px solid #000", padding: "4px" }}>
                                      Stock
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {productosStockBajo.map((p) => (
                                    <tr key={p.id}>
                                      <td style={{ width: "70%", border: "1px solid #000", padding: "4px" }}>{p.descripcion}</td>
                                      <td style={{ width:"30%", border: "1px solid #000", padding: "4px" }}>{p.stock}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* DERECHA: PRODUCTOS ANTIGUOS */}
                            <div
                              style={{
                                //width:"500px",
                                backgroundColor: "white",
                                padding: "12px",
                                borderRadius: "12px",
                                height: "220px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                              }}
                            >
                              <h4 style={{ fontSize: "16px", margin: 0 }}>
                                Productos sin vender hace más tiempo
                              </h4>

                              <table
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                  marginTop: "8px",
                                  fontSize: "14px",
                                }}
                              >
                                <thead style={{ backgroundColor: "#e8d9c4"  }}>
                                  <tr>
                                    <th style={{ width: "50%", border: "1px solid #000", padding: "4px" }}>Producto</th>
                                    <th style={{ width: "25%", border: "1px solid #000", padding: "4px" }}>Última venta</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {productosAntiguos.map((p) => (
                                    <tr key={p.id}>
                                      <td style={{ border: "1px solid #000", padding: "4px" }}>{p.descripcion}</td>

                                      <td style={{ border: "1px solid #000", padding: "4px" }}>
                                        {p.ultima_venta ? new Date(p.ultima_venta).toLocaleDateString("es-CL") : "Nunca vendido"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                            </div>
                          </div>
                        </main>
              </div>
            </div>                    
          </div>
        </div>
      </div>
      </div>  
    </div>
  );
}
