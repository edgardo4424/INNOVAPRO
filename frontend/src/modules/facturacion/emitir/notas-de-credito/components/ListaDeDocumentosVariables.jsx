import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import facturaService from "@/modules/facturacion/service/FacturaService";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ValorInicialDetalleNota } from "../utils/valoresInicialNota";
import { formatearFecha } from "@/modules/facturacion/utils/formatearFecha";

const ListaDeDocumentosVariables = ({ closeModal }) => {
  const {
    notaCreditoDebito,
    setNotaCreditoDebito,
    setIdDocumento,
    setIdFactura,
    setDocumentoAAfectar,
  } = useNota();

  const [tipoDocumento, setTipoDocumento] = useState("");
  const [loadingDocumentos, setLoadingDocumentos] = useState(true);

  const { empresa_Ruc, tipo_Doc: nCD } = notaCreditoDebito;

  const [documentosRelacionados, setDocumentosRelacionados] = useState([]);
  const [filtro, setFiltro] = useState("");

  // Filtrar documentos por serie y correlativo
  const documentosFiltrados = documentosRelacionados.filter((doc) =>
    `${doc.serie} ${doc.correlativo}`
      .toLowerCase()
      .includes(filtro.toLowerCase()),
  );

  useEffect(() => {
    const cargarDocumentos = async () => {
      setLoadingDocumentos(true);
      try {
        if (tipoDocumento === "09") {
          const { message, status, data, count } =
            await facturaService.obtenerDocumentosARelacionar({
              ruc: empresa_Ruc,
            });
          setDocumentosRelacionados(data);
        } else if (tipoDocumento === "01") {
          const { message, status, data, count } =
            await facturaService.obtenerDocumentosParaNotas({
              ruc: empresa_Ruc,
              tipo_Doc: tipoDocumento,
            });
          setDocumentosRelacionados(data);
        } else if (tipoDocumento === "03") {
          const { message, status, data, count } =
            await facturaService.obtenerDocumentosParaNotas({
              ruc: empresa_Ruc,
              tipo_Doc: tipoDocumento,
            });
          setDocumentosRelacionados(data);
        }
      } catch (error) {
        console.error("Error al cargar piezas", error);
      } finally {
        setFiltro("");
        setLoadingDocumentos(false);
      }
    };
    cargarDocumentos();
  }, [tipoDocumento]);

  const handleClick = (doc) => {
    console.log(doc);
    // Determinar serie en base al tipo de documento afectado y tipo de nota
    const getSerie = (tipoDoc, tipoNota) => {
      const seriesMap = {
        "01": { "07": "FCT1", "08": "FDT1" }, // Factura → Nota Crédito o Débito
        "03": { "07": "BCT1", "08": "BDT1" }, // Boleta → Nota Crédito o Débito
      };
      return seriesMap[tipoDoc]?.[tipoNota] || null;
    };

    const serieAsignada = getSerie(doc.tipo_Doc, nCD);

    // ?Rellenamos los datos de la factura/boleta a afectar
    setNotaCreditoDebito({
      ...notaCreditoDebito,
      // ?ASIGNAR SERIE
      serie: serieAsignada,
      // ?fecha emision afectado
      fecha_Emision_Afectado: doc.fecha_Emision,
      // ?Datos del comprobante
      tipo_Operacion: doc.tipo_Operacion,
      tipo_Moneda: doc.tipo_Moneda,
      // ?Datos del cliente
      cliente_Tipo_Doc: doc.cliente_Tipo_Doc,
      cliente_Num_Doc: doc.cliente_Num_Doc,
      cliente_Razon_Social: doc.cliente_Razon_Social,
      cliente_Direccion: doc.cliente_Direccion,

      // ?Datos del afectado
      afectado_Tipo_Doc: doc.tipo_Doc,
      afectado_Num_Doc: `${doc.serie}-${doc.correlativo}`,
      motivo_Cod: "",
      motivo_Des: "",

      // // ?Valores inciales en detalles
      ...ValorInicialDetalleNota,
    });

    // ?Rellenamos los datos del documento a parte para poder tener mejor manejo de ellos
    setDocumentoAAfectar({
      factura_id:
        doc.tipo_Doc === "01" || doc.tipo_Doc === "03" ? doc.id : null,
      guia_id: doc.tipo_Doc === "09" ? doc.id : null,

      // ?Fecha emision
      // fecha_Emision: doc.fecha_Emision,
      // ?Montos
      monto_Igv: Number(doc.monto_Igv),
      total_Impuestos: Number(doc.total_Impuestos),
      valor_Venta: Number(doc.valor_Venta),
      monto_Oper_Gravadas: Number(doc.monto_Oper_Gravadas),
      monto_Oper_Exoneradas: Number(doc.monto_Oper_Exoneradas),
      sub_Total: Number(doc.sub_Total),
      monto_Imp_Venta: Number(doc.monto_Imp_Venta),

      // ?Productos
      detalle: doc.detalle_facturas.map((detalle) => ({
        id: detalle.id,
        unidad: detalle.unidad,
        cantidad: Number(detalle.cantidad),
        cod_Producto: detalle.cod_Producto,
        descripcion: detalle.descripcion,
        monto_Valor_Unitario: Number(detalle.monto_Valor_Unitario),
        monto_Base_Igv: Number(detalle.monto_Base_Igv),
        porcentaje_Igv: Number(detalle.porcentaje_Igv),
        igv: Number(detalle.igv),
        tip_Afe_Igv: detalle.tip_Afe_Igv,
        total_Impuestos: Number(detalle.total_Impuestos),
        monto_Precio_Unitario: Number(detalle.monto_Precio_Unitario),
        monto_Valor_Venta: Number(detalle.monto_Valor_Venta),
        factor_Icbper: Number(detalle.factor_Icbper),
      })),
      legend: doc.legend_facturas[0] ? [doc.legend_facturas[0]] : [],
    });

    closeModal();
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Selecciona El tipo</Label>
          <Select
            name="tipo_operacion"
            value={tipoDocumento}
            onValueChange={(value) => setTipoDocumento(value)}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              {" "}
              {/* Estilo de borde mejorado */}
              <SelectValue placeholder="Selecciona un tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="01">Factura</SelectItem>
              <SelectItem value="03">Boleta</SelectItem>
              {/* <SelectItem value="09">Guia de Remision</SelectItem> */}
              {/* <SelectItem value="04">Nota de Credito</SelectItem> */}
              {/* <SelectItem value="06">Nota de Debito</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Buscar por serie y correlativo</Label>
          <Input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Ej: serie - correlativo"
            className="border-1 border-gray-400 uppercase"
          />
        </div>
      </div>

      {/* Scroll vertical aquí */}
      <div className="mt-6 w-full overflow-x-auto">
        <div className="max-h-[300px] overflow-y-auto">
          <Table className="border-2 border-gray-200">
            <TableHeader className="border-b-2 border-gray-400 bg-gray-100">
              <TableRow>
                <TableHead>Serie</TableHead>
                <TableHead>Correlativo</TableHead>
                <TableHead>Fecha Emision</TableHead>
              </TableRow>
            </TableHeader>

            {loadingDocumentos ? (
              <TableBody className="bg-gray-200">
                <TableRow>
                  <TableCell className="flex justify-center py-6 text-center text-gray-500 italic">
                    <span className="flex items-center text-gray-600">
                      <LoaderCircle className="h-5 w-5 animate-spin text-gray-600" />
                      Cargando...
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody className="bg-gray-200">
                {documentosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-6 text-center text-gray-500 italic"
                    >
                      ⚠️ No hay documentos que coincidan con la búsqueda.
                    </TableCell>
                  </TableRow>
                ) : (
                  documentosFiltrados
                    .sort((a, b) => b.id - a.id)
                    .map((item, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleClick(item)}
                        className={"cursor-pointer hover:bg-gray-300"}
                      >
                        <TableCell>{item.serie || ""} </TableCell>
                        <TableCell>{item.correlativo || ""}</TableCell>
                        <TableCell>
                          {formatearFecha(item.fecha_Emision) || ""}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ListaDeDocumentosVariables;
