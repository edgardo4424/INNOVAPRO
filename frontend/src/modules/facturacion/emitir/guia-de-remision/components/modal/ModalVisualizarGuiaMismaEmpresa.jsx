import { useState } from "react";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext"; // Importamos el contexto correcto
import { Eye, X } from "lucide-react"; // Solo necesitamos Eye y X para previsualizar
import ModalEnviarGuia from "./ModalEnviarGuia";
import { getMotivoTrasladoDescription } from "@/modules/facturacion/utils/formateos";

export default function ModalVisualizarGuiaMismaEmpresa() {
  // ?? Obtenemos el objeto 'guiaTransporte' de nuestro contexto
  const { guiaTransporte } = useGuiaTransporte();

  // ?? Estado para controlar la visibilidad del modal
  const [open, setOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  // ?? Funciones para abrir y cerrar el modal
  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  // ?? --- Funciones de ayuda para obtener descripciones y formatos ---

  // ?? Helper para obtener la descripción del tipo de documento de la guía
  const getTipoDocGuiaDescription = (typeCode) => {
    switch (typeCode) {
      case "09":
        return "GUÍA DE REMISIÓN ELECTRÓNICA";
      // ?? Puedes añadir más tipos de documentos de guía si los manejas
      default:
        return "DOCUMENTO DE GUÍA NO ESPECIFICADO";
    }
  };

  // ?? Helper para obtener la descripción del tipo de documento del cliente/destinatario
  const getClientDocTypeDescription = (typeCode) => {
    switch (typeCode) {
      case "6":
        return "RUC";
      case "1":
        return "DNI";
      case "4":
        return "CARNET DE EXTRANJERÍA";
      default:
        return "OTRO";
    }
  };

  // ?? Helper para obtener la descripción de la modalidad de traslado
  const getModalidadTrasladoDescription = (code) => {
    switch (code) {
      case "01":
        return "TRANSPORTE PÚBLICO";
      case "02":
        return "TRANSPORTE PRIVADO";
      default:
        return "NO ESPECIFICADO";
    }
  };

  // ?? Helper para formatear fechas (asumiendo formato ISO 8601 como "YYYY-MM-DDTHH:mm:ss-ZZ:ZZ")
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString.split("T")[0]; // ?? Fallback a YYYY-MM-DD si hay error
    }
  };

  return (
    <>
      {/* Botón para abrir el modal de previsualización */}
      <button
        type="button"
        onClick={openModal}
        className="focus:ring-opacity-75 flex items-center justify-center gap-x-2 rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-green-700 hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        <Eye size={24} />
        <span className="hidden md:block">Previsualizar</span>
      </button>

      {/* Overlay y Contenido del Modal */}
      {isOpen && (
        <div className="bg-opacity-10 animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="animate-scale-in relative max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            {/* Botón para cerrar el modal */}
            <button
              className="absolute top-4 right-4 text-gray-500 transition-colors duration-200 hover:text-red-600"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            {/* Encabezado del Modal */}
            <div className="mb-6 border-b pb-4 text-center">
              <h2 className="mb-2 text-3xl font-bold text-blue-800">
                Previsualización de Guía de Remisión
              </h2>
              <p className="text-lg text-gray-700">
                Revisa los detalles de tu guía antes de emitirla.
              </p>
            </div>

            {/* --- Detalle de la Guía --- */}
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 text-gray-800">
              {/* Encabezado de la Empresa y Documento */}
              <div className="mb-6 grid grid-cols-1 gap-4 border-b border-gray-200 pb-4 md:grid-cols-2">
                <div>
                  <p className="text-xl font-bold text-blue-700">
                    TU EMPRESA S.A.C.
                  </p>
                  <p className="text-sm">
                    RUC: {guiaTransporte.empresa_Ruc || "N/A"}
                  </p>
                  <p className="text-sm">
                    DIRECCIÓN: [Tu dirección de empresa aquí]
                  </p>{" "}
                  {/* Placeholder */}
                </div>
                <div className="rounded-md border border-blue-400 bg-blue-50 p-4 text-right">
                  <p className="text-lg font-bold">
                    {getTipoDocGuiaDescription(guiaTransporte.tipo_Doc)}
                  </p>
                  <p className="text-2xl font-extrabold text-blue-900">
                    {guiaTransporte.serie}-{guiaTransporte.correlativo}
                  </p>
                </div>
              </div>

              {/* Información del Cliente/Destinatario */}
              <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
                <h3 className="text-md mb-2 border-b pb-1 font-bold text-gray-600">
                  DATOS DEL DESTINATARIO:
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <strong>Tipo Doc.:</strong>{" "}
                    {getClientDocTypeDescription(
                      guiaTransporte.cliente_Tipo_Doc,
                    )}
                  </p>
                  <p>
                    <strong>Nro. Doc.:</strong>{" "}
                    {guiaTransporte.cliente_Num_Doc || "N/A"}
                  </p>
                  <p className="col-span-full">
                    <strong>Razón Social/Nombre:</strong>{" "}
                    {guiaTransporte.cliente_Razon_Social || "N/A"}
                  </p>
                  <p className="col-span-full">
                    <strong>Dirección:</strong>{" "}
                    {guiaTransporte.cliente_Direccion || "N/A"}
                  </p>
                  <p className="col-span-full">
                    <strong>Fecha de Emisión:</strong>{" "}
                    {formatDate(guiaTransporte.fecha_Emision)}
                  </p>
                </div>
              </div>

              {/* Datos del Traslado */}
              <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
                <h3 className="text-md mb-2 border-b pb-1 font-bold text-gray-600">
                  DATOS DEL TRASLADO:
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <strong>Modalidad de Traslado:</strong>{" "}
                    {getModalidadTrasladoDescription(
                      guiaTransporte.guia_Envio_Mod_Traslado,
                    )}
                  </p>
                  <p>
                    <strong>Motivo de Traslado:</strong>{" "}
                    {getMotivoTrasladoDescription(
                      guiaTransporte.guia_Envio_Des_Traslado,
                    )}
                  </p>
                  <p>
                    <strong>Fecha de Traslado:</strong>{" "}
                    {formatDate(guiaTransporte.guia_Envio_Fec_Traslado)}
                  </p>
                  <p>
                    <strong>Peso Total Bruto:</strong>{" "}
                    {guiaTransporte.guia_Envio_Peso_Total || "0"}{" "}
                    {guiaTransporte.guia_Envio_Und_Peso_Total || "N/A"}
                  </p>
                  <p className="col-span-full">
                    <strong>Placa del Vehículo:</strong>{" "}
                    {guiaTransporte.guia_Envio_Vehiculo_Placa || "N/A"}
                  </p>
                </div>
              </div>

              {/* Punto de Partida */}
              <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
                <h3 className="text-md mb-2 border-b pb-1 font-bold text-gray-600">
                  PUNTO DE PARTIDA:
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <strong>Ubigeo:</strong>{" "}
                    {guiaTransporte.guia_Envio_Partida_Ubigeo || "N/A"}
                  </p>
                  <p className="col-span-full">
                    <strong>Dirección:</strong>{" "}
                    {guiaTransporte.guia_Envio_Partida_Direccion || "N/A"}
                  </p>
                </div>
              </div>

              {/* Punto de Llegada */}
              <div className="mb-6 rounded-md border border-gray-200 bg-white p-4">
                <h3 className="text-md mb-2 border-b pb-1 font-bold text-gray-600">
                  PUNTO DE LLEGADA:
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <strong>Ubigeo:</strong>{" "}
                    {guiaTransporte.guia_Envio_Llegada_Ubigeo || "N/A"}
                  </p>
                  <p className="col-span-full">
                    <strong>Dirección:</strong>{" "}
                    {guiaTransporte.guia_Envio_Llegada_Direccion || "N/A"}
                  </p>
                </div>
              </div>

              {/* Tabla de Detalle de Productos */}
              <div className="mb-6">
                <h3 className="text-md mb-2 border-b pb-1 font-bold text-gray-600">
                  DETALLE DE PRODUCTOS:
                </h3>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border-b px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Cant.
                        </th>
                        <th className="border-b px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Unidad
                        </th>
                        <th className="border-b px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Cód. Producto
                        </th>
                        <th className="border-b px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {guiaTransporte.detalle &&
                      guiaTransporte.detalle.length > 0 ? (
                        guiaTransporte.detalle.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b last:border-b-0 hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 text-sm">
                              {item.cantidad || "0"}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {item.unidad || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {item.cod_Producto || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {item.descripcion || "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-4 text-center text-gray-500"
                          >
                            No hay productos en el detalle.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sección de Observacion */}
              <div className="mb-6">
                <h3 className="text-md mb-2 border-b pb-1 font-bold text-gray-600">
                  OBSERVACION:
                </h3>
                <div className="rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-800">
                  {guiaTransporte.observacion ||
                    "No hay observacion registradas."}
                </div>
              </div>

              {/* Pie de página / Información Adicional */}
              <div className="mt-6 border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
                <p>Documento Generado por tu Sistema de Gestión.</p>
                <p>Para consultas, contáctanos al [Tu Teléfono] o [Tu Email]</p>
              </div>
            </div>
            {/* --- Fin Detalle de la Guía --- */}
            <div className="flex w-full justify-end pt-5">
              <ModalEnviarGuia
                open={open}
                setOpen={setOpen}
                ClosePreviu={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
