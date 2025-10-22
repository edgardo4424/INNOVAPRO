import { useEffect, useState, useMemo  } from "react";

import { toast } from "react-toastify";
import { useWizardContratoContext } from "../../context/WizardContratoContext";
import { obtenerTodos } from "@/modules/cotizaciones/services/cotizacionesService";
import { autocompletarCotizacion } from "../../services/contratosService";
import { mapearCotizacionAContrato } from "../../utils/mapearCotizacionAContrato";

export function usePasoOrigenCotizacion() {
  const { formData, setFormData } = useWizardContratoContext();
  
  const [cotizaciones, setCotizaciones] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar TODAS las cotizaciones y filtrar en memoria por “Condiciones Cumplidas”
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await obtenerTodos();
        const filtradas = (res || []).filter((c) => {
          const estado =
            c?.estados_cotizacion?.nombre ||
            "";
          return estado === "Por Aprobar";
        });
        setCotizaciones(filtradas);
      } catch (error) {
        console.error("❌ Error al obtener cotizaciones:", error);
        toast.error("Error al cargar cotizaciones");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Seleccionar una cotización manualmente (desde la lista)
  const seleccionarCotizacion = async (id) => {
    try {
      setLoading(true);
        if (Number(formData?.cotizacion?.id) === Number(id)) {
        // ya está seleccionada, no hagas nada
        return;
      }
      const data = await autocompletarCotizacion(id);
      console.log("DATA EN ORIGEN: ", data)
      const snapshot = mapearCotizacionAContrato(data, id);
      setFormData((prev) => ({ ...prev, cotizacion: snapshot }));
      
    } catch (error) {
      console.error(error);
      toast.error("Error al seleccionar la cotización.");
    } finally {
      setLoading(false);
    }
  };

  const limpiarSeleccion = () => {
    setFormData((prev) => ({
      ...prev,
      cotizacion: {
        entidad: {
          contacto: { id: null, nombre: "", correo: "" },
          cliente: { id: null, razon_social: "", ruc: "", domicilio_fiscal: "", cargo_representante: "", nombre_representante: "", documento_representante: "", domicilio_representante: "" },
          obra: { id: null, nombre: "", direccion: "", ubicacion: "" },
          filial: { id: null, razon_social: "", ruc: "", nombre_representante: "", documento_representante: "", cargo_representante: "", telefono_representante: "", domicilio_fiscal: "", direccion_almacen: "" },
        },
        uso: { id: null, nombre: "", resumenDespiece: {} },
        id: null, codigo_documento: "", tipo: "", moneda: "",
        duracion_alquiler: null, descuento: null,
        totales: { subtotal: null, igv: null, total: null },
      },
    }));
    
  };

  // Filtro local por texto
  const resultados = useMemo(() => {
    const texto = (query || "").toLowerCase();
    if (!texto) return cotizaciones;
    return (cotizaciones || []).filter((c) => {
      const razon =
        c?.cliente?.razon_social ||
        "";
      const obraNombre =
        c?.obra?.nombre ||
        "";
      const codigo =
        c?.codigo_documento ||
        "";
      const uso =
        c?.uso?.descripcion ||
        "";
      const tipo =
        c?.tipo_cotizacion ||
        "";
      const nombreCompleto=
        c?.usuario?.trabajador.nombres + " " + c?.usuario?.trabajador.apellidos ||
        "";

      return (
        razon.toLowerCase().includes(texto) ||
        obraNombre.toLowerCase().includes(texto) ||
        codigo.toLowerCase().includes(texto) ||
        uso.toLowerCase().includes(texto) ||
        tipo.toLowerCase().includes(texto) ||
        nombreCompleto.toLowerCase().includes(texto)
      );
    });
  }, [cotizaciones, query]);

  return {
    formData,
    query,
    setQuery,
    resultados,
    loading,
    seleccionarCotizacion,
    limpiarSeleccion,
  };
}