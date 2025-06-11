import { useEffect, useState } from "react";
import usuariosService from "../services/usuariosService";
import { validarUsuario } from "../validaciones/validarUsuario";
import { toast } from "react-toastify";
import { confirmToast } from "../../../utils/confirmToast"

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosPorPagina,setUsuariosPorPagina] =useState (5);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    rol: "",
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const usuariosDB = await usuariosService.obtenerUsuarios();
        setUsuarios(usuariosDB);
      } catch (error) {
        console.error("❌ Error al cargar usuarios:", error);
        toast.error("Error al cargar usuarios");
      }
    }
    cargarUsuarios();
  }, []);

  const abrirModalAgregar = () => setModalAgregar(true);
  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    resetNuevoUsuario();
    setErrores({});
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioEditando({ ...usuario });
    setErrores({});
  };

  const cerrarModalEditar = () => {
    setUsuarioEditando(null);
    setErrores({});
  };

  const agregarUsuario = async (e) => {
    e.preventDefault();
    const validacion = validarUsuario(nuevoUsuario);
    setErrores(validacion);
    if (Object.keys(validacion).length > 0) {
      toast.error("Corrige los errores antes de continuar");
      return;
    }

    try {
      const creado = await usuariosService.crearUsuario(nuevoUsuario);
      setUsuarios((prev) => [...prev, creado]);
      cerrarModalAgregar();
      toast.success("Usuario registrado");
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      toast.error(error.response?.data?.mensaje || "No se pudo registrar el usuario");
    }
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    const validacion = validarUsuario(usuarioEditando, { editar: true });
    setErrores(validacion);
    if (Object.keys(validacion).length > 0) {
      toast.error("Corrige los errores antes de continuar");
      return;
    }

    try {
      const actualizado = await usuariosService.actualizarUsuario(usuarioEditando.id, usuarioEditando);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioEditando.id ? actualizado : u))
      );
      cerrarModalEditar();
      toast.success("Usuario actualizado");
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      toast.error(error.response?.data?.mensaje || "No se pudo actualizar el usuario");
    }
  };

  const eliminarUsuario = (id) => {
    confirmToast("¿Eliminar este usuario?", async () => {
      try {
        await usuariosService.eliminarUsuario(id);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        toast.success("Usuario eliminado");
      } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        toast.error("No se pudo eliminar el usuario");
      }
    });
  };

  const resetNuevoUsuario = () =>
    setNuevoUsuario({
      nombre: "",
      telefono: "",
      email: "",
      password: "",
      rol: "",
    });

  const usuariosFiltrados = usuarios.filter((u) => {
    const f = (busqueda || "").toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(f) ||
      u.telefono?.toLowerCase().includes(f) ||
      u.email?.toLowerCase().includes(f) ||
      u.rol?.toLowerCase().includes(f)
    );
  });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * usuariosPorPagina,
    paginaActual * usuariosPorPagina
  );

  return {
    usuariosPaginados,
    totalPaginas,
    paginaActual,
    setPaginaActual,
    modalAgregar,
    abrirModalAgregar,
    cerrarModalAgregar,
    usuarioEditando,
    abrirModalEditar,
    cerrarModalEditar,
    nuevoUsuario,
    setNuevoUsuario,
    agregarUsuario,
    guardarEdicion,
    eliminarUsuario,
    setUsuarioEditando,
    busqueda,
    setBusqueda,
    errores,
    usuariosPorPagina,
    setUsuariosPorPagina
  };
}