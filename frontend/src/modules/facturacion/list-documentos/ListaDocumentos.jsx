import { ChevronLeft, ChevronRight, Download, EyeIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ModalVisualizarDocumento from "../components/modal/ModalVisualizarDocumento";
import facturaService from "../service/FacturaService";

const ListaDocumentos = () => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [idDocumento, setIdDocumento] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    //?? leer de la URL
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const num_doc = searchParams.get("num_doc") || "";
    const tip_doc = searchParams.get("tip_doc") || "";
    const fec_des = searchParams.get("fec_des") || "";
    const fec_ast = searchParams.get("fec_ast") || "";

    // ?? estado controlado de filtros
    const [filtro, setFiltro] = useState({ page, limit, num_doc, tip_doc, fec_des, fec_ast });

    // ?? Sincroniza estado local si cambian los searchParams
    useEffect(() => {
        setFiltro({ page, limit, num_doc, tip_doc, fec_des, fec_ast });
    }, [page, limit, num_doc, tip_doc, fec_des, fec_ast]);

    const buildQueryParams = () => {
        const params = new URLSearchParams();
        params.set("tipo", "todas");
        params.set("page", filtro.page);
        params.set("limit", filtro.limit);
        if (filtro.num_doc) params.set("num_doc", filtro.num_doc);
        if (filtro.tip_doc) params.set("tip_doc", filtro.tip_doc);
        if (filtro.fec_des) params.set("fec_des", filtro.fec_des);
        if (filtro.fec_ast) params.set("fec_ast", filtro.fec_ast);
        return `?${params.toString()}`;
    };

    const obtenerFacturas = async () => {
        setLoading(true);
        try {
            // ?? si tu service acepta string:
            const query = buildQueryParams();
            const { estado, total, facturas } = await facturaService.obtenerTodasLasFacturas(query);

            if (estado) {
                setFacturas(facturas);
                setTotal(total);
            } else {
                setFacturas([]);
                setTotal(0);
            }
        } catch (error) {
            toast.error(error.message || "Error al obtener facturas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerFacturas();
        // ?? eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]); // ?? cada que cambien los params, recarga

    const applyFilters = () => {
        const params = {};
        params.page = filtro.page || 1;
        params.limit = filtro.limit || 10;
        if (filtro.num_doc) params.num_doc = filtro.num_doc;
        if (filtro.tip_doc) params.tip_doc = filtro.tip_doc;
        if (filtro.fec_des) params.fec_des = filtro.fec_des;
        if (filtro.fec_ast) params.fec_ast = filtro.fec_ast;

        setSearchParams(params);
    };

    const goToPage = (p) => {
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            page: p,
        });
    };

    const documentTypes = [
        { name: "Todos", value: "" },
        { name: "Factura", value: "01" },
        { name: "Boleta", value: "03" },
    ];

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="w-full flex flex-col items-center px-4 md:px-2 py-6">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-6 ">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Lista de Documentos
                    </h2>
                </div>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8 p-6 bg-white rounded-xl shadow-md items-end border-2">
                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-600 text-sm">Buscar por Nro. Doc Cliente:</label>
                    <input
                        type="text"
                        placeholder="Ej. 20123456789"
                        value={filtro.num_doc}
                        onChange={(e) => setFiltro((f) => ({ ...f, num_doc: e.target.value, page: 1 }))}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-600 text-sm">Tipo de Documento:</label>
                    <select
                        value={filtro.tip_doc}
                        onChange={(e) => setFiltro((f) => ({ ...f, tip_doc: e.target.value, page: 1 }))}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')]"
                    >
                        {documentTypes.map((type) => (
                            <option key={type.value} value={type.value}>{type.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-600 text-sm">Fecha Desde:</label>
                    <input
                        type="date"
                        value={filtro.fec_des}
                        onChange={(e) => setFiltro((f) => ({ ...f, fec_des: e.target.value, page: 1 }))}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-600 text-sm">Fecha Hasta:</label>
                    <input
                        type="date"
                        value={filtro.fec_ast}
                        onChange={(e) => setFiltro((f) => ({ ...f, fec_ast: e.target.value, page: 1 }))}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-600 text-sm">Items por Página:</label>
                    <select
                        value={filtro.limit}
                        onChange={(e) => setFiltro((f) => ({ ...f, limit: Number(e.target.value), page: 1 }))}
                        className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px] bg-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_16_16%27%3E%3Cpath_fill=%27none%27_stroke=%27%23343a40%27_stroke-linecap=%27round%27_stroke-linejoin%27round%27_stroke-width=%272%27_d=%27M2_5l6_6_6-6%27/%3E%3C/svg%3E')]"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={1000}>FULL</option>
                    </select>
                </div>

                <button
                    className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1 mt-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    onClick={applyFilters}
                >
                    Aplicar Filtros
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-8 flex-col ">
                    <LoaderCircle className="animate-spin text-blue-500 " size={200} />
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-600  ">
                        Cargando...
                    </h2>
                </div>
            ) : facturas.length === 0 ? (
                <div className="w-full max-w-6xl">
                    <div className="flex items-center justify-between mb-6"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                        No hay facturas
                    </h2>
                </div>
            ) : (
                <div className="overflow-x-auto border-1 rounded-xl border-gray-300 ">
                    <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
                        <thead className="bg-innova-blue text-white">
                            <tr>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Serie-Correlativo</th>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Fecha Emision</th>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Empresa RUC</th>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Nro. Doc - Cliente</th>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Valor Venta</th>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Sub Total</th>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Monto Imp. Venta</th>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Estado</th>
                                <th className="py-3 px-3 text-left text-sm font-semibold uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.map((factura, index) => (
                                <tr key={factura.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200`}>
                                    <td className="py-3 px-6 text-sm text-gray-700">{`${factura.serie}-${factura.correlativo}`}</td>
                                    <td className="py-3 px-6 text-sm text-gray-700">
                                        {new Date(factura.fecha_emision).toLocaleDateString("es-PE", { year: "numeric", month: "2-digit", day: "2-digit" })}
                                    </td>
                                    <td className="py-3 px-6 text-sm text-gray-700">{factura.empresa_ruc}</td>
                                    <td className="py-3 px-6 text-sm text-gray-700">
                                        {factura.cliente_num_doc
                                            ? `${factura.cliente_num_doc} - ${factura.cliente_razon_social}`
                                            : factura.cliente_razon_social}
                                    </td>
                                    <td className="py-3 px-6 text-sm text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.valor_venta.toFixed(2)}`}</td>
                                    <td className="py-3 px-6 text-sm text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.sub_total.toFixed(2)}`}</td>
                                    <td className="py-3 px-6 text-sm text-gray-700 font-medium">{`${factura.tipo_moneda} ${factura.monto_imp_venta.toFixed(2)}`}</td>
                                    <td className={`py-3 px-6 text-sm font-semibold ${factura.estado === "Anulada" ? "text-red-500" : "text-green-500"} `}>
                                        {factura.estado}
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="flex justify-start gap-x-2">
                                            <button onClick={() => { setIdDocumento(factura.id); setModalOpen(true); }}>
                                                <EyeIcon className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                                            </button>
                                            <Download className="h-5 w-5 cursor-pointer hover:text-green-500" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
            )}

            {/* Paginación */}
            {!loading && total > 0 && (
                <div className="flex items-center justify-between py-4 w-full max-w-6xl">
                    <button
                        className="py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-200 cursor-pointer disabled:opacity-50"
                        onClick={() => goToPage(page - 1)}
                        disabled={page <= 1}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <span className="text-sm">
                        Página {page} de {totalPages}
                    </span>

                    <button
                        className="py-2 px-4 bg-gray-200 rounded-md shadow-sm hover:bg-gray-200 cursor-pointer disabled:opacity-50"
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListaDocumentos;
