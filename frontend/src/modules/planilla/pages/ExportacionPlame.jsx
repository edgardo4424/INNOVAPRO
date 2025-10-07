import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import Filtro from "../components/Filtro";

import planillaMensualService from "../services/planillaMensualService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import ReciboCard from "../components/plame/ReciboCard";

const ExportacionPlame = () => {
  const [filiales, setFiliales] = useState([]);

  // ?? loading
  const [loading, setLoading] = useState(false);
  const [loadPlame, setLoadPlame] = useState(false);
  const [recibos,setRecibos]=useState(null);


  // ?? Filtro para la peticion
  const [filtro, setFiltro] = useState({
    anio: new Date().getFullYear() + "",
    mes: new Date().toLocaleString("es-PE", { month: "2-digit" }),
    filial_id: "1",
  });

  useEffect(() => {
    const obtenerFiliales = async () => {
      try {
        setLoading(true);
        const res = await planillaMensualService.obtenerFiliales();

        setFiliales(res);
        setFiltro({ ...filtro, filial_id: res?.[0]?.id });
      } catch (error) {
        toast.error("No se pudieron obtener las filiales");
      } finally {
        setLoading(false);
      }
    };
    obtenerFiliales();
  }, []);

  const exportarPlame = async () => {
    try {
      setLoadPlame(true);
      const anio_mes_dia = `${filtro.anio}-${filtro.mes}`;
      const payload = {
        fecha_anio_mes: anio_mes_dia,
        filial_id: filtro.filial_id,
      };
      const response = await planillaMensualService.exportarPlame(payload);
      // 1. Leer nombre de archivo del header
      const disposition =
        response.headers["content-disposition"] ||
        response.headers.get?.("content-disposition");
      let filename = "archivo.zip";
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      // 2. Crear enlace invisible y simular clic
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // limpieza
      toast.success("Plame obtenido con éxito");
    } catch (error) {
      console.error("❌ Error al exportar PLAME:", error);
      alert("No se pudo descargar el archivo.");
    } finally {
      setLoadPlame(false);
    }
  };

  const buscarPlame = async () => {
    setRecibos(null)
    try {
      const respuesta=await planillaMensualService.obtenerReciboPorPlanilla(`${filtro.anio}-${filtro.mes}`,filtro.filial_id);
      setRecibos(respuesta.data)
    } catch (error) {
      console.log("Error recibido: ",error);
      
    }
  };

  return (
    <div className="min-h-full flex-1  flex flex-col items-center space-y-6">
      <div className="w-full flex justify-between ">
        <Filtro
          filiales={filiales}
          filtro={filtro}
          setFiltro={setFiltro}
          Buscar={buscarPlame}
          nombre_button="Buscar Plame"
        />
      </div>

      {loading ? (
        <div className="max-w-8xl flex min-h-[50vh] w-full items-center px-20">
          <div className="flex w-full flex-col items-center justify-center">
            <LoaderCircle className="size-30 animate-spin text-gray-800" />
            <h2 className="text-2xl text-gray-800">Cargando...</h2>
          </div>
        </div>
      ) : (
        <article className="w-full">
          <section className="space-y-3">
            {
              (recibos&&recibos.length>0)&&recibos.map((r,index)=>(
                <ReciboCard planilla_recibo={r} key={index}/>
              ))
            }
          </section>
          <Button onClick={() => exportarPlame()} disabled={loadPlame}>
            {loadPlame && <FaSpinner className="animate-spin" />}
            Exportar Plame
          </Button>
        </article>
      )}
    </div>
  );
};

export default ExportacionPlame;
