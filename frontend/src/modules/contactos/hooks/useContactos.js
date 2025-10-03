import { useEffect, useState } from "react";
import contactosService from "../services/contactosService";
import { validarContacto } from "../validaciones/validarContacto";
import { toast } from "react-toastify";
import { confirmToast } from "../../../utils/confirmToast";

export default function useContactos() {
  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [contactosPorPagina,setContactosPorPagina] = useState( 5);



  // 🔄 Cargar datos iniciales
  useEffect(() => {
    async function cargarDatos() {
      try {
        const contactos = await contactosService.obtenerContactos();
        setContactos(contactos);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        toast.error("Error al cargar contactos");
      }
    }
    cargarDatos();
  }, []);


  // ✅ Crear nuevo contacto
  const agregarContacto = async (contacto) => {
    try {
      const creado = await contactosService.crearContacto(contacto);
      setContactos((prev) => [...prev, creado]);
      toast.success("Contacto creado con éxito");
    } catch (error) {
      console.error("❌ Error al crear contacto:", error);
      toast.error("No se pudo crear el contacto");
    }
  };

  // 💾 Guardar edición
  const guardarEdicion = async (contacto) => {

    try {
      await contactosService.actualizarContacto(contacto.id, contacto);
      const actualizado = await contactosService.obtenerContactoPorId(contacto.id);
      setContactos((prev) =>
        prev.map((c) => (c.id === actualizado.id ? actualizado : c))
      );
      toast.success("Contacto actualizado");
    } catch (error) {
      console.error("❌ Error al actualizar contacto:", error);
      toast.error("No se pudo actualizar el contacto");
    }
  };

  // 🗑 Eliminar contacto
  const eliminarContacto = (id) => {
    confirmToast("¿Eliminar este contacto?", async () => {
      try {
        await contactosService.eliminarContacto(id);
        setContactos((prev) => prev.filter((c) => c.id !== id));
        toast.success("Contacto eliminado");
      } catch (error) {
        console.error("❌ Error al eliminar contacto:", error);
        toast.error("No se pudo eliminar el contacto");
      }
    });
  };



  // 🔎 Búsqueda inteligente
  const contactosFiltrados = contactos.filter((c) => {
    const filtro = busqueda.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(filtro) ||
      c.email.toLowerCase().includes(filtro) ||
      c.telefono?.includes(filtro) ||
      c.clientes_asociados?.some((cli) =>
        cli.razon_social.toLowerCase().includes(filtro)
      ) ||
      c.obras_asociadas?.some((ob) =>
        ob.nombre.toLowerCase().includes(filtro)
      )
    );
  });

  const totalPaginas = Math.ceil(contactosFiltrados.length / contactosPorPagina);
  const contactosPaginados = contactosFiltrados.slice(
    (paginaActual - 1) * contactosPorPagina,
    paginaActual * contactosPorPagina
  );

  return {
      contactosPaginados,
      totalPaginas,
      paginaActual,
      setPaginaActual,
      busqueda,
      setBusqueda,
      agregarContacto,
      guardarEdicion,
      eliminarContacto,
      contactosPorPagina,
      setContactosPorPagina,
  };
}