import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import choferService from "@/modules/transporte/service/ChoferService";
import vehiculoService from "@/modules/transporte/service/VehiculosService";

import { useEffect, useState } from "react";
const ChoferForm = ({ closeModal }) => {
  const { setGuiaDatosPublico, setGuiaTransporte } = useGuiaTransporte();
  const [listaChoferes, setListaChoferes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [plasmarChofer, setPlasmarChofer] = useState(true);

  const buscarChoferes = async () => {
    try {
      const { data, success } = await choferService.listar();
      if (success) {
        setListaChoferes(data);
      }
    } catch (error) {
      toast.error("Error al cargar Vehículos");
    }
  };

  useEffect(() => {
    buscarChoferes();
  }, []);

  const listaFiltrada = listaChoferes.filter((item) => {
    const texto = filtro.toLowerCase();
    return (
      item?.nombres?.toLowerCase().includes(texto) ||
      item?.apellidos?.razon_social?.toLowerCase().includes(texto) ||
      item?.nro_doc?.nro_doc?.toLowerCase().includes(texto) ||
      item?.nro_licencia?.nombres?.toLowerCase().includes(texto)
    );
  });

  const plasmar = (item) => {
    if (plasmarChofer && item) {
      setGuiaTransporte((prevGuiaTransporte) => ({
        ...prevGuiaTransporte,
        chofer: [
          {
            tipo_doc: item?.tipo_doc,
            nro_doc: item?.nro_doc,
            licencia: item?.nro_licencia,
            nombres: item?.nombres,
            apellidos: item?.apellidos,
            tipo: "Principal",
          },
        ],
      }));
      closeModal();
    }
  };

  return (
    <div>
      {/* 🧩 Filtro y Checks */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="col-span-1 flex flex-col gap-1">
          <Label>Buscar por placa</Label>
          <Input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Ej: placa"
            className="border-1 border-gray-400"
          />
        </div>
      </div>

      {/* 📋 Tabla */}
      <div className="mt-4 w-full overflow-x-auto">
        <div className="max-h-[300px] overflow-y-auto">
          <Table className="border-2 border-gray-200">
            <TableHeader className="border-b-2 border-gray-400 bg-gray-100">
              <TableRow>
                <TableHead className="w-[120px]">Nombres</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Licencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-gray-200">
              {listaFiltrada.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-gray-500 italic"
                  >
                    ⚠️ No hay Vehículos.
                  </TableCell>
                </TableRow>
              ) : (
                listaFiltrada.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => plasmar(item)}
                    className="cursor-pointer hover:bg-gray-300"
                  >
                    <TableCell>{item.nombres || "N/A"}</TableCell>
                    <TableCell className={"max-w-sm whitespace-normal"}>
                      {item?.apellidos || "N/A"}
                    </TableCell>
                    <TableCell>{item?.nro_doc || "N/A"}</TableCell>
                    <TableCell>{item?.nro_licencia || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ChoferForm;
