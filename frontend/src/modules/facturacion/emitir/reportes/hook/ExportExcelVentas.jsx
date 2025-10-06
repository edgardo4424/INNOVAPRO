import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportExcelVentas = ({ nombreArchivo, hojas }) => {
  const handleExport = () => {
    if (!hojas || !hojas.datos) return;

    // 1. Mapear los datos con las columnas definidas
    const worksheetData = hojas.datos.map((row) => {
      const fila = {};
      hojas.columnas.forEach((col) => {
        fila[col.label] = row[col.key] ?? "";
      });
      return fila;
    });

    // 2. Crear hoja y libro
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, hojas.nombre_libro || "Reporte");

    // 3. Generar y descargar
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, nombreArchivo || "Reporte.xlsx");
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
    >
      📊 Exportar Excel
    </button>
  );
};

export default ExportExcelVentas;
