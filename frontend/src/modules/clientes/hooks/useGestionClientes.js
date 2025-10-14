import { useEffect, useState } from "react";
import clientesService from "../services/clientesService";
import contactosService from "../../contactos/services/contactosService";
import { toast } from "react-toastify";
import { confirmToast } from "../../../utils/confirmToast";

export function useGestionClientes() {
  const [clientes, setClientes] = useState([]);
  const [contactos, setContactos ] = useState([]);
  const [obras, setObras ] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [clientesPorPagina,setClientesPorPagina] = useState(5);

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
        console.log("Clientes obtenidos: ",clientes);
        
        setClientes(clientes);
        setObras(obras);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        toast.error("Error al cargar contactos");
      }
    }
    cargarDatos();
  }, []);


  const agregarCliente = (clienteNuevo) => {
    setClientes((prev) => [...prev, clienteNuevo]);
  };

  const actualizarCliente = (clienteActualizado) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === clienteActualizado.id ? clienteActualizado : c))
    );
  };

  const eliminarCliente = async (id) => {
    confirmToast("¿Seguro que deseas eliminar este cliente?", async () => {
      try {
        await clientesService.eliminar(id);
        setClientes((prev) => prev.filter((c) => c.id !== id));
        toast.success("Cliente eliminado");
      } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        toast.error("No se pudo eliminar el cliente");
      }
    })
  }; 

  // 🔍 Filtro de búsqueda
  const clientesFiltrados = clientes.filter((c) =>
    [c.razon_social, c.ruc, c.representante_legal, c.dni]
      .filter(Boolean)
      .some((campo) => campo.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * clientesPorPagina,
    paginaActual * clientesPorPagina
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  return {
      clientesPaginados,
      contactos,
      obras,
      busqueda,
      setBusqueda,
      paginaActual,
      setPaginaActual,
      totalPaginas,
      eliminarCliente,
      agregarCliente,
      actualizarCliente,
      clientesPorPagina,
      setClientesPorPagina,
  };
}