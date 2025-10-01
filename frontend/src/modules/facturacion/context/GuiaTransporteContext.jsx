import { validarFormulario } from "@/modules/facturacion/emitir/guia-de-remision/utils/validarFormulario";
import {
  detalleInicial,
  guiaInical,
  ValoresInterno,
  ValoresPrivado,
  ValoresPublico,
} from "@/modules/facturacion/emitir/guia-de-remision/utils/valoresIncialGuia";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import facturaService from "@/modules/facturacion/service/FacturaService";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useProducto from "../hooks/useProducto";
import filialesService from "../service/FilialesService";

const GuiaTransporteContext = createContext();

export function GuiaTransporteProvider({ children }) {
  const [guiaTransporte, setGuiaTransporte] = useState(guiaInical); // ?Datos de guia que abarcan los 3 casos

  const [pesoTotalCalculado, setPesoTotalCalculado] = useState(0);

  // ?? CORRELATIVOS

  const serieGuia = [
    { value: "T001" },
    { value: "T002" },
    { value: "T003" },
    { value: "T004" },
    { value: "T005" },
  ];

  const [correlativos, setCorrelativos] = useState([]);
  const [correlativoEstado, setCorrelativoEstado] = useState(false);
  const [loadingCorrelativo, setLoadingCorrelativo] = useState(false);

  const [guiaDatosPrivado, setGuiaDatosPrivado] = useState(ValoresPrivado);
  const [guiaDatosPublico, setGuiaDatosPublico] = useState(ValoresPublico);
  const [guiaDatosInternos, setGuiaDatosInternos] = useState(ValoresInterno);

  const [guiaTransporteValida, setGuiaTransporteValida] = useState(null);

  // ?? OBTENER LOS PRODUCTOS PARA PODER COMPRAR PESOS, ETC
  const { ObtenerProductos } = useProducto();
  const [piezas, setPizas] = useState([]);

  const [productoActual, setProductoActual] = useState(detalleInicial);

  const [tipoGuia, setTipoGuia] = useState("transporte-publico");

  const [filiales, setFiliales] = useState([]);

  // ?? OBTENER CORRELATIVOS
  const buscarCorrelativo = async (e) => {
    if (loadingCorrelativo) return;
    if (e) {
      e.preventDefault();
    }
    try {
      setLoadingCorrelativo(true);
      const rucsAndSeries = filiales.map((filial) => ({
        ruc: filial.ruc,
        serie: serieGuia,
      }));

      const { data } =
        await facturaService.obtenerCorrelativoGuia(rucsAndSeries);
      setCorrelativos(data);
    } catch (error) {
      console.error("Error al obtener correlativos:", error);
    } finally {
      setLoadingCorrelativo(false);
    }
  };

  // ?? OBTENER TODAS LAS FILIALES

  useEffect(() => {
    const consultarFiliales = async () => {
      const data = await filialesService.ObtenerPiezas();
      if (data.length === 0) {
        toast.error("No se encontraron filiales");
        return;
      }
      setFiliales(data);
    };
    consultarFiliales();
  }, []);

  // ?? OBTENER PRODUCTOS
  useEffect(() => {
    const cargarPiezas = async () => {
      try {
        const data = await ObtenerProductos();
        setPizas(data);
      } catch (error) {
        console.error("Error al cargar piezas", error);
      }
    };
    cargarPiezas();
  }, []);

  useEffect(() => {
    const UNIT_TO_KG = {
      NIU: 1, // no unidad
      KGM: 1, // kilogramo
      TNE: 1000, // tonelada
      GRM: 0.001, // gramo
      LBR: 0.45359237, // libra
      ONZ: 0.028349523125, // onza
    };

    const toKg = (value, unit) =>
      (Number(value) || 0) * (UNIT_TO_KG[unit] || 1);
    const fromKg = (kg, unit) => kg / (UNIT_TO_KG[unit] || 1);
    const round = (n, d = 3) => {
      const m = Math.pow(10, d);
      return Math.round((n + Number.EPSILON) * m) / m;
    };

    const actualizarPesoTotal = () => {
      const detalle = Array.isArray(guiaTransporte?.detalle)
        ? guiaTransporte.detalle
        : [];
      const unidadTotal = guiaTransporte?.guia_Envio_Und_Peso_Total || "KGM";

      // 1) Sumar todo en KG
      const totalKg = detalle.reduce((acc, item) => {
        const itemEncontrado = piezas.find((p) => p.item === item.cod_Producto);
        const cantidad = Number(item?.cantidad) || 0;
        if (itemEncontrado && item.unidad === "NIU") {
          return acc + (Number(itemEncontrado.peso_kg) || 0) * cantidad;
        }
        const unidadItem = item?.unidad || "KGM";
        return acc + toKg(cantidad, unidadItem);
      }, 0);

      // 2) Convertir al unit seleccionado
      const totalEnUnidad = fromKg(totalKg, unidadTotal);

      // 3) Guardar
      setPesoTotalCalculado(round(totalEnUnidad, 3));
    };

    actualizarPesoTotal();
  }, [guiaTransporte.detalle, guiaTransporte.guia_Envio_Und_Peso_Total]);

  const validarGuia = async () => {
    try {
      let guiaATestear = guiaTransporte;
      switch (tipoGuia) {
        case "transporte-privado":
          guiaATestear = {
            ...guiaATestear,
            ...guiaDatosPrivado,
          };
          break;
        case "transporte-publico":
          guiaATestear = {
            ...guiaATestear,
            ...guiaDatosPublico,
          };
          break;
        case "traslado-misma-empresa":
          guiaATestear = {
            ...guiaATestear,
            ...guiaDatosInternos,
          };
          break;
        default:
          break;
      }
      // ** Validadr los campos antes de emitir al servidor de factiliza
      const { errores, validos, message } = await validarFormulario(
        tipoGuia,
        guiaATestear,
      );

      if (!validos) {
        // *Encuentra el primer error y lo muestra en un toast
        const primerError = Object.values(errores)[0];
        if (primerError) {
          toast.error(primerError);
        } else {
          toast.error("El formulario contiene errores. Revise los campos.");
        }

        // *Opcional: Si quieres guardar todos los errores en el estado
        setGuiaTransporteValida(errores);

        return false;
      } else {
        toast.success(message);
        setGuiaTransporteValida(null); // ?Limpia los errores del estado si todo es válido
        return true;
      }
    } catch (error) {
      toast.error(error.message || "Error al validar la guía de remisión.");
      return false;
    }
  };

  const EmitirGuia = async () => {
    const { id: id_logeado } = await JSON.parse(localStorage.getItem("user"));
    let result = {
      success: false,
      message: "Error desconocido al emitir la nota",
      data: null,
    };
    try {
      let guiaAEmitir = guiaTransporte;
      switch (tipoGuia) {
        case "transporte-privado":
          guiaAEmitir = {
            ...guiaAEmitir,
            ...guiaDatosPrivado,
          };
          break;
        case "transporte-publico":
          guiaAEmitir = {
            ...guiaAEmitir,
            ...guiaDatosPublico,
          };
          break;
        case "traslado-misma-empresa":
          guiaAEmitir = {
            ...guiaAEmitir,
            ...guiaDatosInternos,
          };
          break;
        default:
          break;
      }
      const {
        status: status_factiliza,
        success: succes_factiliza,
        message: message_factiliza,
        data: data_factiliza,
      } = await factilizaService.enviarGuia(guiaAEmitir);
      if (status_factiliza === 200  && data_factiliza?.sunatResponse?.cdrResponse?.code == "0") {
        let sunat_respuest = {
          hash: data_factiliza?.hash ?? null,
          mensaje: message_factiliza ?? null,
          cdr_zip: data_factiliza?.sunatResponse?.cdrZip ?? null,
          sunat_success: data_factiliza?.sunatResponse?.success ?? null,
          cdr_response_id: data_factiliza?.sunatResponse?.cdrResponse.id,
          cdr_response_code: data_factiliza?.sunatResponse?.cdrResponse.code,
          cdr_response_description:
            data_factiliza.sunatResponse?.cdrResponse?.description,
        };
        let guiaEstructurada = {
          ...guiaTransporte,
          estado: "EMITIDA",
        };
        if (tipoGuia == "transporte-privado") {
          guiaEstructurada = {
            ...guiaEstructurada,
            ...guiaDatosPrivado,
          };
        } else if (tipoGuia == "traslado-misma-empresa") {
          guiaEstructurada = {
            ...guiaEstructurada,
            ...guiaDatosInternos,
          };
        } else {
          const { transportista, ...guiaDPublico } = guiaDatosPublico;
          guiaEstructurada = {
            ...guiaEstructurada,
            ...guiaDPublico,
            chofer: [transportista, ...guiaEstructurada.chofer],
          };
        }
        let guiaCopia = {
          ...guiaEstructurada,
          usuario_id: id_logeado,
          sunat_respuesta: sunat_respuest,
        };

        const { status, success, message } =
          await RegistrarBaseDatos(guiaCopia);

        if (success) {
          result = {
            success: true,
            message:
              message || "Guía de remisión emitida y registrada con éxito.",
            status: 200,
          };
        } else {
          result = {
            success: false,
            message:
              message ||
              "Guia emitida, pero no se pudo registrar en la base de datos.",
            data: guiaTransporte,
            status: 400,
          };
        }
      } else if (status_factiliza === 200 && data_factiliza?.sunatResponse?.cdrResponse?.code != "0") {
        result = {
          success: false,
          message: message_factiliza,
          detailed_message:
            `${data.error.code} - ${data.error.message}` ||
            "Error desconocido al enviar la factura.",
          data: data_factiliza,
          status: status_factiliza,
        };
      } else {
        result = {
          success: false,
          message: message_factiliza,
          detailed_message:
            `${data.error.code} - ${data.error.message}` ||
            "Error desconocido al enviar la guia.",
          data: null,
          status: status_factiliza,
        };
      }
    } catch (error) {
      if (error.response) {
        result = {
          success: false,
          message:
            error.response.data?.message ||
            error.response.data?.error ||
            "Error al comunicarse con la API.",
          data: error.response.data,
          status: error.response.status,
        };
        return {
          success: false,
          message:
            error.response.data?.message ||
            error.response.data?.error ||
            "Error al comunicarse con la API.",
          data: error.response.data,
          status: error.response.status,
        };
      } else {
        return {
          success: false,
          message: error.message || "Ocurrió un error inesperado.",
          data: null,
          status: 500,
        };
      }
    } finally {
      return result;
    }
  };

  const RegistrarBaseDatos = async (documento) => {
    try {
      const { status, success, message } = await toast.promise(
        facturaService.registrarGuiaRemision(documento),
        {
          pending: "Registrando factura en la base de datos...",
          success: "Factura registrada conxito en la base de datos de INNOVA.",
          error: `No se pudo registrar la factura`,
        },
      );
      if (status === 201) {
        Limpiar();
        if (tipoGuia == "transporte-privado") {
          setGuiaDatosPrivado(ValoresPrivado);
        } else if (tipoGuia == "transporte-publico") {
          setGuiaDatosPublico(ValoresPublico);
        } else if (tipoGuia == "traslado-misma-empresa") {
          setGuiaDatosInternos(ValoresInterno);
        }
      }
      return { status, success, message };
    } catch (error) {
      console.log("error", error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          toast.error(data.mensaje);
        }
      }
      return { status: 500, success: false, message: error.message };
    }
  };

  const Limpiar = () => {
    setGuiaTransporte({
      ...guiaInical,
      empresa_Ruc: guiaTransporte.empresa_Ruc,
      serie: guiaTransporte.serie,
    });
    setGuiaDatosPublico(ValoresPublico);
    setGuiaDatosInternos(ValoresInterno);
    buscarCorrelativo();
  };

  return (
    <GuiaTransporteContext.Provider
      value={{
        serieGuia,
        buscarCorrelativo,
        correlativos,
        setCorrelativos,
        correlativoEstado,
        setCorrelativoEstado,
        loadingCorrelativo,
        setLoadingCorrelativo,
        filiales,
        productoActual,
        setProductoActual,
        guiaTransporte,
        setGuiaTransporte,
        guiaTransporteValida,
        setGuiaTransporteValida,
        guiaDatosPrivado,
        setGuiaDatosPrivado,
        guiaDatosPublico,
        setGuiaDatosPublico,
        guiaDatosInternos,
        setGuiaDatosInternos,
        validarGuia,
        tipoGuia,
        setTipoGuia,
        EmitirGuia,
        piezas,
        pesoTotalCalculado,
      }}
    >
      {children}
    </GuiaTransporteContext.Provider>
  );
}

export function useGuiaTransporte() {
  return useContext(GuiaTransporteContext);
}
