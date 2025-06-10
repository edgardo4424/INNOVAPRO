import { useEffect, useState } from "react";
import empresasService from "../services/empresasService";
import { validarEmpresa } from "../validaciones/validarEmpresa";
import { toast } from "react-toastify";
import { confirmToast } from "../../../utils/confirmToast";
import { useAuth } from "../../../context/AuthContext";

export default function useEmpresas() {
  const { user } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [empresasPorPagina,setEmpresasPorPagina] =useState(5);

  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    razon_social: "",
    ruc: "",
    direccion_fiscal: "",
    representante_legal: "",
    tipo_documento: "",
    numero_documento: "",
    cargo_representante: "",
    telefono_representante: "",
    telefono_oficina: "",
    creado_por: user?.id || null,
  });

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      const data = await empresasService.obtenerEmpresas();
      setEmpresas(data);
    } catch (error) {
      console.error("❌ Error al cargar filiales:", error);
      toast.error("No se pudo cargar la lista de filiales");
    }
  };

  const abrirModalAgregar = () => setModalAgregar(true);

  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    resetNuevaEmpresa();
  };

  const abrirModalEditar = (empresa) => {
    setEmpresaEditando({ ...empresa });
  };

  const cerrarModalEditar = () => setEmpresaEditando(null);

  const agregarEmpresa = async (e) => {
    e.preventDefault();
    const errores = validarEmpresa(nuevaEmpresa);
    if (Object.keys(errores).length > 0) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    try {
      const creada = await empresasService.crearEmpresa(nuevaEmpresa);
      setEmpresas((prev) => [...prev, creada]);
      cerrarModalAgregar();
      toast.success("Filial registrada");
    } catch (error) {
      console.error("❌ Error al crear empresa:", error);
      toast.error("No se pudo registrar la empresa");
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    const errores = validarEmpresa(empresaEditando);
    if (Object.keys(errores).length > 0) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    try {
      await empresasService.actualizarEmpresa(empresaEditando.id, empresaEditando);
      setEmpresas((prev) =>
        prev.map((e) => (e.id === empresaEditando.id ? empresaEditando : e))
      );
      cerrarModalEditar();
      toast.success("Filial actualizada");
    } catch (error) {
      console.error("❌ Error al actualizar empresa:", error);
      toast.error("No se pudo actualizar la empresa");
    }
  };

  const eliminarEmpresa = async (id) => {
    confirmToast("¿Eliminar esta filial?", async () => {
      try {
        await empresasService.eliminarEmpresa(id);
        setEmpresas((prev) => prev.filter((e) => e.id !== id));
        toast.success("Filial eliminada");
      } catch (error) {
        console.error("❌ Error al eliminar empresa:", error);
        toast.error("No se pudo eliminar la empresa");
      }
    });
  };

  const resetNuevaEmpresa = () =>
    setNuevaEmpresa({
      razon_social: "",
      ruc: "",
      direccion_fiscal: "",
      representante_legal: "",
      tipo_documento: "",
      numero_documento: "",
      cargo_representante: "",
      telefono_representante: "",
      telefono_oficina: "",
      creado_por: user?.id || null,
    });

    const empresasFiltradas = empresas.filter((e) => {
        const f = (busqueda || "").toLowerCase();
        return (
          e.razon_social?.toLowerCase().includes(f) ||
          e.ruc?.includes(f) ||
          e.direccion_fiscal?.toLowerCase().includes(f) ||
          e.representante_legal?.toLowerCase().includes(f) ||
          e.numero_documento?.includes(f) ||
          e.cargo_representante?.toLowerCase().includes(f)
        );
      });
      

  const totalPaginas = Math.ceil(empresasFiltradas.length / empresasPorPagina);
  const empresasPaginadas = empresasFiltradas.slice(
    (paginaActual - 1) * empresasPorPagina,
    paginaActual * empresasPorPagina
  );

  return {
    empresasFiltradas,
    empresasPaginadas,
    totalPaginas,
    paginaActual,
    setPaginaActual,
    busqueda,
    setBusqueda,
    modalAgregar,
    abrirModalAgregar,
    cerrarModalAgregar,
    empresaEditando,
    abrirModalEditar,
    cerrarModalEditar,
    nuevaEmpresa,
    setNuevaEmpresa,
    agregarEmpresa,
    guardarEdicion,
    eliminarEmpresa,
    setEmpresaEditando,
    empresasPorPagina,
    setEmpresasPorPagina
  };
}