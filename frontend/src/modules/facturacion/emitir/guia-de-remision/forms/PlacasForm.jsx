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
import vehiculoService from "@/modules/transporte/service/VehiculosService";

import { useEffect, useState } from "react";
const PlacasForm = ({ closeModal }) => {
  const { setGuiaDatosPublico, setGuiaTransporte } = useGuiaTransporte();
  const [listaVehiculos, setListaVehiculos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [plasmarChofer, setPlasmarChofer] = useState(true);
  const [plasmarTransportista, setPlasmarTransportista] = useState(true);

  const buscarVehiculos = async () => {
    try {
      const { data, success } = await vehiculoService.listar();
      if (success) {
        setListaVehiculos(data);
      }
    } catch (error) {
      toast.error("Error al cargar vehículos");
    }
  };

  useEffect(() => {
    buscarVehiculos();
  }, []);

  const listaFiltrada = listaVehiculos.filter((item) => {
    const texto = filtro.toLowerCase();
    return (
      item.nro_placa?.toLowerCase().includes(texto) ||
      item?.transportista?.razon_social?.toLowerCase().includes(texto) ||
      item?.transportista?.nro_doc?.toLowerCase().includes(texto) ||
      item?.chofere?.nombres?.toLowerCase().includes(texto) ||
      item?.chofere?.apellidos?.toLowerCase().includes(texto) ||
      item?.chofere?.nro_doc?.toLowerCase().includes(texto)
    );
  });

  const plasmar = (item) => {
    if (plasmarChofer && item.chofere) {
      setGuiaTransporte((prevGuiaTransporte) => ({
        ...prevGuiaTransporte,
        chofer: [
          {
            ...item.chofere,
            tipo: "Principal",
          },
        ],
      }));
    }
    if (plasmarTransportista && item.transportista) {
      setGuiaDatosPublico((prevGuiaPublico) => ({
        ...prevGuiaPublico,
        transportista: {
          ...item.transportista,
          tipo_doc: "6",
        },
      }));
    }
    setGuiaTransporte((prevGuiaTransporte) => ({
      ...prevGuiaTransporte,
      guia_Envio_Vehiculo_Placa: item.nro_placa,
    }));
    closeModal();
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

        {/* Checks de opciones */}
        <div className="flex items-center justify-around gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={plasmarChofer}
              onChange={(e) => setPlasmarChofer(e.target.checked)}
            />
            <span>Chofer</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={plasmarTransportista}
              onChange={(e) => setPlasmarTransportista(e.target.checked)}
            />
            <span>Transportista</span>
          </label>
        </div>
      </div>

      {/* 📋 Tabla */}
      <div className="mt-4 w-full overflow-x-auto">
        <div className="max-h-[300px] overflow-y-auto">
          <Table className="border-2 border-gray-200">
            <TableHeader className="border-b-2 border-gray-400 bg-gray-100">
              <TableRow>
                <TableHead className="w-[120px]">Placa</TableHead>
                <TableHead>Transportista</TableHead>
                <TableHead>Mtc</TableHead>
                <TableHead>Chofer</TableHead>
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
                    <TableCell>{item.nro_placa || "N/A"}</TableCell>
                    <TableCell className={"max-w-sm whitespace-normal"}>
                      {item?.transportista?.razon_Social || "N/A"}
                    </TableCell>
                    <TableCell>
                      {item?.transportista?.nro_mtc || "N/A"}
                    </TableCell>
                    <TableCell>{item?.chofere?.nombres || "N/A"}</TableCell>
                    <TableCell>
                      {item?.chofere?.licencia || "N/A"}
                    </TableCell>
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

export default PlacasForm;
