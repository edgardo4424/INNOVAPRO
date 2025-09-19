import { ClipboardPlus, EyeIcon, Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import facturaService from "../../service/FacturaService";

const TablaBorradores = ({
  documentos,
  setIdDocumento,
  setModalOpen,
  setDocumentoEliminar,
  setModalEliminar,
}) => {
  const navigate = useNavigate();

  const plasmarBorrador = async (doc) => {
    const { success, message, data } =
      await facturaService.obtenerBorradorConId(doc.id);

    if (!success) {
      toast.error("No se pudo plasmar el borrador");
      return;
    }

    const body = JSON.parse(data.body);
    const documento = [body, { borr_id_delete: doc.id }];
    if (doc.tipo_borrador == "factura" || doc.tipo_borrador == "boleta") {
      navigate("/facturacion/emitir/factura-boleta", { state: documento });
    } else {
      navigate("/facturacion/emitir/nota", { state: documento });
    }
  };

  return (
    <table className="min-w-full overflow-hidden rounded-xl bg-white shadow-md">
      <thead className="bg-innova-blue text-white">
        <tr>
          <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
            Tipo Borrador
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
            Serie-Correlativo
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
            Fecha Emision
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
            Empresa RUC
          </th>
          <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
            Cliente
          </th>
          {/* <th className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider">Estado</th> */}
          <th className="px-3 py-3 text-left text-xs font-semibold tracking-wider uppercase">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {documentos.length > 0 ? (
          documentos.map((doc, index) => (
            <tr
              key={doc.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b border-gray-200`}
            >
              <td className="px-6 py-3 text-xs text-gray-700">
                {doc.tipo_borrador}
              </td>
              <td className="px-6 py-3 text-xs text-gray-700">{`${doc.serie}-${doc.correlativo}`}</td>
              <td className="px-6 py-3 text-xs text-gray-700">
                {new Date(doc.fecha_Emision).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
              <td className="px-6 py-3 text-xs text-gray-700">
                {doc.empresa_ruc}
              </td>
              <td className="px-6 py-3 text-xs text-gray-700">
                {doc.cliente_num_doc === ""
                  ? doc.cliente_razon_social
                  : `${doc.cliente_num_doc} - ${doc.cliente_razon_social}`}
              </td>
              <td className="py-3">
                <div className="flex justify-start gap-x-2 pl-2">
                  <button
                    onClick={() => {
                      setIdDocumento(doc.id);
                      setModalOpen(true);
                    }}
                  >
                    <EyeIcon className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                  </button>{" "}
                  <button onClick={() => plasmarBorrador(doc)}>
                    <ClipboardPlus className="h-5 w-5 cursor-pointer hover:text-yellow-500" />
                  </button>
                  <button
                    onClick={() => {
                      setDocumentoEliminar({
                        id: doc.id,
                        correlativo: `${doc.serie}-${doc.correlativo}`,
                      });
                      setModalEliminar(true);
                    }}
                  >
                    <Trash2Icon className="h-5 w-5 cursor-pointer hover:text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="py-6 text-center text-gray-500 italic">
              No hay facturas para mostrar.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TablaBorradores;
