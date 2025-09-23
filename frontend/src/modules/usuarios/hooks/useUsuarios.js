import { useEffect, useState } from "react";
import usuariosService from "../services/usuariosService";
import { validarUsuario } from "../validaciones/validarUsuario";
import { toast } from "react-toastify";
import { confirmToast } from "../../../utils/confirmToast";

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(5);
  const [trabajadores, setTrabajadores] = useState([]);

  async function cargarUsuarios() {
      try {
        const usuariosDB = await usuariosService.obtenerUsuarios();
        const responseTrabajadores =
          await usuariosService.obtenerTrabajadoresSinUsuario();
        setUsuarios(usuariosDB);
        console.log("Trabajadores", responseTrabajadores.data);

        setTrabajadores(responseTrabajadores.data);
      } catch (error) {
        console.error("❌ Error al cargar usuarios:", error);
        toast.error("Error al cargar usuarios");
      }
  }
  useEffect(() => {

    cargarUsuarios();
  }, []);

  const agregarUsuario = async (user) => {
    try {
      const responseUsuarioCreado = await usuariosService.crearUsuario(user);
      const payload = {
        email: "",
        id: "",
        nombre: "",
        rol: "",
      };
      console.log('response recibido: ',responseUsuarioCreado);
      
      setUsuarios((prev) => [...prev, responseUsuarioCreado]);
      await cargarUsuarios()

      toast.success("Usuario registrado");
    } catch (error) {
      console.error("❌ Error al crear usuario:", error);
      toast.error(
        error.response?.data?.mensaje || "No se pudo registrar el usuario",
      );
    }
  };

  const guardarEdicion = async (user) => {
    try {
      const actualizado = await usuariosService.actualizarUsuario(
        user.id,
        user,
      );
      setUsuarios((prev) =>
        prev.map((u) => (u.id === user.id ? actualizado : u)),
      );
      toast.success("Usuario actualizado");
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
      toast.error(
        error.response?.data?.mensaje || "No se pudo actualizar el usuario",
      );
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
    paginaActual * usuariosPorPagina,
  );

  return {
    usuariosPaginados,
    totalPaginas,
    paginaActual,
    setPaginaActual,
    busqueda,
    setBusqueda,
    agregarUsuario,
    guardarEdicion,
    eliminarUsuario,
    usuariosPorPagina,
    setUsuariosPorPagina,
    trabajadores,
  };
}
