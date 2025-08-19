import { ChevronLeft, ChevronRight, Download, EyeIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ModalVisualizarDocumento from "../components/modal/ModalVisualizarDocumento";
import facturaService from "../service/FacturaService";
import TablaDocumentos from "./components/TablaDocumentos";
import FiltroTabla from "../components/FiltroTabla";

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
        <div className="w-max-7xl flex flex-col items-center px-4 md:px-2 py-6">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-6 ">
                    <h2 className="text-xl md:text-2xl font-bold ">
                        Lista de Documentos
                    </h2>
                </div>
            </div>

            {/* Filtros */}
            <FiltroTabla
                filtro={filtro}
                setFiltro={setFiltro}
                applyFilters={applyFilters}
                documentTypes={documentTypes}
            />

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
                    <TablaDocumentos
                        documentos={facturas}
                        setModalOpen={setModalOpen}
                        setIdDocumento={setIdDocumento} />

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
