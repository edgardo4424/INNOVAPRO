import {
  LoaderCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ModalVisualizarBorrador from "../components/modal/ModalVisualizarBorrador";
import facturaService from "../service/FacturaService";
import FiltroBorradores from "./components/FiltroBorradores";
import PaginacionBorradores from "./components/PaginacionBorradores";
import TablaBorradores from "./components/TablaBorradores";
import ModalEliminarBorrador from "./modal/ModalEliminarBorrador";

const ListaBorradores = () => {
  const navigate = useNavigate();

  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    page: 1,
    limit: 10,
    cliente_num_doc: "",
    tip_doc: "",
    fec_des: "",
    fec_ast: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [documentoEliminar, setDocumentoEliminar] = useState(null);
  const [idDocumento, setIdDocumento] = useState("");

  const [searchParams] = useSearchParams();
  const tipo_doc = searchParams.get("tipo_doc");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const cliente_num_doc = searchParams.get("cliente_num_doc");
  const fec_des = searchParams.get("fec_des");
  const fec_ast = searchParams.get("fec_ast");

  const obtenerBorradores = async () => {
    setLoading(true);
    try {
      let query = "?";

      if (tipo_doc) {
        query += `tipo_doc=${tipo_doc}`;
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

      const { datos, estado, mensaje, total, meta } =
        await facturaService.obtenerTodosLosBorradores(query);

      if (estado) {
        // toast.success(mensaje);
        setDocumentos(datos);
        setTotalPages(meta?.totalPages || 1);
        setCurrentPage(meta?.page || 1);
        setTotalRecords(total);
      } else {
        // toast.info(mensaje); // si no hay datos, mensaje informativo
        setDocumentos([]);
        setTotalPages(1);
        setCurrentPage(1);
        setTotalRecords(0);
      }
    } catch (error) {
      toast.error(error.message || "Error al obtener documentos");
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
    if (filtro.fec_ast) query.push(`fec_ast=${filtro.fec_ast}`);
    if (filtro.limit != "") query.push(`limit=${filtro.limit}`);

    navigate(`/facturacion/borradores/?${query.join("&")}&page=1`);
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
    obtenerBorradores();
  }, [searchParams]);

  //? --- Opciones para los selectores ---
  const documentTypes = [
    {
      name: "Todos",
      value: "todos",
    },
    {
      name: "Factura",
      value: "factura",
    },
    {
      name: "Boleta",
      value: "boleta",
    },
  ];

  return (
    <div className=" max-w-7xl mx-auto flex flex-col items-center px-4 md:px-2 py-6">
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-6 ">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
            Lista de Borradores
          </h2>
        </div>
      </div>

      {/* --- Contenedor de Filtros --- */}
      <FiltroBorradores
        filtro={filtro}
        setFiltro={setFiltro}
        documentTypes={documentTypes}
        handleAplicarFiltros={handleAplicarFiltros}
      />

      <div className="w-full">
        {loading ? (
          <div className="flex justify-center items-center py-8 flex-col ">
            <LoaderCircle className="animate-spin text-[#1b274a] " size={100} />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1b274a]  ">
              Cargando...
            </h2>
          </div>
        ) : documentos.length == 0 ? (
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-between mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
              No hay facturas
            </h2>
          </div>
        ) : (
          <div className="overflow-x-auto w-full border-1 rounded-xl border-gray-300 ">
            {/* --- Tabla de Borradores --- */}
            <TablaBorradores
              documentos={documentos}
              setIdDocumento={setIdDocumento}
              setModalOpen={setModalOpen}
              setDocumentoEliminar={setDocumentoEliminar}
              setModalEliminar={setModalEliminar}
            />
            {/* Modal */}
            {modalOpen && idDocumento && (
              <ModalVisualizarBorrador
                id_documento={idDocumento}
                setModalOpen={setModalOpen}
                setIdDocumento={setIdDocumento}
              />
            )}
            {modalEliminar && documentoEliminar && (
              <ModalEliminarBorrador
                documentoEliminar={documentoEliminar}
                setModalEliminar={setModalEliminar}
                setDocumentoEliminar={setDocumentoEliminar}
                obtenerBorradores={obtenerBorradores}
              />
            )}
          </div>
        )}
        <PaginacionBorradores
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

export default ListaBorradores;
