import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import transportistaService from "@/modules/transporte/service/TransportistaService";
import { useCallback, useEffect, useState } from "react";
import ModalNuevoTransportista from "../modal/ModalNuevoTransportista";
import TablaTransportistas from "../tabla/TablaTransportistas";
import ModalEliminarTransportista from "../modal/ModalEliminarTransportista";
import { valorIncialTransporte } from "@/modules/transporte/utils/valoresInicial";

const TransportistasLayout = () => {
  const [listaTransportistas, setListaTransportistas] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);

  // ?MODAL AGREGAR ACTUALIZAR
  const [open, setOpen] = useState(false);

  // *ACTUALIZAR CHOFER
  const [Form, setForm] = useState(valorIncialTransporte);

  // !MODAL ELIMINAR TRANSPORTISTA
  const [openEliminar, setOpenEliminar] = useState(false);
  const [transportistaEliminar, setTransportistaEliminar] = useState(null);

  const buscarTransportistas = useCallback(async () => {
    setLoading(true);
    try {
      const { data, success, message } = await transportistaService.listar();
      if (success) {
        setListaTransportistas(data);
      } else {
        toast.error(message || "No se pudieron cargar los Transportistas.");
      }
    } catch (error) {
      toast.error("Error al cargar Transportistas.");
      // console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarTransportistas();
  }, [buscarTransportistas]);

  // 🔎 Aplicar filtro cada vez que cambian listaChoferes o filtro
  useEffect(() => {
    const texto = filtro.toLowerCase().trim();
    if (!texto) {
      setListaFiltrada(listaTransportistas);
    } else {
      setListaFiltrada(
        listaTransportistas.filter((transporte) => {
          return (
            transporte.nro_doc?.toLowerCase().includes(texto) ||
            transporte.razon_social?.toLowerCase().includes(texto)
          );
        }),
      );
    }
  }, [filtro, listaTransportistas]);

  return (
    <div className="flex w-full flex-col">
      {/* // ? HEADER */}
      <div className="mb-6 flex flex-row items-end justify-between px-2">
        {/* //? BUSCADOR */}
        <div className="flex w-1/3 flex-col">
          <Label className="text-sm font-semibold text-gray-700">Buscar</Label>
          <Input
            placeholder="Buscar por razon social, documento..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="bg-white"
          />{" "}
        </div>
        {/* //? BOTONES */}
        <ModalNuevoTransportista
          open={open}
          setOpen={setOpen}
          Form={Form}
          setForm={setForm}
       W />
      </div>

      {/* // ? TABLA */}
      <TablaTransportistas
        transportistas={listaFiltrada}
        setOpenEliminar={setOpenEliminar}
        setTransportistaEliminar={setTransportistaEliminar}
        setOpen={setOpen}
        setForm={setForm}
        loading={loading}
      />

      {/* // ? MODAL */}
      <ModalEliminarTransportista
        open={openEliminar}
        setOpen={setOpenEliminar}
        transportistaEliminar={transportistaEliminar}
        setTransportistaEliminar={setTransportistaEliminar}
        refresh={buscarTransportistas}
      />
    </div>
  );
};

export default TransportistasLayout;
