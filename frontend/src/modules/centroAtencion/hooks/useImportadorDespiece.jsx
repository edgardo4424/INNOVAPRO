import { useState } from "react";
import { read, utils } from "xlsx";
import Papa from "papaparse";
import { XMLParser } from "fast-xml-parser";
import api from "@/shared/services/api";
import { toast } from "react-toastify";

export default function useImportadorDespiece({ tarea, setFormDataExterno }) {
  const [formDataInterno, setFormDataInterno] = useState({ despiece: [], resumenDespiece: {} });
  const setFormData = setFormDataExterno || setFormDataInterno;

  const limpiarArchivo = () => {
    setFormData({ despiece: [], resumenDespiece: {} });
  };

  const procesarArchivo = async (file, ext) => {
    if (["xls", "xlsx"].includes(ext)) return await handleExcelUpload(file);
    if (ext === "csv") return await handleCsv(file);
    if (ext === "xml") return await handleXml(file);
  };

  const handleExcelUpload = async (file) => {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    const workbook = read(data, { type: "array" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const dataJson = utils.sheet_to_json(hoja);
    return mapearDespiece(dataJson);
  };

  const handleCsv = async (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => mapearDespiece(results.data).then(resolve),
        error: reject,
      });
    });
  };

  const handleXml = async (file) => {
    const text = await file.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(text);
    console.log("XML Importado:", json);
  };

  const mapearDespiece = async (rawData) => {
    const piezasBD = (await api.get("/piezas")).data;

    const errores = [];
    const despieceLimpio = rawData.map((dato, index) => {
      const codigo = (dato["ITEM"] || "").trim();
      const cantidadStr = (dato["CANTIDAD"] || "").toString().trim();

      if (!codigo || !cantidadStr) {
        errores.push(`Fila ${index + 2}: Falta ITEM o CANTIDAD.`);
        return null;
      }

      const cantidad = parseFloat(cantidadStr);
      if (isNaN(cantidad) || cantidad <= 0) {
        errores.push(`Fila ${index + 2}: Cantidad inválida "${cantidadStr}".`);
        return null;
      }

      const pieza = piezasBD.find((p) => p.item === codigo);
      if (!pieza) {
        errores.push(`Fila ${index + 2}: No se encontró la pieza con ITEM "${codigo}".`);
        return null;
      }

      const precioUnit = parseFloat(pieza.precio_alquiler_soles || 0);
      const peso = parseFloat(pieza.peso_kg || 0);

      return {
        pieza_id: pieza.id,
        item: pieza.item,
        descripcion: pieza.descripcion,
        cantidad,
        peso_kg: (cantidad * peso).toFixed(2),
        precio_venta_dolares: (cantidad * parseFloat(pieza.precio_venta_dolares || 0)).toFixed(2),
        precio_venta_soles: (cantidad * parseFloat(pieza.precio_venta_soles || 0)).toFixed(2),
        precio_alquiler_soles: (cantidad * precioUnit).toFixed(2),
        precio_unitario: precioUnit,
      };
    }).filter(Boolean);

    if (errores.length > 0) {
      toast.error(
        <>
          <strong>Errores en el archivo:</strong>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {errores.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </>,
        { autoClose: false }
      );
      setFormData({ despiece: [], resumenDespiece: {} });
      return;
    }

    const resumen = {
      total_piezas: despieceLimpio.reduce((acc, p) => acc + p.cantidad, 0),
      peso_total_kg: despieceLimpio.reduce((acc, p) => acc + parseFloat(p.peso_kg), 0).toFixed(2),
      peso_total_ton: (
        despieceLimpio.reduce((acc, p) => acc + parseFloat(p.peso_kg), 0) / 1000
      ).toFixed(2),
      precio_subtotal_alquiler_soles: despieceLimpio
        .reduce((acc, p) => acc + parseFloat(p.precio_alquiler_soles), 0)
        .toFixed(2),
    };

    setFormData({ despiece: despieceLimpio, resumenDespiece: resumen });
  };

  return {
    formData: formDataInterno,
    procesarArchivo,
    limpiarArchivo,
  };
}