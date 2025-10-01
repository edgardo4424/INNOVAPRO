import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import vehiculoService from "@/modules/transporte/service/VehiculosService";
import { CarFront, X } from "lucide-react";
import { useEffect, useState } from "react";
import PlacasForm from "../../forms/PlacasForm";

export default function ModalPlacas({ open, setOpen }) {
  const { setGuiaDatosPublico, setGuiaTransporte } = useGuiaTransporte();
  const [listaVehiculos, setListaVehiculos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [plasmarChofer, setPlasmarChofer] = useState(true);
  const [plasmarTransportista, setPlasmarTransportista] = useState(true);

  const closeModal = () => {
    setOpen(false);
  };

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
    closeModal(); // opcional: cerrar modal después de seleccionar
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-start justify-start md:items-end">
        <AlertDialogTrigger asChild>
          <Button className="text-innova-blue size-[10px] cursor-pointer bg-white hover:scale-105 hover:bg-white hover:text-blue-500">
            <span className="flex text-xs">
              <CarFront className="size-5" />
            </span>
          </Button>
        </AlertDialogTrigger>
      </div>
      <AlertDialogContent className="flex flex-col gap-4 md:min-w-3xl">
        {/* ❌ Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
          onClick={closeModal}
        >
          <X />
        </button>

        {/* 🧾 Encabezado */}
        <AlertDialogHeader>
          <AlertDialogTitle>
            Lista de Placas, Transportistas, Choferes
          </AlertDialogTitle>
          <AlertDialogDescription className="hidden text-center md:block">
            Al seleccionar una fila, se plasmará la información según los
            checkboxes seleccionados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <PlacasForm  closeModal={closeModal}/>
      </AlertDialogContent>
    </AlertDialog>
  );
}
