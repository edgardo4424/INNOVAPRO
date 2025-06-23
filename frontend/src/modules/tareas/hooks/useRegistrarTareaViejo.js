
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import tareasService from "../services/tareasService";
import { validarTarea } from "../validaciones/validarTarea";
import { useAuth } from "../../../context/AuthContext";

export default function useRegistrarTarea() {
  const { user } = useAuth();
  const [contactos, setContactos] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [obrasFiltradas, setObrasFiltradas] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState([]);
  const [obras, setObras] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [tipoTarea, setTipoTarea] = useState("");

  const [formData, setFormData] = useState({
    empresaProveedoraId: "",
    clienteId: "",
    obraId: "",
    contactoId: "",
    urgencia: "",
    tipoTarea: "",
    usoId: "",
    detalles: {},
    zonas: [],
  });

  const [errores, setErrores] = useState({});

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

  useEffect(() => {
    if (formData.obraId) {
      const obra = obras.find((o) => o.id === Number(formData.obraId));
      if (obra) setObraSeleccionada(obra);
    }
  }, [formData.obraId, obras]);

  const camposPorTipoTarea = {
    "Apoyo Técnico": [
      "apoyoTecnico", "tipoModulacion", "tipoEquipo", "nota",
      "plataformado", "anclajes", "uso",
      "apoyadoA", "rotaciones", "mensulas",
      "ingreso", "pasadizo",
      "escuadras", "sobrecarga", "plataformas",
      "encofrados", "elevador"
    ],
    "Apoyo Administrativo": [
      "apoyoAdministrativo", "nota",
      "valorizacion", "liquidacion", "acuerdoComercial", "envioCliente"
    ],
    "Pase de Pedido": [
      "estadoPasePedido", "numeroVersionContrato", "tipoOperacion",
      "estadoHabilitacion", "obraNueva", "valorizacionAdelantada",
      "transporte", "fechaEntrega", "horaEntrega", "nota",
      "despacho", "plataformado", "ingreso", "pasadizo", "tipoEscalera",
      "tipoServicioColgante", "venta", "puntales", "adaptarMotor"
    ],
    "Servicios Adicionales": [
      "tipoServicio", "fechaEntrega", "horaEntrega", "numeroVersionContrato", "nota"
    ],
    "Tarea Interna": ["nota"]
  };

  const limpiarCamposPorTipoTarea = (tipo) => {
    const camposPermitidos = new Set([...(camposPorTipoTarea[tipo] || [])]);
    const detallesFiltrados = Object.fromEntries(
      Object.entries(formData.detalles).filter(([key]) =>
        camposPermitidos.has(key)
      )
    );
    setFormData((prev) => ({
      ...prev,
      detalles: detallesFiltrados,
    }));
  };

  const limpiarSoloCamposDeEquipo = (nuevoTipoEquipo) => {
    const camposEquipo = {
      "AT - And. TRABAJO": ["plataformado", "anclajes", "uso"],
      "AF - And. FACHADA": ["apoyadoA", "rotaciones", "mensulas"],
      "EA - Escalera Acceso": ["apoyadoA", "ingreso", "pasadizo"],
      "EC - Escuadras": ["escuadras", "sobrecarga", "plataformas"],
      "EN - Encofrado": ["encofrados"],
      "EV - Elevador": ["elevador"],
    };

    const camposPermitidos = new Set([
      "apoyoTecnico", "tipoModulacion", "tipoEquipo", "nota",
      ...(camposEquipo[nuevoTipoEquipo] || []),
    ]);

    const detallesFiltrados = Object.fromEntries(
      Object.entries(formData.detalles).filter(([key]) =>
        camposPermitidos.has(key)
      )
    );

    setFormData((prev) => ({
      ...prev,
      detalles: {
        ...detallesFiltrados,
        tipoEquipo: nuevoTipoEquipo,
      },
    }));
  };

  const handleTipoTareaChange = (tipo) => {
    setFormData((prev) => ({ ...prev, tipoTarea: tipo }));
    limpiarCamposPorTipoTarea(tipo);
  };

  const handleInputChange = (campo, valor) => {
    if (campo === "usoId") {
      setFormData((prev) => ({ ...prev, usoId: valor }));
    } else {
      setFormData((prev) => ({ ...prev, [campo]: valor }));
    }
  };


  const handleDetallesChange = (campo, valor) => {
    /* if (campo === "usoId") {
      setFormData((prev) => ({
        ...prev,
        usoId: valor,
      }));
    } else { */
      setFormData((prev) => ({
        ...prev,
        detalles: { ...prev.detalles, [campo]: valor },
      }));
    }
 /*  }; */

  useEffect(() => {
  if (formData.detalles?.usoId) {
      setFormData(prev => ({
        ...prev,
        usoId: formData.detalles.usoId  // sincronizamos a nivel raíz
      }));
    }
  }, [formData.detalles?.usoId]);



  const registrarTarea = async (e) => {
    e.preventDefault();
    const validacion = validarTarea(formData, formData.tipoTarea);
    setErrores(validacion);

    const tieneErrores = Object.values(validacion).some(
      (grupo) => Object.keys(grupo).length > 0
    );

    if (tieneErrores) {
      toast.error("Faltan campos obligatorios");
      return;
    }


    try {
      const {tipoCotizacion, dias_alquiler, ...detallesLimpiados } = formData.detalles;
      console.log("formData al crear tarea:", formData)
      await tareasService.crearTarea({
        ...formData,
        estado: "En espera",
        usuarioId: user.id,
        detalles: {
          ...detallesLimpiados,
          tipo_cotizacion: tipoCotizacion,
          dias_alquiler: dias_alquiler,
        },
        zonas: (formData.zonas || []).map((zona, index) => ({
          ...zona,
          zona: index + 1,
        })),
        ubicacion: obraSeleccionada?.ubicacion || "",
      }, user.token);

      toast.success("✅ Tarea registrada con éxito");
      setFormData({
        empresaProveedoraId: "",
        clienteId: "",
        obraId: "",
        urgencia: "",
        usoId: "",
        contactoId: "",
        zonas: [],
        detalles: {},
        tipoTarea: "",
      });
      setErrores({});
    } catch (error) {
      console.error("❌ Error al registrar tarea:", error);
      toast.error("No se pudo registrar la tarea");
    }
  };

    return {
      empresas,
      clientes,
      obras,
      contactos,
      clientesFiltrados,
      obrasFiltradas,
      setClientesFiltrados,
      setObrasFiltradas,
      obraSeleccionada,
      tipoTarea,
      setTipoTarea: handleTipoTareaChange,
      formData,
      setFormData,
      handleInputChange,
      handleDetallesChange,
      registrarTarea,
      errores,
    };

}