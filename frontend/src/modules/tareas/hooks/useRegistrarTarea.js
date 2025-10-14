import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import tareasService from "../services/tareasService";
import {validarTarea} from "../validaciones/validarTarea";
import { useAuth } from "../../../context/AuthContext";

export default function useRegistrarTarea() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    empresaProveedoraId: null,
    clienteId: null,
    obraId: null,
    contactoId: null,
    tipoTarea: "",
    usoId: null,
    detalles: {},
    zonas: [],
  });

  const [paso, setPaso] = useState(1);
  const [errores, setErrores] = useState({});
  const [contactos, setContactos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [contactosFiltrados, setContactosFiltrados] = useState([]);
  const [obrasFiltradas, setObrasFiltradas] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  useEffect(() => {
  async function fetchData() {
      try {
        const [resEmpresas, resClientes, resObras, resContactos] = await Promise.all([
          tareasService.obtenerFiliales(),
          tareasService.obtenerClientes(),
          tareasService.obtenerObras(),
          tareasService.obtenerContactos(),
        ]);
        setEmpresas(resEmpresas);
        setClientes(resClientes);
        setObras(resObras);
        setContactos(resContactos);
      } catch (error) {
        console.error("❌ Error al cargar datos iniciales:", error);
        toast.error("Error al cargar datos");
      }
    }
    fetchData();
  }, []);

  // Cambio de campos generales
  const onChangeCampo = (campo, valor) => {

    setFormData((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    if (campo === "obraId") {
      const obra = obras.find((o) => o.id === valor);
      setObraSeleccionada(obra || null);
    }

    if (campo === "tipoTarea") {
      setFormData((prev) => ({
        ...prev,
        tipoTarea: valor,
        detalles: {},
        usoId: null,
        zonas: [],
      }));
    }
  };

  // Cambio de campos internos del objeto detalles
  const onChangeDetalles = (campo, valor) => {

    if (campo === "usoId") {
      setFormData((prev) => ({
        ...prev,
        usoId: valor,
        detalles: {
          ...prev.detalles,
          usoId: valor,
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        detalles: { 
          ...prev.detalles, 
          [campo]: valor 
        },
      }));
    }
  }
  
  // Cambio del uso (tipo de equipo)
  const handleUsoChange = (usoId) => {
    setFormData((prev) => ({ 
      ...prev, 
      usoId
    }));
  };

  // Cambio de zonas para despiece
  const handleZonasChange = (zonas) => {
    setFormData((prev) => ({ ...prev, zonas }));
  };

  // Envío al backend
  const registrarTarea = async (e) => {
    e.preventDefault();
    const validacion = validarTarea(formData);
    setErrores(validacion);

    // Verifica errores correctamente
    const hayErrores = Object.values(validacion).some(grupo => Object.keys(grupo).length > 0);

    if (hayErrores) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    try {
      const { tipoCotizacion, diasAlquiler, ...restoDetalles } = formData.detalles;

      const payload = {
        ...formData,
        estado: "Pendiente",
        usuarioId: user.id,
        detalles: {
          ...restoDetalles,
          tipo_cotizacion: tipoCotizacion,
          dias_alquiler: diasAlquiler,
        },
        zonas: (formData.zonas || []).map((zona, index) => ({
          ...zona,
          zona: index + 1,
        })),
        
      };

      await tareasService.crearTarea(payload, user.token);
      toast.success("✅ Tarea registrada con éxito");

      // Limpiar todo
      setFormData({
        contactoId: "",
        clienteId: "",
        obraId: "",
        empresaProveedoraId: "",
        tipoTarea: "",
        usoId: null,
        detalles: {},
        zonas: [],
      });
      setErrores({});
      setPaso(1);
    } catch (error) {
      console.error("❌ Error al registrar tarea:", error);
      toast.error("No se pudo registrar la tarea");
    }
  };

  return {
    paso,
    setPaso,
    contactos,
    clientes,
    obras,
    empresas,
    contactosFiltrados,
    setContactosFiltrados,
    obrasFiltradas,
    setObrasFiltradas,
    obraSeleccionada,
    formData,
    setFormData,
    errores,
    setErrores,
    onChangeCampo,
    onChangeDetalles,
    handleUsoChange,
    handleZonasChange,
    registrarTarea,
  };

}