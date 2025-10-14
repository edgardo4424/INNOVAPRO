import { Button } from "@/components/ui/button";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";

const ExportExcel = ({ hojas, nombreArchivo = "exportacion.xlsx" }) => {
  const exportarExcel = () => {
    if (!Array.isArray(hojas) || hojas.length === 0) {
      console.warn("No se proporcionaron hojas para exportar");
      return;
    }

    const wb = XLSX.utils.book_new();

    hojas.forEach(
      ({ nombre_libro, datos, columnas = [], excluir = [] }, index) => {
        if (!Array.isArray(datos)) {
          console.warn(`Datos inválidos para la hoja "${nombre_libro}"`);
          return;
        }

        const primeraFila = datos[0];
        if (!primeraFila) {
          console.warn(`La hoja "${nombre_libro}" está vacía.`);
          return;
        }

        // 1. Obtener todas las claves visibles
        const todasLasClaves = Object.keys(primeraFila).filter(
          (key) => !excluir.includes(key),
        );

        // 2. Crear mapa de { key => label }
        const mapaEtiquetas = columnas.reduce((acc, col) => {
          acc[col.key] = col.label || col.key;
          return acc;
        }, {});

        // 3. Normalizar datos (solo claves visibles)
        const datosFiltrados = datos.map((row) => {
          const nuevo = {};
          todasLasClaves.forEach((key) => {
            nuevo[key] = row[key];
          });
          return nuevo;
        });

         // 4. Crear hoja vacía con headers personalizados
        const ws = XLSX.utils.json_to_sheet([], { header: todasLasClaves });

        // 5. Agregar encabezados legibles a la fila 1 (A1)
        const encabezadosVisibles = todasLasClaves.map(
          (key) => mapaEtiquetas[key] || key
        );
        XLSX.utils.sheet_add_aoa(ws, [encabezadosVisibles], { origin: "A1" });

         // 6. Agregar datos a partir de la fila 2 (A2)
        XLSX.utils.sheet_add_json(ws, datosFiltrados, {
          header: todasLasClaves,
          skipHeader: true,
          origin: "A2",
        });

         // 7. Agregar la hoja al libro
        XLSX.utils.book_append_sheet(
          wb,
          ws,
          nombre_libro || `Hoja${index + 1}`,
        );
      },
    );

    XLSX.writeFile(wb, nombreArchivo);
  };

  return <Button onClick={exportarExcel} size={"lg"} className="bg-green-700 text-white hover:bg-green-600 self-end mr-7 ">
    <FaFileExcel/> <span>Exportar a Excel</span>
  </Button>;
};

export default ExportExcel;
