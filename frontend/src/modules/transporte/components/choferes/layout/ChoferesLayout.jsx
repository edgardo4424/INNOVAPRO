import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import choferService from "@/modules/transporte/service/ChoferService";
import { valorIncialChofer } from "@/modules/transporte/utils/valoresInicial";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalEliminarChofer from "../modal/ModalEliminarChofer";
import ModalNuevoChofer from "../modal/ModalNuevoChofer";
import TablaChoferes from "../tabla/TablaChoferes";

const ChoferesLayout = () => {
  const [listaChoferes, setListaChoferes] = useState([]);
  const [listaFiltrada, setListaFiltrada] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);

  // ?MODAL AGREGAR ACTUALIZAR
  const [open, setOpen] = useState(false);

  // *ACTUALIZAR CHOFER
  const [Form, setForm] = useState(valorIncialChofer);

  // !MODAL ELIMINAR CHOFER
  const [openEliminar, setOpenEliminar] = useState(false);
  const [choferEliminar, setChoferEliminar] = useState(null);

  const buscarChoferes = useCallback(async () => {
    setLoading(true);
    try {
      const { data, success, message } = await choferService.listar();
      if (success) {
        setListaChoferes(data);
      } 
      // else {
      //   toast.error(message || "No se pudieron cargar los choferes.");
      // }
    } catch (error) {
      // toast.error("Error al cargar choferes.");
      // console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarChoferes();
  }, [buscarChoferes]);

  // 🔎 Aplicar filtro cada vez que cambian listaChoferes o filtro
  useEffect(() => {
    const texto = filtro.toLowerCase().trim();
    if (!texto) {
      setListaFiltrada(listaChoferes);
    } else {
      setListaFiltrada(
        listaChoferes.filter((chofer) => {
          return (
            chofer.nombres?.toLowerCase().includes(texto) ||
            chofer.apellidos?.toLowerCase().includes(texto) ||
            chofer.nro_doc?.toLowerCase().includes(texto) ||
            chofer.nro_licencia?.toLowerCase().includes(texto)
          );
        }),
      );
    }
  }, [filtro, listaChoferes]);

  useEffect(() => {
    if (!open) {
      setForm(valorIncialChofer);
    }
  }, [open]);

  return (
    <div className="flex w-full flex-col">
      {/* //? HEADER */}
      <div className="mb-6 flex flex-row items-end justify-between px-2">
        {/* //? BUSCADOR */}
        <div className="flex w-1/3 flex-col">
          <Label className="text-sm font-semibold text-gray-700">Buscar</Label>
          <Input
            placeholder="Buscar por nombre, documento o licencia..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="bg-white"
          />
        </div>
        {/* //? BOTONES */}
        <ModalNuevoChofer
          open={open}
          setOpen={setOpen}
          refresh={buscarChoferes}
          Form={Form}
          setForm={setForm}
        />
      </div>

      {/* //? TABLA */}
      <TablaChoferes
        choferes={listaFiltrada}
        setOpenEliminar={setOpenEliminar}
        setChoferEliminar={setChoferEliminar}
        setOpen={setOpen}
        setForm={setForm}
        loading={loading}
      />

      {/* //? MODAL ELIMINAR CHOFER */}
      <ModalEliminarChofer
        open={openEliminar}
        setOpen={setOpenEliminar}
        choferEliminar={choferEliminar}
        setChoferEliminar={setChoferEliminar}
        refresh={buscarChoferes}
      />
    </div>
  );
};

export default ChoferesLayout;
