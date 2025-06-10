import { useEffect, useState } from "react";
import contactosService from "../services/contactosService";
import { validarContacto } from "../validaciones/validarContacto";
import { toast } from "react-toastify";
import { confirmToast } from "../../../utils/confirmToast";

export default function useContactos() {
  const [contactos, setContactos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [contactoEditando, setContactoEditando] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [contactosPorPagina,setContactosPorPagina] = useState( 5);

  const [nuevoContacto, setNuevoContacto] = useState({
    nombre: "",
    email: "",
    telefono: "",
    cargo: "",
    clientes_asociados: [],
    obras_asociadas: [],
  });

  // 🔄 Cargar datos iniciales
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [contactos, clientes, obras] = await Promise.all([
          contactosService.obtenerContactos(),
          contactosService.obtenerClientes(),
          contactosService.obtenerObras(),
        ]);
        setContactos(contactos);
        setClientes(clientes);
        setObras(obras);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        toast.error("Error al cargar contactos");
      }
    }

    cargarDatos();
  }, []);

  // ➕ Abrir / cerrar modal agregar
  const abrirModalAgregar = () => setModalAgregar(true);
  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    resetNuevoContacto();
  };

  // ✏️ Abrir / cerrar modal editar
  const abrirModalEditar = (contacto) => {
    setContactoEditando({
      ...contacto,
      clientes_asociados: contacto.clientes_asociados?.map((c) => c.id) || [],
      obras_asociadas: contacto.obras_asociadas?.map((o) => o.id) || [],
    });
  };

  const cerrarModalEditar = () => setContactoEditando(null);

  // ✅ Crear nuevo contacto
  const agregarContacto = async (e) => {
    e.preventDefault();

    const errores = validarContacto(nuevoContacto);
    if (Object.keys(errores).length > 0) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    try {
      const creado = await contactosService.crearContacto(nuevoContacto);
      setContactos((prev) => [...prev, creado]);
      cerrarModalAgregar();
      toast.success("Contacto creado con éxito");
    } catch (error) {
      console.error("❌ Error al crear contacto:", error);
      toast.error("No se pudo crear el contacto");
    }
  };

  // 💾 Guardar edición
  const guardarEdicion = async (e) => {
    e.preventDefault();

    const errores = validarContacto(contactoEditando);
    if (Object.keys(errores).length > 0) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    try {
      await contactosService.actualizarContacto(contactoEditando.id, contactoEditando);
      const actualizado = await contactosService.obtenerContactoPorId(contactoEditando.id);
      setContactos((prev) =>
        prev.map((c) => (c.id === actualizado.id ? actualizado : c))
      );
      cerrarModalEditar();
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

  const resetNuevoContacto = () =>
    setNuevoContacto({
      nombre: "",
      email: "",
      telefono: "",
      cargo: "",
      clientes_asociados: [],
      obras_asociadas: [],
    });

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
    contactosFiltrados,
    contactosPaginados,
    totalPaginas,
    paginaActual,
    setPaginaActual,
    clientes,
    obras,
    busqueda,
    setBusqueda,
    modalAgregar,
    abrirModalAgregar,
    cerrarModalAgregar,
    contactoEditando,
    abrirModalEditar,
    cerrarModalEditar,
    nuevoContacto,
    setNuevoContacto,
    agregarContacto,
    guardarEdicion,
    eliminarContacto,
    setContactoEditando,
    setContactosPorPagina,
    contactosPorPagina
  };
}