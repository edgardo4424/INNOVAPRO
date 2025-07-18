
import { useEffect, useState } from "react";
import obrasService from "../services/obrasService";
import { validarObra } from "../validaciones/validarObra";
import { toast } from "react-toastify";
import { confirmToast } from "../../../utils/confirmToast";

export default function useObras() {
  const [obras, setObras] = useState([]);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [obraEditando, setObraEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [obrasPorPagina,setObrasPorPagina] = useState(5);

  useEffect(() => {
    async function cargarObras() {
      try {
        const obrasDB = await obrasService.obtenerObras();
        setObras(obrasDB);
      } catch (error) {
        console.error("❌ Error al cargar obras:", error);
        toast.error("Error al cargar obras");
      }
    }
    cargarObras();
  }, []);

  const abrirModalAgregar = () => setModalAgregar(true);
  const cerrarModalAgregar = () => {
    setModalAgregar(false);
  };

  const abrirModalEditar = (obra) => {
    setObraEditando({ ...obra });
  };

  const cerrarModalEditar = () => setObraEditando(null);

  const agregarObra = async (obra) => {


    try {
      const creada = await obrasService.crearObra(obra);
      setObras((prev) => [...prev, creada]);
      cerrarModalAgregar();
      toast.success("Obra registrada");
    } catch (error) {
      console.error("❌ Error al crear obra:", error);
      toast.error("No se pudo registrar la obra");
    }
  };

  const guardarEdicion = async (obra) => {

    try {
      await obrasService.actualizarObra(obra.id, obra);
      setObras((prev) =>
        prev.map((o) => (o.id === obra.id ? obra : o))
      );
      cerrarModalEditar();
      toast.success("Obra actualizada");
    } catch (error) {
      console.error("❌ Error al actualizar obra:", error);
      toast.error("No se pudo actualizar la obra");
    }
  };

  const eliminarObra = (id) => {
    confirmToast("¿Eliminar esta obra?", async () => {
      try {
        await obrasService.eliminarObra(id);
        setObras((prev) => prev.filter((o) => o.id !== id));
        toast.success("Obra eliminada");
      } catch (error) {
        console.error("❌ Error al eliminar obra:", error);
        toast.error("No se pudo eliminar la obra");
      }
    });
  };

  const resetNuevaObra = () =>
    setNuevaObra({
      nombre: "",
      direccion: "",
      ubicacion: "",
      estado: "",
      latitud: "",
      longitud: "",
    });

    const obrasFiltradas = obras.filter((o) => {
        const f = (busqueda || "").toLowerCase();
        return (
          o.nombre?.toLowerCase().includes(f) ||
          o.direccion?.toLowerCase().includes(f) ||
          o.ubicacion?.toLowerCase().includes(f) ||
          o.estado?.toLowerCase().includes(f)
        );
      });
      

  const totalPaginas = Math.ceil(obrasFiltradas.length / obrasPorPagina);
  const obrasPaginadas = obrasFiltradas.slice(
    (paginaActual - 1) * obrasPorPagina,
    paginaActual * obrasPorPagina
  );

  return {
    obrasFiltradas,
    obrasPaginadas,
    totalPaginas,
    paginaActual,
    setPaginaActual,
    modalAgregar,
    abrirModalAgregar,
    cerrarModalAgregar,
    obraEditando,
    abrirModalEditar,
    cerrarModalEditar,

    agregarObra,
    guardarEdicion,
    eliminarObra,
    setObraEditando,
    busqueda,
    setBusqueda,
    setObrasPorPagina,
    obrasPorPagina
  };
}