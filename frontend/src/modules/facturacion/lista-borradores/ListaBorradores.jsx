import React, { useEffect, useState } from 'react'
import facturaService from '../service/FacturaService';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, EyeIcon, LoaderCircle } from 'lucide-react';
import { ClipboardPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useParams, useSearchParams } from 'react-router-dom';
import ModalVisualizarDocumento from '../components/modal/ModalVisualizarDocumento';

const ListaBorradores = () => {

  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    page: 1,
    limit: 10,
    num_doc: '',
    tip_doc: '',
    fec_des: '',
    fec_ast: ''
  });


  const [modalOpen, setModalOpen] = useState(false);
  const [idDocumento, setIdDocumento] = useState("");

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const num_doc = searchParams.get("num_doc");
  const tip_doc = searchParams.get("tip_doc");
  const fec_des = searchParams.get("fec_des");
  const fec_ast = searchParams.get("fec_ast");

  console.log("page", page);
  console.log("limit", limit);
  console.log("num_doc", num_doc);
  console.log("tip_doc", tip_doc);
  console.log("fec_des", fec_des);
  console.log("fec_ast", fec_ast);

  const obtenerFacturas = async () => {
    setLoading(true);
    try {
      let query = "?tipo=borrador"
      if (page) query += `&page=${page}`;
      if (limit) query += `&limit=${limit}`;
      if (num_doc) query += `&num_doc=${num_doc}`;
      if (tip_doc) query += `&tip_doc=${tip_doc}`;
      if (fec_des) query += `&fec_des=${fec_des}`;
      if (fec_ast) query += `&fec_ast=${fec_ast}`;
      const { estado, total, facturas } = await facturaService.obtenerTodasLasFacturas(query);
      if (estado && total > 0) {
        {
          setFacturas(facturas)
        }
      };
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Error al obtener facturas");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    obtenerFacturas();
  }, [searchParams]);



  //? --- Opciones para los selectores ---
  const documentTypes = [
    {
      name: 'Todos',
      value: '',
    },
    {
      name: 'Factura',
      value: '01',
    },
    {
      name: 'Boleta',
      value: '03',
    },
  ];

  return (
    <div className=" w-full flex flex-col items-center px-4 md:px-2 py-6">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6 ">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
            Lista de Borradores
          </h2>
        </div>
      </div>

      {/* --- Contenedor de Filtros --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8 p-6 bg-white rounded-xl shadow-md items-end border-2">
        <div className="flex flex-col">
          <label htmlFor="search" className="mb-2 font-semibold text-gray-600 text-sm">Buscar por ID/Cliente:</label>
          <input
            type="text"
            id="search"
            placeholder="Ej. F001-0001 o Juan Pérez"
            value={filtro.num_doc}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="docType" className="mb-2 font-semibold text-gray-600 text-sm">Tipo de Documento:</label>
          <select
            id="docType"
            value={filtro.tip_doc}
            // onChange={(e) => setFilterDocType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')]"
          >
            {documentTypes.map(type => (
              <option key={type} value={type.value}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-600 text-sm">Fecha Desde:</label>
          <input
            type="date"
            value={filtro.fec_des}
            // onChange={(e) => setFilterDateFrom(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-600 text-sm">Fecha Hasta:</label>
          <input
            type="date"
            value={filtro.fec_ast}
            // onChange={(e) => setFilterDateTo(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="docType" className="mb-2 font-semibold text-gray-600 text-sm">Items por Página:</label>
          <select
            id="docType"
            // value={filtro.tip_doc}
            // onChange={(e) => setFilterDocType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')]"
          >
            {/* {documentTypes.map(type => ( */}
            {/* <option key={type} value={type.value}>{type.name}</option> */}
            {/* ))} */}
            <option value="1">5</option>
            <option value="1">10</option>
            <option value="1">20</option>
            <option value="1">FULL</option>
          </select>
        </div>

        {/* Botón para "Aplicar Filtros" (en una app real, esto activaría el filtrado) */}
        <button
          className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1 mt-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        // onClick={() => console.log('Aplicar filtros con:', { searchTerm, filterDocType, filterStatus, filterDateFrom, filterDateTo })}
        >
          Aplicar Filtros
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8 flex-col ">
          <LoaderCircle className='animate-spin text-blue-500 ' size={200} />
          <h2 className='text-2xl md:text-3xl font-bold text-blue-600  '>Cargando...</h2>
        </div>
      )
        : (
          facturas.length == 0 ? (
            <div className="w-full max-w-6xl">
              <div className="flex items-center justify-between mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                No hay facturas
              </h2>
            </div>
          ) :
            (
              <div className="overflow-x-auto border-1 rounded-xl border-gray-300 ">{/* --- Tabla de Facturas --- */}
                <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Serie-Correlativo</th>
                      <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Fecha Emision</th>
                      <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Empresa RUC</th>
                      <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Cliente</th>
                      <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Valor Venta</th>
                      <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Sub Total</th>
                      <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Monto Imp. Venta</th>
                      {/* <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Estado</th> */}
                      <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturas.length > 0 ? (
                      facturas.map((factura, index) => (
                        <tr key={factura.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}>
                          <td className="py-3 px-6 text-sm text-gray-700">{`${factura.serie}-${factura.correlativo}`}</td>
                          <td className="py-3 px-6 text-sm text-gray-700">{new Date(factura.fecha_emision).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                          <td className="py-3 px-6 text-sm text-gray-700">{factura.empresa_ruc}</td>
                          <td className="py-3 px-6 text-sm text-gray-700">{factura.cliente_num_doc === '' ? factura.cliente_razon_social : `${factura.cliente_num_doc} - ${factura.cliente_razon_social}`}</td>
                          <td className="py-3 px-6 text-sm text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.valor_venta.toFixed(2)}`}</td>
                          <td className="py-3 px-6 text-sm text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.sub_total.toFixed(2)}`}</td>
                          <td className="py-3 px-6 text-sm text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.monto_imp_venta.toFixed(2)}`}</td>
                          {/* <td className="py-3 px-6 text-sm font-semibold text-gray-500">
                            {factura.estado}
                          </td> */}
                          <td className="py-3 px-6">
                            <div className="flex justify-start gap-x-2">
                              <button onClick={() => { setIdDocumento(factura.id); setModalOpen(true); }}>
                                <EyeIcon className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                              </button>                              <ClipboardPlus className="h-5 w-5 cursor-pointer hover:text-yellow-500" />
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
                {/* Modal */}
                {modalOpen && idDocumento && (
                    <ModalVisualizarDocumento
                    id_documento={idDocumento}
                    setModalOpen={setModalOpen}
                    setIdDocumento={setIdDocumento}
                  />
                )}

              </div>
            )
        )
      }

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center">
          {/* Mostrando {facturas.length} de {total} facturas */}
        </div>
        <div className="flex items-center gap-x-2">
          <button
            className="py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-200 cursor-pointer"
          // onClick={() => setPage(page - 1)}
          // disabled={page === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-x-1">
            {/* {[...Array(Math.ceil(total / 10)).keys()].map(i => ( */}
            <button
              // key={i}
              className={`py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer`}
            // onClick={() => setPage(i + 1)}
            >
              {/* {i + 1} */}
              1
            </button>
            <button
              // key={i}
              className={`py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer`}
            // onClick={() => setPage(i + 1)}
            >
              {/* {i + 1} */}
              2
            </button>
            <h2 className='py-2 px-4  text-gray-400  text-2xl'>
              ......
            </h2>
            <button
              // key={i}
              className={`py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer`}
            // onClick={() => setPage(i + 1)}
            >
              {/* {i + 1} */}
              3
            </button>
            {/* ))} */}
          </div>
          <button
            className="py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 cursor-pointer"
          // onClick={() => setPage(page + 1)}
          // disabled={page === Math.ceil(total / 10)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ListaBorradores