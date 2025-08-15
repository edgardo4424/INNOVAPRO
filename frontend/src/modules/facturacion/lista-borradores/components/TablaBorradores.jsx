import { ClipboardPlus, EyeIcon, Trash2Icon } from 'lucide-react';
import React from 'react'

const TablaBorradores = ({ documentos, setIdDocumento, setModalOpen, setDocumentoEliminar, setModalEliminar }) => {
  return (
    <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
      <thead className="bg-innova-blue text-white">
        <tr>
          <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">
            Tipo Borrador
          </th>
          <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">
            Serie-Correlativo
          </th>
          <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">
            Fecha Emision
          </th>
          <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">
            Empresa RUC
          </th>
          <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">
            Cliente
          </th>
          {/* <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Estado</th> */}
          <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {documentos.length > 0 ? (
          documentos.map((doc, index) => (
            <tr
              key={doc.id}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b border-gray-200`}
            >
              <td className="py-3 px-6 text-sm text-gray-700">
                {doc.tipo_borrador}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">{`${doc.serie}-${doc.correlativo}`}</td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {new Date(doc.fecha_Emision).toLocaleDateString(
                  "es-PE",
                  { year: "numeric", month: "2-digit", day: "2-digit" }
                )}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {doc.empresa_ruc}
              </td>
              <td className="py-3 px-6 text-sm text-gray-700">
                {doc.cliente_num_doc === ""
                  ? doc.cliente_razon_social
                  : `${doc.cliente_num_doc} - ${doc.cliente_razon_social}`}
              </td>
              <td className="py-3 ">
                <div className="flex justify-start pl-2  gap-x-2">
                  <button
                    onClick={() => {
                      setIdDocumento(doc.id);
                      setModalOpen(true);
                    }}
                  >
                    <EyeIcon className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                  </button>{" "}
                  <ClipboardPlus className="h-5 w-5 cursor-pointer hover:text-yellow-500" />
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
            <td
              colSpan="7"
              className="py-6 text-center text-gray-500 italic"
            >
              No hay facturas para mostrar.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default TablaBorradores
