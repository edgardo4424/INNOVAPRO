import { useEffect, useState } from "react";
import empresasService from "../services/empresasService";
import { validarEmpresa } from "../validaciones/validarEmpresa";
import { toast } from "react-toastify";
import { confirmToast } from "../../../utils/confirmToast";
import { useAuth } from "../../../context/AuthContext";

export default function useEmpresas() {
   const { user } = useAuth();
   const [empresas, setEmpresas] = useState([]);
   const [busqueda, setBusqueda] = useState("");
   const [paginaActual, setPaginaActual] = useState(1);
   const [empresasPorPagina, setEmpresasPorPagina] = useState(5);

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

   const agregarEmpresa = async (empresa) => {
      try {
         
         const empresaNew ={...empresa,"creado_por": user?.id || null}
         
         const creada = await empresasService.crearEmpresa(empresaNew);
         setEmpresas((prev) => [...prev, creada]);
         toast.success("Filial registrada");
      } catch (error) {
         console.error("❌ Error al crear empresa:", error);
         toast.error("No se pudo registrar la empresa");
      }
   };

   const guardarEdicion = async (empresaNew) => {
      try {
         console.log("DATOS A ACTUALZAR: ", empresaNew)
         await empresasService.actualizarEmpresa(empresaNew.id, empresaNew);
         setEmpresas((prev) =>
            prev.map((e) => (e.id === empresaNew.id ? empresaNew : e))
         );
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
      empresasPaginadas,
      totalPaginas,
      paginaActual,
      setPaginaActual,
      busqueda,
      setBusqueda,
      agregarEmpresa,
      eliminarEmpresa,
      guardarEdicion,
      empresasPorPagina,
      setEmpresasPorPagina,
   };
}
