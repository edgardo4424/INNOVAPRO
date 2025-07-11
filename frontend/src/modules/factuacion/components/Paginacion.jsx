import React from "react";
import { validarPasos } from "../utils/validarPasos"; // asegúrate de tener esta función
import { useFacturacion } from "@/context/FacturacionContext";

const Paginacion = ({ FormSelect, setFormSelect }) => {
    const { factura } = useFacturacion();

    const handlePagination = (opcion) => {
        if (opcion === "anterior") {
            if (FormSelect === 1) return;
            setFormSelect(FormSelect - 1);
        }

        if (opcion === "siguiente") {
            if (FormSelect === 4) return;
            if (FormSelect === 1 && !validarPasos("DatosDelComprobante", factura)) {
                return;
            }
            if (FormSelect === 2 && !validarPasos("DatosDelCliente", factura)) {
                return;
            }
            setFormSelect(FormSelect + 1);
        }
    };

    return (
        <div className="w-full justify-between flex px-4">
            {FormSelect !== 1 && (
                <button
                    onClick={() => handlePagination("anterior")}
                    className="py-4 px-6 rounded-2xl hover:bg-blue-700 cursor-pointer bg-blue-600 text-white text-xl"
                >
                    Anterior
                </button>
            )}
            {FormSelect !== 4 && (
                <button
                    onClick={() => handlePagination("siguiente")}
                    className="py-4 px-6 rounded-2xl hover:bg-blue-700 cursor-pointer bg-blue-600 text-white text-xl"
                >
                    Siguiente
                </button>
            )}
        </div>
    );
};

export default Paginacion;
