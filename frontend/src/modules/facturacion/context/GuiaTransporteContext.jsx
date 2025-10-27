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
import { obtenerFechaActual } from "../utils/fechaEmisionActual";

const GuiaTransporteContext = createContext();

export function GuiaTransporteProvider({ children }) {
  const [guiaTransporte, setGuiaTransporte] = useState(guiaInical); // ?Datos de guia que abarcan los 3 casos
  const [pedidoId, setPedidoId] = useState(null);

  const [pesoTotalCalculado, setPesoTotalCalculado] = useState(0);
  const [pesoPlasmadoKilos, setPesoPlasmadoKilos] = useState(0);
  const [editadoPlasmado, setEditadoPlasmado] = useState(false);

  // ?? CORRELATIVOS

  const serieGuia = [{ value: "T005" }];

  const [correlativos, setCorrelativos] = useState([]);
  const [correlativosPendientes, setCorrelativosPendientes] = useState([]);
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

  // ?? trae la fecha actual para emitir la guia
  useEffect(() => {
    setGuiaTransporte((prevValores) => ({
      ...prevValores,
      fecha_Emision: obtenerFechaActual(),
      guia_Envio_Fec_Traslado: obtenerFechaActual("traslado"),
    }));
  }, []);

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

  // ?? OBTENER CORRELATIVO
  const buscarCorrelativoPendientes = async () => {
    try {
      const rucsAndSeries = filiales.map((filial) => ({
        ruc: filial.ruc,
        serieBoleta: serieBoleta,
        serieFactura: serieFactura,
      }));

      const { data } =
        await facturaService.obtenerCorrelativoPendientesGuia(rucsAndSeries);
      setCorrelativosPendientes(data);
    } catch (error) {
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

    // Convierte el valor de cualquier unidad a KILOGRAMOS (KG)
    const toKg = (value, unit) =>
      (Number(value) || 0) * (UNIT_TO_KG[unit] || 1);

    // Convierte el valor de KILOGRAMOS (KG) a la unidad deseada
    const fromKg = (kg, unit) => kg / (UNIT_TO_KG[unit] || 1);

    // Redondea un número a 'd' decimales
    const round = (n, d = 4) => {
      const m = Math.pow(10, d);
      return Math.round((n + Number.EPSILON) * m) / m;
    };

    const actualizarPesoTotal = () => {
      const detalle = Array.isArray(guiaTransporte?.detalle)
        ? guiaTransporte.detalle
        : [];
      const unidadTotal = guiaTransporte?.guia_Envio_Und_Peso_Total || "KGM";

      let totalKg = 0;

      if (editadoPlasmado) {
        totalKg = Number(pesoPlasmadoKilos) || 0;
      } else {
        totalKg = detalle.reduce((acc, item) => {
          const itemEncontrado = piezas.find(
            (p) => p.item === item.cod_Producto,
          );
          const cantidad = Number(item?.cantidad) || 0;

          if (itemEncontrado && item.unidad === "NIU") {
            return acc + (Number(itemEncontrado.peso_kg) || 0) * cantidad;
          }

          const unidadItem = item?.unidad || "KGM";
          return acc + toKg(Number(item?.peso_item) || 0, unidadItem);
        }, 0);
      }

      const totalEnUnidad = fromKg(totalKg, unidadTotal);

      setPesoTotalCalculado(round(totalEnUnidad, 4));
    };

    actualizarPesoTotal();
  }, [
    guiaTransporte.detalle,
    guiaTransporte.guia_Envio_Und_Peso_Total,
    editadoPlasmado,
    pesoPlasmadoKilos,
  ]);

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
        // toast.success(message);
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
        default:
          break;
      }
      if (pedidoId !== null) guiaAEmitir.pedido_id = pedidoId;
      const { status, success, message, data } =
        await factilizaService.enviarGuia({
          ...guiaAEmitir,
          usuario_id: id_logeado,
        });
      result = {
        status,
        success,
        message,
        data,
      };
      if (status == 200 || status == 201 || status == 400) {
        console.log("limpiar entra");
        Limpiar();
      }
    } catch (error) {
      if (error.response) {
        const { success, message, detailed_message, data, status } =
          error.response.data;
        result = {
          success: false,
          message:
            message || detailed_message || "Error al comunicarse con la API.",
          data,
          status,
        };
        return result;
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

  const Limpiar = () => {
    setGuiaTransporte({
      ...guiaInical,
      fecha_Emision: obtenerFechaActual(),
      guia_Envio_Fec_Traslado: obtenerFechaActual("traslado"),
      empresa_Ruc: guiaTransporte.empresa_Ruc,
      serie: guiaTransporte.serie,
    });
    setPesoTotalCalculado(0);
    setPesoPlasmadoKilos(0);
    setEditadoPlasmado(false);
    setTipoGuia("transporte-publico");
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
        correlativosPendientes,
        buscarCorrelativoPendientes,
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
        pedidoId,
        setPedidoId,
        setPesoTotalCalculado,
        setEditadoPlasmado,
        setPesoPlasmadoKilos,
      }}
    >
      {children}
    </GuiaTransporteContext.Provider>
  );
}

export function useGuiaTransporte() {
  return useContext(GuiaTransporteContext);
}
