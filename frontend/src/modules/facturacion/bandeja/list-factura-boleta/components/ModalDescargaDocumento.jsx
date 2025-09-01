import factilizaService from '@/modules/facturacion/service/FactilizaService';
import { FileCode, FileText, Folders, X } from 'lucide-react';
import { useState } from 'react';

/* ================== helpers comunes ================== */
const detectMimeAndExt = (b64) => {
    const head = (b64 || '').slice(0, 20);
    if (head.startsWith('data:')) {
        const mime = head.slice(5, head.indexOf(';'));
        const ext = mime.split('/')[1] || 'bin';
        return { mime, ext };
    }
    if (head.startsWith('UEsDB')) return { mime: 'application/zip', ext: 'zip' }; // ZIP
    if (head.startsWith('JVBER')) return { mime: 'application/pdf', ext: 'pdf' }; // PDF
    if (head.startsWith('PD94') || (b64 || '').includes('PHhtbA')) {
        return { mime: 'application/xml', ext: 'xml' }; // XML en base64
    }
    return { mime: 'application/octet-stream', ext: 'bin' };
};

const cleanBase64 = (b64) =>
    (b64 || '').trim().replace(/[\r\n\s]/g, '').replace(/-/g, '+').replace(/_/g, '/');

const base64ToBlob = (b64, mime = 'application/octet-stream') => {
    const cleaned = cleanBase64(b64);
    let data = cleaned;
    let contentType = mime;
    if (cleaned.startsWith('data:')) {
        const [preamble, payload] = cleaned.split(',');
        const m = preamble.match(/^data:(.*?);base64$/i);
        if (m) contentType = m[1] || contentType;
        data = payload || '';
    }
    const padLen = data.length % 4;
    if (padLen) data += '='.repeat(4 - padLen);

    const byteString = atob(data);
    const len = byteString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = byteString.charCodeAt(i);
    return new Blob([bytes], { type: contentType });
};

const downloadBlob = (blob, filename = 'archivo.bin') => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

const downloadBase64 = (b64, filenameBase = 'archivo', forcedExt) => {
    if (!b64) throw new Error('Sin contenido');
    const { mime, ext } = detectMimeAndExt(b64);
    const finalExt = forcedExt || ext;
    const blob = base64ToBlob(b64, mime);
    downloadBlob(blob, `${filenameBase}.${finalExt}`);
};

const downloadText = (text, filenameBase = 'archivo', mime = 'application/xml', ext = 'xml') => {
    downloadBlob(new Blob([text], { type: `${mime};charset=utf-8` }), `${filenameBase}.${ext}`);
};
/* ===================================================== */

/** Payload al API (NO toco tu correlativoSrc) */
const toDocumentoPayload = (doc = {}) => {
    const correlativoSrc = doc.correlativo ?? doc.correlativo ?? ''; // <- tal cual
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

/* Para XML plano/base64/dataURL */
const isXmlText = (s) => typeof s === 'string' && s.trim().startsWith('<?xml');
const isDataUrl = (s) => typeof s === 'string' && s.startsWith('data:');
const looksLikeB64Header = (s) => {
    const c = cleanBase64(s || '');
    return c.startsWith('UEsDB') || c.startsWith('JVBER') || c.startsWith('PD94');
};

const extractDownloadPayload = (respRaw) => {
    if (respRaw == null) throw new Error('Sin respuesta del servidor');

    if (typeof respRaw === 'string') {
        const s = respRaw.trim();
        if (isDataUrl(s)) return { kind: 'data-url', data: s };
        if (isXmlText(s)) return { kind: 'xml-text', data: s };
        if (s.startsWith('{') || s.startsWith('[')) {
            try { return extractDownloadPayload(JSON.parse(s)); } catch { }
        }
        if (looksLikeB64Header(s)) return { kind: 'base64', data: s };
        throw new Error('Respuesta string no es XML ni base64');
    }

    // Blob (PDF binario)
    if (respRaw instanceof Blob) return { kind: 'blob', data: respRaw, filename: null };

    // { blob, headers, filename, status }
    if (respRaw?.blob instanceof Blob) {
        return { kind: 'blob', data: respRaw.blob, filename: respRaw.filename || null };
    }

    const status = respRaw.status ?? respRaw.code ?? respRaw.httpStatus;
    if (status === 401) throw new Error(respRaw.message || respRaw.response || 'No autorizado (401)');
    if (status === 400) throw new Error(respRaw.message || 'Bad Request (400)');
    if (status === 404) throw new Error(respRaw.message || 'No encontrado (404)');

    const candidates = [respRaw.data, respRaw.payload, respRaw.result, respRaw.base64, respRaw.file, respRaw.content];
    for (const c of candidates) {
        if (c instanceof Blob) return { kind: 'blob', data: c, filename: null };
        if (typeof c === 'string') {
            if (isDataUrl(c)) return { kind: 'data-url', data: c };
            if (isXmlText(c)) return { kind: 'xml-text', data: c };
            if (looksLikeB64Header(c)) return { kind: 'base64', data: c };
        }
    }

    // data.data... (por si acaso)
    let deep = respRaw;
    for (let i = 0; i < 3; i++) {
        if (deep && typeof deep === 'object' && 'data' in deep) deep = deep.data;
    }
    if (deep instanceof Blob) return { kind: 'blob', data: deep, filename: null };
    if (typeof deep === 'string') {
        if (isDataUrl(deep)) return { kind: 'data-url', data: deep };
        if (isXmlText(deep)) return { kind: 'xml-text', data: deep };
        if (looksLikeB64Header(deep)) return { kind: 'base64', data: deep };
    }

    throw new Error(`Respuesta no reconocida${status ? ` (status ${status})` : ''}`);
};

const ModalDescargaDocumento = ({
    id_documento,
    setIdDocumento,
    setModalOpen,
    documentoADescargar,
    setDocumentoADescargar
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const { serie, correlativo } = documentoADescargar || {};
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
                const resp = await factilizaService.consultarXml(payload);
                const out = extractDownloadPayload(resp);
                if (out.kind === 'xml-text') {
                    downloadText(out.data, `${baseName}-XML`, 'application/xml', 'xml');
                } else {
                    const { ext } = detectMimeAndExt(out.data);
                    const suffix = ext === 'zip' ? 'CDR' : 'XML';
                    downloadBase64(out.data, `${baseName}-${suffix}`);
                }
                setMsg('XML/CDR descargado.');
            }

            if (format === 'pdf') {
                const resp = await factilizaService.consultarPdf(payload);
                const out = extractDownloadPayload(resp);
                if (out.kind === 'blob') {
                    // PDF binario (lo que tu backend está enviando)
                    downloadBlob(out.data, `${baseName}-PDF.pdf`);
                } else if (out.kind === 'base64' || out.kind === 'data-url') {
                    downloadBase64(out.data, `${baseName}-PDF`, 'pdf');
                } else {
                    throw new Error('El endpoint /sunat/pdf no devolvió PDF.');
                }
                setMsg('PDF descargado.');
            }

            if (format === 'all') {
                // XML
                const xmlResp = await factilizaService.consultarXml(payload);
                const xmlOut = extractDownloadPayload(xmlResp);
                if (xmlOut.kind === 'xml-text') {
                    downloadText(xmlOut.data, `${baseName}-XML`, 'application/xml', 'xml');
                } else {
                    const { ext } = detectMimeAndExt(xmlOut.data);
                    const xmlSuffix = ext === 'zip' ? 'CDR' : 'XML';
                    downloadBase64(xmlOut.data, `${baseName}-${xmlSuffix}`);
                }

                // PDF
                const pdfResp = await factilizaService.consultarPdf(payload);
                const pdfOut = extractDownloadPayload(pdfResp);
                if (pdfOut.kind === 'blob') {
                    downloadBlob(pdfOut.data, `${baseName}-PDF.pdf`);
                } else if (pdfOut.kind === 'base64' || pdfOut.kind === 'data-url') {
                    downloadBase64(pdfOut.data, `${baseName}-PDF`, 'pdf');
                } else {
                    throw new Error('El endpoint /sunat/pdf no devolvió PDF.');
                }

                setMsg('XML/CDR y PDF descargados.');
            }
        } catch (err) {
            console.error(err);
            setMsg(err?.message || 'Error al descargar');
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
                            {!!msg && (
                                <p className={`text-xs mt-2 ${msg.toLowerCase().includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                                    {msg}
                                </p>
                            )}
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
                                onClick={() => handleDownload('pdf')}
                                disabled={loading}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors disabled:opacity-60"
                            >
                                <FileText size={20} />
                                {loading ? 'Procesando…' : 'Descargar PDF'}
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

export default ModalDescargaDocumento;