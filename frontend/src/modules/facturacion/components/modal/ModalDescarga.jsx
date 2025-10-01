import factilizaService from '@/modules/facturacion/service/FactilizaService';
import { FileCode, FileText, Folders, X } from 'lucide-react';
import { useState } from 'react';
// npm install file-saver
import { saveAs } from 'file-saver';
import facturaService from '../../service/FacturaService';
import { toast } from 'react-toastify';
import { Await } from 'react-router-dom';

/* ================== helpers simplificados ================== */
const toDocumentoPayload = (doc = {}) => {
    const correlativoSrc = doc.correlativo ?? doc.correlativo ?? '';
    const correlativo = String(correlativoSrc).replace(/^0+/, '') || '0';
    const empresa_ruc = String(doc.numRuc ?? doc.empresa_ruc ?? doc.empresa_Ruc ?? '');
    const serie = String(doc.serie ?? '');
    const tipo_Doc = String(doc.tipoDoc ?? doc.tipo_Doc ?? '').padStart(2, '0');
    return { correlativo, empresa_ruc, serie, tipo_Doc };
};

const filenameBaseFromDoc = (doc = {}) => {
    const p = toDocumentoPayload(doc);
    if (p.empresa_ruc && p.tipo_Doc && p.serie && p.correlativo) {
        return `${p.empresa_ruc}-${p.tipo_Doc}-${p.serie}-${p.correlativo}`;
    }
    if (doc.serie && (doc.numDocumentoComprobante || doc.correlativo)) {
        return `${doc.serie}-${(doc.numDocumentoComprobante || doc.correlativo)}`;
    }
    return 'documento';
};

// Función simplificada para procesar respuestas
const processResponse = async (response, filename, type = 'auto') => {
    // Si es un string que parece XML
    if (typeof response === 'string' && response.trim().startsWith('<?xml')) {
        const blob = new Blob([response], { type: 'application/xml;charset=utf-8' });
        saveAs(blob, `${filename}.xml`);
        return;
    }
    
    // Si es un Blob directo (PDF)
    if (response instanceof Blob) {
        saveAs(response, `${filename}.pdf`);
        return;
    }
    
    // Si viene en un wrapper con blob
    if (response?.blob instanceof Blob) {
        const extension = type === 'pdf' ? '.pdf' : '.xml';
        saveAs(response.blob, `${filename}${extension}`);
        return;
    }
    
    // Si es base64
    if (typeof response === 'string' && (response.startsWith('UEsDB') || response.startsWith('JVBER'))) {
        // Detectar si es ZIP o PDF por la cabecera
        const isZip = response.startsWith('UEsDB');
        const isPdf = response.startsWith('JVBER');
        
        const binaryString = atob(response);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        if (isZip) {
            const blob = new Blob([bytes], { type: 'application/zip' });
            saveAs(blob, `${filename}-CDR.zip`);
        } else if (isPdf) {
            const blob = new Blob([bytes], { type: 'application/pdf' });
            saveAs(blob, `${filename}-PDF.pdf`);
        }
        return;
    }
    
    // Intentar extraer de objetos anidados
    const data = response?.data || response?.payload || response?.result;
    if (data) {
        await processResponse(data, filename, type);
        return;
    }
    
    throw new Error('Formato de respuesta no reconocido');
};

const ModalDescarga = ({
    id_documento,
    setIdDocumento,
    setModalOpen,
    documentoADescargar,
    setDocumentoADescargar
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const { serie, correlativo,tipoDoc } = documentoADescargar || {};
    const baseName = filenameBaseFromDoc(documentoADescargar);

    const closeModal = () => {
        setIsOpen(false);
        setIdDocumento('');
        setModalOpen(false);
        setDocumentoADescargar({});
        setMsg('');
    };

    const handleDownload = async (format) => {
        try {
            setLoading(true);
            setMsg('');

            const payload = toDocumentoPayload(documentoADescargar);
            if (!payload.empresa_ruc || !payload.serie || !payload.correlativo || !payload.tipo_Doc) {
                throw new Error('Faltan datos del documento (RUC, serie, correlativo o tipo_Doc).');
            }

            if (format === 'xml') {
                const response = await factilizaService.consultarXml(payload);
                await processResponse(response, `${baseName}-XML`, 'xml');
                setMsg('XML/CDR descargado exitosamente.');
                return
            }

            
            if (format === 'cdr') {
                const response = await factilizaService.consultarCdr(payload);
                await processResponse(response, `${baseName}-XML`, 'xml');
                setMsg('XML/CDR descargado exitosamente.');
                return
            }

            if (format === 'pdf') {
                const response = await factilizaService.consultarPdf(payload);
                await processResponse(response, `${baseName}-PDF`, 'pdf');
                setMsg('PDF descargado exitosamente.');
                return
            }

            if (format === 'pdf-innova') {
                let response;
            
                if (tipoDoc === "01" || tipoDoc === "03") {
                    response = await facturaService.reporteFactura(documentoADescargar);
                }else if(tipoDoc === "07" || tipoDoc === "08") {
                    response = await facturaService.reporteNota(documentoADescargar);
                }else if(tipoDoc === "09") {
                    response = await facturaService.reporteGuia(documentoADescargar);
                }
                
                else {
                    throw new Error('No se puede descargar el PDF para este tipo de documento.');
                }
                await processResponse(response, `${documentoADescargar.serie}-${documentoADescargar.correlativo}${documentoADescargar.numRuc ? `-${documentoADescargar.razonSocial}` : ''}-PDF`, 'pdf');
                setMsg('PDF descargado exitosamente.');
                return;
            }

            if (format === 'all') {
                // Descargar XML
                await handleDownload('xml')
                
                // ? Pequeña pausa para evitar bloqueos del navegador
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Descargar PDF
                await handleDownload('pdf-innova')
                
                setMsg('XML/CDR y PDF descargados exitosamente.');
            }
        } catch (err) {
            toast.error('Error al tratar de descargar el archivo')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white p-8 rounded-xl shadow-2xl relative w-full max-w-sm">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={loading}
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-6">
                            {serie && correlativo ? (
                                <h2 className="text-xl font-bold text-gray-800">
                                    Documento {serie}-{correlativo}
                                </h2>
                            ) : (
                                <h2 className="text-xl font-bold text-gray-800">Documento</h2>
                            )}
                            <h3 className="text-base font-semibold text-gray-700 mt-1">
                                ¿Qué deseas descargar?
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Se consultará a /sunat/pdf y /sunat/xml con el body del documento.
                            </p>
                          
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => handleDownload('xml')}
                                disabled={loading}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors disabled:opacity-60"
                            >
                                <FileCode size={20} />
                                {loading ? 'Procesando…' : 'Descargar XML'}
                            </button>

                            <button
                                onClick={() => handleDownload('cdr')}
                                disabled={loading}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors disabled:opacity-60"
                            >
                                <FileCode size={20} />
                                {loading ? 'Procesando…' : 'Descargar CDR'}
                            </button>

                            {/* <button
                                onClick={() => handleDownload('pdf')}
                                disabled={loading}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors disabled:opacity-60"
                            >
                                <FileText size={20} />
                                {loading ? 'Procesando…' : 'Descargar PDF'}
                            </button> */}

                            <button
                                onClick={() => handleDownload('pdf-innova')}
                                disabled={loading}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors disabled:opacity-60"
                            >
                                <FileText size={20} />
                                {loading ? 'Procesando…' : 'Descargar PDF - Innova'}
                            </button>

                            <button
                                onClick={() => handleDownload('all')}
                                disabled={loading}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-innova-blue text-white rounded-lg font-semibold hover:bg-innova-blue-hover transition-colors disabled:opacity-60"
                            >
                                <Folders size={20} />
                                {loading ? 'Procesando…' : 'Descargar Ambos'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalDescarga;