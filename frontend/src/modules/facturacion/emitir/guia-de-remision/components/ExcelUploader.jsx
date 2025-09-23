import { AlertCircle, ArrowUpNarrowWide, ArrowUpNarrowWideIcon, CheckCircle, FileSpreadsheet, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { read, utils } from "xlsx";
import ModalVistaPrevia from "../../notas-de-credito/components/modal/ModalVistaPrevia";

// Componente para cargar archivos Excel
const ExcelUploader = ({ onDataLoaded, handleSubirDatos }) => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
            processExcelFile(selectedFile);
        }
    };

    const processExcelFile = async (file) => {
        setIsLoading(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = read(arrayBuffer);

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // 1. Obtener todos los datos de la hoja en formato de matriz
            const jsonData = utils.sheet_to_json(worksheet, {
                header: 1,
                defval: ""
            });

            if (jsonData.length < 2) {
                throw new Error("El archivo debe tener al menos una fila de títulos y una fila de datos");
            }

            // 2. Obtener los encabezados de la primera fila (índice 0)
            // Y mapear los índices de las columnas que nos interesan (B, C, D)
            const allHeaders = jsonData[0];
            const headers = [allHeaders[1], allHeaders[2], allHeaders[3]]; // B, C, D

            // 3. Obtener los datos desde la segunda fila en adelante (índice 1+)
            const dataRows = jsonData.slice(1);

            // 4. Filtrar y procesar los datos para obtener solo las columnas B, C y D
            const processedData = dataRows
                .filter(row => row.some(cell => cell !== "" && cell !== null && cell !== undefined))
                .map((row, index) => ({
                    // id: index + 1,
                    cod_Producto: row[0] || "", // Columna B es el índice 1
                    descripcion: row[1] || "", // Columna C es el índice 2
                    cantidad: row[2] || "", // Columna D es el índice 3
                    unidad: "NIU",
                    // original: [row[0], row[1], row[2]] // Opcional: guardar el array original de estas columnas
                }));

            // 5. Verificar si hay datos válidos después de procesar
            if (processedData.length === 0) {
                throw new Error("No se encontraron datos válidos en las columnas B, C y D.");
            }

            setPreviewData(processedData); // Mostrar preview de los primeros 3 registros
            setSuccess(true);

            if (onDataLoaded) {
                onDataLoaded({
                    headers: headers,
                    data: processedData,
                    totalRows: processedData.length,
                    fileName: file.name
                });
            }
        } catch (err) {
            setError(`Error al procesar el archivo: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };



    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type.includes('sheet') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
            setFile(droppedFile);
            setError(null);
            setSuccess(false);
            processExcelFile(droppedFile);
        } else {
            setError("Por favor, selecciona un archivo Excel válido (.xlsx o .xls)");
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
        setSuccess(false);
        setPreviewData([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onDataLoaded) {
            onDataLoaded(null); // Limpiar datos del componente padre
        }
    };

    const handleSubirClick = () => {
        if (file) {
            handleSubirDatos(file);
        }
        setTimeout(() => removeFile(), 1000);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full max-w-sm">
            <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Cargar desde Excel
                </h3>
                <p className="text-xs text-gray-600">
                    Columnas B, C y D
                </p>
            </div>

            {!file ? (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={triggerFileInput}
                >
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                        Arrastra tu Excel aquí
                    </p>
                    <p className="text-xs text-gray-500">
                        o haz clic para seleccionar
                    </p>
                </div>
            ) : (
                <div className="border border-gray-300 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <FileSpreadsheet className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="font-medium text-sm text-gray-800 truncate max-w-[150px]">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex items-center space-x-2 text-blue-600 mb-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            <span className="text-xs">Procesando...</span>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start space-x-2 text-red-600 mb-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span className="text-xs">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center space-x-2 text-green-600 mb-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">
                                Procesado ({previewData.length} registros)
                            </span>
                        </div>
                    )}

                    {previewData.length > 0 && (
                        <div className="mt-2">
                            <h4 className="text-xs font-semibold text-gray-800 mb-1">
                                Vista previa:
                            </h4>
                            <div className="bg-gray-50 rounded-md p-2 max-h-20 overflow-y-auto">
                                <div className="text-xs space-y-0.5">
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                        onClick={() => setOpenModal(true)}
                                    >
                                        Ver todos ({previewData.length} registros)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-x-4">

                        <ModalVistaPrevia items={previewData} handleSubirDatos={handleSubirClick} />

                        <button
                            onClick={handleSubirClick}
                            className="flex items-center text-white bg-blue-500 hover:bg-blue-600 cursor-pointer px-2 rounded-md">
                            <ArrowUpNarrowWideIcon className="size-5" />
                            <span>Subir Datos</span>
                        </button>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};
export default ExcelUploader