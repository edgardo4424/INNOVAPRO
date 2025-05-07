
import { useEffect, useState } from "react";
import tareasService from "../services/tareasService";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { validarTarea } from "../validaciones/validarTarea";

export default function useRegistrarTarea() {
  const { user } = useAuth();

  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);

  const [tipoTarea, setTipoTarea] = useState("");

  const [formData, setFormData] = useState({
    empresaProveedoraId: "",
    clienteId: "",
    obraId: "",
    urgencia: "",
    detalles: {},
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const resEmpresas = await tareasService.obtenerFiliales();
        const resClientes = await tareasService.obtenerClientes();
        const resObras = await tareasService.obtenerObras();
        setEmpresas(resEmpresas);
        setClientes(resClientes);
        setObras(resObras);
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
    setTipoTarea(tipo);
    limpiarCamposPorTipoTarea(tipo);
  };

  const handleInputChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleDetallesChange = (campo, valor) => {
    if (campo === "tipoEquipo" && tipoTarea === "Apoyo Técnico") {
      limpiarSoloCamposDeEquipo(valor);
    } else {
      setFormData((prev) => ({
        ...prev,
        detalles: { ...prev.detalles, [campo]: valor },
      }));
    }
  };

  const registrarTarea = async (e) => {
    e.preventDefault();
    const validacion = validarTarea(formData, tipoTarea);
    setErrores(validacion);

    if (Object.keys(validacion).length > 0) {
      toast.error("Faltan campos obligatorios");
      return;
    }

    try {
      await tareasService.crearTarea({
        ...formData,
        tipoTarea,
        ubicacion: obraSeleccionada?.ubicacion || "",
      }, user.token);

      toast.success("✅ Tarea registrada con éxito");
      setFormData({
        empresaProveedoraId: "",
        clienteId: "",
        obraId: "",
        urgencia: "",
        detalles: {},
      });
      setTipoTarea("");
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