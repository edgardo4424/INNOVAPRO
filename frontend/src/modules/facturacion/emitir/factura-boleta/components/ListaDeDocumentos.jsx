import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import facturaService from "@/modules/facturacion/service/FacturaService";
import { useEffect, useState } from "react";
import { formatearFecha } from "../../../utils/formatearFecha";

const ListaDeDocumentos = ({ closeModal }) => {

    const { factura, setFactura } = useFacturaBoleta();
    const { empresa_Ruc } = factura;

    const [documentosRelacionados, setDocumentosRelacionados] = useState([]);
    const [filtro, setFiltro] = useState("");

    // Filtrar documentos por serie y correlativo, no relacionados con la factura actual
    const documentosFiltrados = documentosRelacionados.filter(doc => {
        const existe = factura.relDocs.some(item => item.nroDoc === `${doc.serie}-${doc.correlativo}`);
        return !existe && `${doc.serie} ${doc.correlativo}`.toLowerCase().includes(filtro.toLowerCase());
    });

    useEffect(() => {
        const cargarDocumentos = async () => {
            try {
                const { message, status, data, count } = await facturaService.obtenerDocumentosARelacionar({ ruc: empresa_Ruc });
                setDocumentosRelacionados(data);
            } catch (error) {
                console.error('Error al cargar piezas', error);
            }
        };
        cargarDocumentos();
    }, [])

    const handleClick = (doc) => {
        const existe = factura.relDocs.some(item => item.nroDoc === `${doc.serie}-${doc.correlativo}`);
        if (existe) {
            toast.error("El documento ya se encuentra relacionado");
            return;
        }
        setFactura((prev) => ({
            ...prev,
            relDocs: [...prev.relDocs,
            {
                tipoDoc: doc.tipo_Doc,
                nroDoc: `${doc.serie}-${doc.correlativo}`,
            }
            ],
        }));
        closeModal();
    };


    return (
        <div >
            <div className="flex flex-col gap-1 col-span-1">
                <Label>Buscar por serie y correlativo</Label>
                <Input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Ej: serie - correlativo"
                    className="border-1 border-gray-400 uppercase"
                />
            </div>

            {/* Scroll vertical aquí */}
            <div className="w-full overflow-x-auto mt-6">
                <div className="max-h-[300px] overflow-y-auto">
                    <Table className="border-2 border-gray-200">

                        <TableHeader className="bg-gray-100 border-b-2 border-gray-400">
                            <TableRow>
                                <TableHead>Tipo. Documento</TableHead>
                                <TableHead>Serie</TableHead>
                                <TableHead>Correlativo</TableHead>
                                <TableHead>Fecha Emision</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="bg-gray-200">
                            {documentosFiltrados.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-gray-500 italic">
                                        ⚠️ No hay documentos que coincidan con la búsqueda.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                [...documentosFiltrados].sort((a, b) => b.id - a.id).map((item, index) => (
                                    <TableRow key={index}
                                        onClick={() => handleClick(item)}
                                        className={"cursor-pointer hover:bg-gray-300"}
                                    >
                                        <TableCell>{item.tipo_Doc == "09" ? "Guia Remision" : "" || ""}</TableCell>
                                        <TableCell>{item.serie || ""} </TableCell>
                                        <TableCell>{item.correlativo || ""}</TableCell>
                                        <TableCell>{formatearFecha(item.fecha_Emision) || ""}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ListaDeDocumentos
