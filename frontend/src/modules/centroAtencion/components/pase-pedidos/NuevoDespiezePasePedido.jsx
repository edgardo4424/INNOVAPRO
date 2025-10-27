import { Button } from "@/components/ui/button";
import ExcelUploader from "@/modules/facturacion/emitir/guia-de-remision/components/ExcelUploader";
import { SaveAll } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import procesarPiezas from "../../hooks/useProcesarPiezas";
import centroAtencionService from "../../services/centroAtencionService";
import DespieceOtPasePedidos from "./DespieceOtPasePedidos";
import ModalVerificarGuardado from "../modal/ModalVerificarGuardado";

const NuevoDespiezePasePedido = ({ idDespiece, setActNuevoDespiece }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [piezasObtenidas, setPiezasObtenidas] = useState([]);
  const [formData, setFormData] = useState({
    despiece: [],
    ResumenDespiece: {},
  });

  const handleExcelDataLoaded = (data) => {
    setExcelData(data.data);
  };

  const HandleActualizarDespieze = async () => {
    try {
      console.log("despiece", formData.despiece);
      console.log("idDespiece", idDespiece);
      const { anterior, nuevas, status, success } =
        await centroAtencionService.actualizarDespiece(idDespiece, {
          despiece: formData.despiece,
        });
      if (success) {
        toast.success("Despiece actualizado");
        setActNuevoDespiece(false);
      }
    } catch (error) {
      toast.error("Ocurrio un error al actualizar el despiece");
    }
  };

  const handleSubirDatos = () => {
    if (!excelData || !excelData.length) {
      toast.warn("Primero carga un Excel con piezas.");
      return;
    }

    const { despiece, resumen, noEncontradas } = procesarPiezas(
      excelData,
      piezasObtenidas,
    );

    if (noEncontradas.length) {
      toast.warn(
        `Códigos no encontrados: ${noEncontradas.map((n) => n.cod_Producto).join(", ")}`,
      );
    }

    // Si quieres que todo lo del Excel entre como "adicional", puedes mezclarlo con el despiece actual:
    setFormData((prev) => {
      const base = prev.despiece || [];
      // Protege las piezas no adicionales existentes
      const baseNoAdicional = base.filter((p) => !p.esAdicional);
      const despieceFinal = [...baseNoAdicional, ...despiece];

      return {
        ...prev,
        despiece: despieceFinal,
      };
    });

    toast.success("Piezas del Excel procesadas.");
  };

  const ObtenerPiezas = async () => {
    try {
      const resultado = await centroAtencionService.listarPiezas();
      setPiezasObtenidas(resultado);
    } catch (error) {
      toast.error("Ocurrio un error al obtener las piezas");
    }
  };

  useEffect(() => {
    ObtenerPiezas();
  }, []);

  return (
    <div>
      {/* //? Seccion Excel */}
      <div className="mx-auto flex items-center justify-center rounded-2xl bg-gray-100 px-4 py-5 md:mx-0">
        <ExcelUploader
          onDataLoaded={handleExcelDataLoaded}
          handleSubirDatos={handleSubirDatos}
        />
      </div>
      {/* //? Seccion agregado de piezas Manual y listado de piezas */}
      <DespieceOtPasePedidos
        formData={formData}
        setFormData={setFormData}
        piezasObtenidas={piezasObtenidas}
      />

      <div className="flex justify-center py-4">
        <ModalVerificarGuardado
          open={open}
          setOpen={setOpen}
          mensaje="¿Seguro que deseas actualizar este despiece?, al darle guardar este sobre escribira el despiece anterior"
          handleFormSubmit={HandleActualizarDespieze}
        />
      </div>
    </div>
  );
};

export default NuevoDespiezePasePedido;
