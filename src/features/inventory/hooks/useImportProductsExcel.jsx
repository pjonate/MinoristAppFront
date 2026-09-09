import { useState } from "react";
import * as XLSX from "xlsx";
import { importProductsExcelService } from "../services/importProductsExcelServices";
import { useAuth } from "../../context/authContext";

export const EXPECTED_HEADERS = [
  "codigo",
  "descripcion",
  "categoria",
  "proveedor",
  "precio",
  "stock"
];

export const normalizeImportedProducts = (rows = []) => {
  return rows.map((row) => ({
    codigo: String(row.codigo ?? "").trim(),
    descripcion: String(row.descripcion ?? "").trim(),
    categoria: String(row.categoria ?? "").trim(),
    proveedor: String(row.proveedor ?? "").trim(),
    precio: Number(row.precio),
    stock: Number(row.stock)
  }));
};

export const parseExcelRows = async (file) => {
  if (!file) {
    throw new Error("No se seleccionó ningún archivo.");
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    throw new Error("El archivo Excel no tiene hojas válidas.");
  }

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
    raw: false
  });

  if (!rows.length) {
    throw new Error("El archivo Excel está vacío.");
  }

  const normalizedKeys = Object.keys(rows[0]).map((key) => String(key).trim().toLowerCase());
  const missingHeaders = EXPECTED_HEADERS.filter((header) => !normalizedKeys.includes(header));

  if (missingHeaders.length) {
    throw new Error(`Faltan columnas requeridas: ${missingHeaders.join(", ")}`);
  }

  return rows;
};

export const useImportProductsExcel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const importProducts = async (rows) => {
    try {
      setLoading(true);
      setError(null);

      const normalizedProducts = normalizeImportedProducts(rows);
      const data = await importProductsExcelService(normalizedProducts, token);

      return data;
    } catch (err) {
      setError(err.message || "Error al importar productos");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const importProductsFromFile = async (file) => {
    const rows = await parseExcelRows(file);
    return importProducts(rows);
  };

  return {
    importProducts,
    importProductsFromFile,
    loading,
    error
  };
};
