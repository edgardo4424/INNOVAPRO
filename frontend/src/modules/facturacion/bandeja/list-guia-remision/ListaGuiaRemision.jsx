import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import FiltroTabla from "../../components/FiltroTabla";
import ModalVisualizarGuia from "../../components/modal/ModalVisualizarGuia";
import Paginacion from "../../components/Paginacion";
import facturaService from "../../service/FacturaService";
import ModalDescargaGuia from "./components/ModalDescargaGuia";
import TablaGuias from "./components/TablaGuias";
import ModalDescarga from "../../components/modal/ModalDescarga";

const ListaGuiaRemision = () => {
    const navigate = useNavigate();

    const [guias, setGuias] = useState([]);
    const [loading, setLoading] = useState(true);

    // ?? modales
    const [modalOpen, setModalOpen] = useState(false);
    const [modalVisualizar, setModalVisualizar] = useState(false);
    const [modalDescargar, setModalDescargar] = useState(false);
    // ?? identificador
    const [idDocumento, setIdDocumento] = useState("");
    const [guiaADescargar, setGuiaADescargar] = useState({});
    const [documentoAVisualizar, setDocumentoAVisualizar] = useState({});
    const [documentoOpciones, setDocumentoOpciones] = useState({});

    const [filtro, setFiltro] = useState({
        page: 1,
        limit: 10,
        cliente_num_doc: "",
        tip_doc: "",
        fec_des: "",
        fec_ast: "",
        empresa_ruc: "",
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchParams] = useSearchParams();

    //?? leer de la URL
    const tipo_doc = searchParams.get("tipo_doc");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const cliente_num_doc = searchParams.get("cliente_num_doc");
    const fec_des = searchParams.get("fec_des");
    const fec_ast = searchParams.get("fec_ast");
    const empresa_ruc = searchParams.get("empresa_ruc");

    const obtenerDocumentos = async () => {
        setLoading(true);
        try {
            let query = "?";

            if (tipo_doc) {
                query += `tipo_doc=${tipo_doc}`;
            }
            if (empresa_ruc) {
                query += `empresa_ruc=${empresa_ruc}`;
            }
            if (page) {
                query += `&page=${page}`;
                setCurrentPage(page);
            }
            if (limit) {
                query += `&limit=${limit}`;
                setFiltro((prev) => ({ ...prev, limit }));
            }
            if (cliente_num_doc) {
                query += `&cliente_num_doc=${cliente_num_doc}`;
                setFiltro((prev) => ({ ...prev, cliente_num_doc }));
            }
            if (fec_des) {
                query += `&fec_des=${fec_des}`;
                setFiltro((prev) => ({ ...prev, fec_des }));
            }
            if (fec_ast) {
                query += `&fec_ast=${fec_ast}`;
                setFiltro((prev) => ({ ...prev, fec_ast }));
            }
            // ?? si tu service acepta string:
            const { datos, estado, mensaje, total, meta } = await facturaService.obtenerTodasLasGuiasRemision(query);


            if (estado) {
                setGuias(datos);
                setTotalPages(meta?.totalPages || 1);
                setCurrentPage(meta?.page || 1);
                setTotalRecords(total);
            } else {
                setGuias([]);
                setTotalPages(0);
                setCurrentPage(0);
                setTotalRecords(0);
            }
        } catch (error) {
            toast.error(error.message || "Error al obtener facturas");
        } finally {
            setLoading(false);
        }
    };


    const handleAplicarFiltros = () => {
        const query = [];
        if (filtro.tip_doc != "") query.push(`tipo_doc=${filtro.tip_doc}`);
        if (filtro.cliente_num_doc != "")
            query.push(`cliente_num_doc=${filtro.cliente_num_doc}`);
        if (filtro.fec_des) query.push(`fec_des=${filtro.fec_des}`);
        if (filtro.empresa_ruc) query.push(`empresa_ruc=${filtro.empresa_ruc}`);
        if (filtro.fec_ast) query.push(`fec_ast=${filtro.fec_ast}`);
        if (filtro.limit != "") query.push(`limit=${filtro.limit}`);

        navigate(`?${query.join("&")}&page=1`);
    };

    const handleLimpiarFiltros = () => {
        setFiltro({
            page: 1,
            limit: 10,
            cliente_num_doc: "",
            tip_doc: "",
            fec_des: "",
            fec_ast: "",
            empresa_ruc: "",
        });
        navigate(`?limit=10&page=1`);
    };

    const handlePageChange = (newPage) => {
        // Evita navegaciones inválidas
        if (newPage < 1 || newPage > totalPages) return;

        const currentParams = Object.fromEntries(searchParams.entries());
        const newParams = { ...currentParams, page: newPage };

        const newQuery = new URLSearchParams(newParams).toString();
        navigate(`?${newQuery}`);
    };


    useEffect(() => {
        obtenerDocumentos();
    }, [searchParams]);

    const documentTypes = [
        { name: "Todos", value: "" }, ,
    ];

    return (
        <div className=" max-w-7xl mx-auto flex flex-col items-center px-4 md:px-2 py-6">
            <div className="w-full max-w-6xl">
                <div className="flex items-center justify-between mb-6 ">
                    <h2 className="text-2xl md:text-3xl font-bold ">
                        Lista de Guias de Remision
                    </h2>
                </div>
            </div>

            {/* Filtros */}
            <FiltroTabla
                filtro={filtro}
                setFiltro={setFiltro}
                documentTypes={documentTypes}
                handleAplicarFiltros={handleAplicarFiltros}
                handleLimpiarFiltros={handleLimpiarFiltros}
            />

            <div className="w-full">
                {loading ? (
                    <div className="flex justify-center items-center py-8 flex-col ">
                        <LoaderCircle className="animate-spin text-blue-500 " size={200} />
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-600  ">
                            Cargando...
                        </h2>
                    </div>
                ) : guias.length === 0 ? (
                    <div className="w-full max-w-6xl">
                        <div className="flex items-center justify-between mb-6"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                            No hay Guias de Remision
                        </h2>
                    </div>
                ) : (
                    <div className="overflow-x-auto  ">
                        <TablaGuias
                            documentos={guias}
                            setModalOpen={setModalVisualizar}
                            setModalDescargar={setModalDescargar}
                            setIdDocumento={setIdDocumento}
                            setGuiaADescargar={setGuiaADescargar}
                            setDocumentoAVisualizar={setDocumentoAVisualizar}
                            documentoOpciones={documentoOpciones}
                            setDocumentoOpciones={setDocumentoOpciones}
                        />

                        {/* Modal */}
                        {modalVisualizar && documentoAVisualizar && (
                            <ModalVisualizarGuia
                                setModalOpen={setModalVisualizar}
                                documentoAVisualizar={documentoAVisualizar}
                                setDocumentoAVisualizar={setDocumentoAVisualizar}
                            />
                        )}
                        {modalDescargar && idDocumento && (
                            <ModalDescarga
                                id_documento={idDocumento}
                                setIdDocumento={setIdDocumento}
                                setModalOpen={setModalDescargar}
                                documentoADescargar={guiaADescargar}
                                setDocumentoADescargar={setGuiaADescargar}
                            />
                        )}
                    </div>
                )}
                <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    limit={limit}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>

    );
};

export default ListaGuiaRemision;
