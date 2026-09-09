import { normalizeImportedProducts } from "./useImportProductsExcel";

describe("normalizeImportedProducts", () => {
  it("debe convertir filas de Excel a objetos con los campos esperados", () => {
    const rows = [
      {
        codigo: "A-001",
        descripcion: "Pan integral",
        categoria: "Panadería",
        proveedor: "Proveedor 1",
        precio: "120.50",
        stock: "25"
      },
      {
        codigo: "A-002",
        descripcion: "Galleta",
        categoria: "Repostería",
        proveedor: "Proveedor 2",
        precio: "85",
        stock: "10"
      }
    ];

    expect(normalizeImportedProducts(rows)).toEqual([
      {
        codigo: "A-001",
        descripcion: "Pan integral",
        categoria: "Panadería",
        proveedor: "Proveedor 1",
        precio: 120.5,
        stock: 25
      },
      {
        codigo: "A-002",
        descripcion: "Galleta",
        categoria: "Repostería",
        proveedor: "Proveedor 2",
        precio: 85,
        stock: 10
      }
    ]);
  });
});
