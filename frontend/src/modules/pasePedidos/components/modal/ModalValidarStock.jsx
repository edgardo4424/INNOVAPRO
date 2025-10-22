import { useState } from 'react'; // Necesitas useState para manejar el loading
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

// Importa componentes de interfaz si los tienes (Button, ScrollArea, etc.)
// Asumo que tienes un componente Button y quizás ScrollArea
import { Button } from "@/components/ui/button"; 
// import { ScrollArea } from "@/components/ui/scroll-area"; // Opcional, para listas largas

export default function ModalValidarStock({
    open,
    setOpen,
    cotizacion_id,
    setCotizacion_id,
    pedidoView,
    setPedidoView,
}) {
    const [isLoading, setIsLoading] = useState(false);
    
    // Función para manejar la validación (simulación)
    const handleValidar = () => {
        setIsLoading(true);
        // Aquí iría tu lógica de API para validar el stock
        console.log(`Validando stock para el pedido N°: ${pedidoView?.nro_Pedido}`);

        // Simulación de una llamada a API
        setTimeout(() => {
            setIsLoading(false);
            alert("Stock validado con éxito (Simulación)!");
            setOpen(false); // Cierra el modal al finalizar
        }, 1500);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            {/* Ajuste de ancho del modal: md:max-w-xl o similar */}
            <AlertDialogContent className="flex flex-col gap-6 pt-10 md:max-w-xl"> 
                {/* ❌ Botón cerrar arriba */}
                <button
                    className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-600 transition-colors"
                    onClick={() => setOpen(false)}
                    disabled={isLoading} // Deshabilitar si está cargando
                >
                    <X />
                </button>

                {/* Título y Descripción */}
                <div className="flex flex-col items-center text-center">
                    <AlertDialogTitle className="text-xl font-bold text-gray-800">
                        Verificación de Stock de Pedido
                    </AlertDialogTitle>

                    <AlertDialogDescription className={"text-sm text-gray-600 mt-1"}>
                        Confirma la disponibilidad de stock para el pedido N° **{pedidoView?.nro_Pedido}**
                    </AlertDialogDescription>
                </div>

                {/* Contenido: Listado de Piezas */}
                <div className="w-full max-h-80 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">
                        Detalle de Piezas ({pedidoView?.detalle?.length || 0})
                    </h3>
                    
                    {/* Lista de ítems del pedido */}
                    {pedidoView?.detalle && pedidoView.detalle.length > 0 ? (
                        <div className="space-y-2">
                            {pedidoView.detalle.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="flex justify-between items-center text-sm p-2 rounded-md transition-colors bg-white hover:bg-gray-100 shadow-sm"
                                >
                                    <div className="font-medium text-gray-800">
                                        {item.cod_Producto || 'Pieza sin código'}
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-600">
                                            Cant: <span className="font-semibold">{item.cantidad || 0}</span>
                                        </span>
                                        {/* Aquí puedes añadir un indicador visual para el stock si lo tuvieras */}
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                            {item.unidad || 'NIU'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">
                            El pedido no contiene detalles de piezas.
                        </p>
                    )}
                </div>
                
                {/* Botón de Validar */}
                <div className="flex justify-center mt-2">
                    <Button 
                        onClick={handleValidar} 
                        disabled={isLoading || !pedidoView?.detalle?.length} 
                        className="w-full max-w-xs bg-green-600 hover:bg-green-700 transition-colors font-semibold"
                    >
                        {isLoading ? (
                            <>
                                Validando...
                                {/* Puedes añadir un spinner aquí */}
                            </>
                        ) : (
                            "Validar Stock y Continuar"
                        )}
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}