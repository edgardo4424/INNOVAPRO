import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar22 } from "../../factura-boleta/components/Calendar22";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import { Ubigeos } from "../utils/ubigeo";
import { useEffect, useMemo, useState } from "react";

const DatosGuiaEnvioPrivadoForm = () => {
    const { guiaDatosPrivado, setGuiaDatosPrivado, guiaTransporte, setGuiaTransporte } = useGuiaTransporte();

    // ?? Estados locales para los inputs de ubigeo y su visibilidad de sugerencias
    const [partidaUbigeoInput, setPartidaUbigeoInput] = useState('');
    const [showPartidaSuggestions, setShowPartidaSuggestions] = useState(false);

    const [llegadaUbigeoInput, setLlegadaUbigeoInput] = useState('');
    const [showLlegadaSuggestions, setShowLlegadaSuggestions] = useState(false);

    const {
        guia_Envio_Cod_Traslado,
        guia_Envio_Mod_Traslado,
    } = guiaDatosPrivado;

    const {
        guia_Envio_Peso_Total,
        guia_Envio_Und_Peso_Total,
        guia_Envio_Fec_Traslado,

        guia_Envio_Partida_Ubigeo,
        guia_Envio_Partida_Direccion,
        guia_Envio_Llegada_Ubigeo,
        guia_Envio_Llegada_Direccion,

        guia_Envio_Vehiculo_Placa

    } = guiaTransporte

    useEffect(() => {
        // Inicializar Ubigeo de Partida
        if (guia_Envio_Partida_Ubigeo) {
            const foundUbigeo = Ubigeos.find(u => u.IDDIST === guia_Envio_Partida_Ubigeo);
            if (foundUbigeo) {
                setPartidaUbigeoInput(`${foundUbigeo.DISTRITO}, ${foundUbigeo.PROVINCIA}, ${foundUbigeo.DEPARTAMENTO}`);
            }
        } else {
            setPartidaUbigeoInput(''); // Limpiar si no hay IDDIST
        }

        // Inicializar Ubigeo de Llegada
        if (guia_Envio_Llegada_Ubigeo) {
            const foundUbigeo = Ubigeos.find(u => u.IDDIST === guia_Envio_Llegada_Ubigeo);
            if (foundUbigeo) {
                setLlegadaUbigeoInput(`${foundUbigeo.DISTRITO}, ${foundUbigeo.PROVINCIA}, ${foundUbigeo.DEPARTAMENTO}`);
            }
        } else {
            setLlegadaUbigeoInput(''); // Limpiar si no hay IDDIST
        }
    }, [guia_Envio_Partida_Ubigeo, guia_Envio_Llegada_Ubigeo]);

    //!! --- Lógica para Ubigeo de Partida ---
    const handlePartidaInputChange = (e) => {
        const value = e.target.value;
        setPartidaUbigeoInput(value);
        // Si el usuario borra el texto, también limpia el IDDIST en el contexto
        if (value === '') {
            setGuiaTransporte((prevGuiaTransporte) => ({
                ...prevGuiaTransporte,
                guia_Envio_Partida_Ubigeo: '',
            }));
        }
        setShowPartidaSuggestions(value.length > 0);
    };

    const filteredPartidaUbigeos = useMemo(() => {
        if (!partidaUbigeoInput) {
            return [];
        }
        const lowerCaseInput = partidaUbigeoInput.toLowerCase();
        return Ubigeos.filter(ubigeo =>
            ubigeo.DEPARTAMENTO.toLowerCase().includes(lowerCaseInput) ||
            ubigeo.PROVINCIA.toLowerCase().includes(lowerCaseInput) ||
            ubigeo.DISTRITO.toLowerCase().includes(lowerCaseInput) ||
            ubigeo.IDDIST.includes(lowerCaseInput)
        ).slice(0, 10); // Limita el número de sugerencias
    }, [partidaUbigeoInput]);

    const handleSelectPartidaUbigeo = (ubigeo) => {
        setPartidaUbigeoInput(`${ubigeo.DISTRITO}, ${ubigeo.PROVINCIA}, ${ubigeo.DEPARTAMENTO}`);
        setGuiaTransporte((prevGuiaTransporte) => ({
            ...prevGuiaTransporte,
            guia_Envio_Partida_Ubigeo: ubigeo.IDDIST, // Setea solo el IDDIST
        }));
        setShowPartidaSuggestions(false);
    };

    const handlePartidaFocus = () => {
        if (partidaUbigeoInput.length > 0) {
            setShowPartidaSuggestions(true);
        }
    };

    //!! --- Lógica para Ubigeo de Llegada ---
    const handleLlegadaInputChange = (e) => {
        const value = e.target.value;
        setLlegadaUbigeoInput(value);
        // Si el usuario borra el texto, también limpia el IDDIST en el contexto
        if (value === '') {
            setGuiaTransporte((prevGuiaTransporte) => ({
                ...prevGuiaTransporte,
                guia_Envio_Llegada_Ubigeo: '',
            }));
        }
        setShowLlegadaSuggestions(value.length > 0);
    };

    const filteredLlegadaUbigeos = useMemo(() => {
        if (!llegadaUbigeoInput) {
            return [];
        }
        const lowerCaseInput = llegadaUbigeoInput.toLowerCase();
        return Ubigeos.filter(ubigeo =>
            ubigeo.DEPARTAMENTO.toLowerCase().includes(lowerCaseInput) ||
            ubigeo.PROVINCIA.toLowerCase().includes(lowerCaseInput) ||
            ubigeo.DISTRITO.toLowerCase().includes(lowerCaseInput) ||
            ubigeo.IDDIST.includes(lowerCaseInput)
        ).slice(0, 10); //!! Limita el número de sugerencias
    }, [llegadaUbigeoInput]);

    const handleSelectLlegadaUbigeo = (ubigeo) => {
        setLlegadaUbigeoInput(`${ubigeo.DISTRITO}, ${ubigeo.PROVINCIA}, ${ubigeo.DEPARTAMENTO}`);
        setGuiaTransporte((prevGuiaTransporte) => ({
            ...prevGuiaTransporte,
            guia_Envio_Llegada_Ubigeo: ubigeo.IDDIST, //!! Setea solo el IDDIST
        }));
        setShowLlegadaSuggestions(false);
    };

    const handleLlegadaFocus = () => {
        if (llegadaUbigeoInput.length > 0) {
            setShowLlegadaSuggestions(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'guia_Envio_Peso_Total') {
            const parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) {
                return; // Si no es un número, no hace nada
            }
            setGuiaTransporte((prevGuiaTransporte) => ({
                ...prevGuiaTransporte,
                [name]: parsedValue,
            }));
        } else {
            setGuiaTransporte((prevGuiaTransporte) => ({
                ...prevGuiaTransporte,
                [name]: value.toUpperCase(),
            }));
        }
    };

    const handleSelectChangePrv = (value, name) => {
        setGuiaDatosPrivado((prevValores) => ({
            ...prevValores,
            [name]: value,
        }));
    };

    const handleChangePrv = (e) => {
        const value = e.target.value;
        setGuiaDatosPrivado((prevGuiaTransporte) => ({
            ...prevGuiaTransporte,
            guia_Envio_Vehiculo_Placa: value.toUpperCase(),
        }));
    };


    return (
        <div>

            <h2 className="text-2xl font-semibold mb-2 flex pb-2">
                Datos de la Guía de Envío
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                <div>
                    <Label
                        htmlFor="guia_Envio_Cod_Traslado"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Código de Traslado
                    </Label>
                    <Select
                        name="guia_Envio_Cod_Traslado"
                        value={guia_Envio_Cod_Traslado}
                        onValueChange={(e) => {
                            handleSelectChangePrv(e, "guia_Envio_Cod_Traslado");
                        }}
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
                            <SelectValue placeholder="Selecciona un codigo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01">01 - Venta</SelectItem>
                            <SelectItem value="02">02 - Venta sujeta a confirmación del comprador</SelectItem>
                            <SelectItem value="04">04 - Traslado entre establecimientos de la misma empresa</SelectItem>
                            <SelectItem value="08">08 - Importación</SelectItem>
                            <SelectItem value="09">09 - Exportación</SelectItem>
                            <SelectItem value="13">13 - Otros</SelectItem>
                            <SelectItem value="14">14 - Venta con entrega a terceros</SelectItem>
                            <SelectItem value="18">18 - Traslado emisor itinerante CP</SelectItem>
                            <SelectItem value="19">19 - Traslado a zona primaria</SelectItem>
                            <SelectItem value="20">20 - Traslado por emisor itinerante (comprobante de pago)</SelectItem>
                        </SelectContent>

                    </Select>
                </div>
                <div>
                    <Label
                        htmlFor="guia_Envio_Mod_Traslado"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Modalidad de Traslado
                    </Label>
                    <Select
                        name="guia_Envio_Mod_Traslado"
                        value={guia_Envio_Mod_Traslado}
                        disabled
                    >
                        <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
                            <SelectValue placeholder="Selecciona un codigo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="01">01 - Transporte público</SelectItem>
                            <SelectItem value="02">02 - Transporte privado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label
                        htmlFor="guia_Envio_Fec_Traslado"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Fecha de Traslado
                    </Label>
                    <Calendar22
                        tipo={"guia_Envio_Fec_Traslado"}
                        Dato={guiaDatosPrivado}
                        setDato={setGuiaTransporte}
                        type="datetime-local"
                        id="guia_Envio_Fec_Traslado"
                        name="guia_Envio_Fec_Traslado"
                        value={guia_Envio_Fec_Traslado}
                        // onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                {/* --- Ubigeo de Partida --- */}
                <div className="relative">
                    <Label
                        htmlFor="guia_Envio_Partida_Ubigeo"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Ubigeo de Partida
                    </Label>
                    <Input
                        type="text"
                        id="guia_Envio_Partida_Ubigeo"
                        name="guia_Envio_Partida_Ubigeo"
                        value={partidaUbigeoInput}
                        onChange={handlePartidaInputChange}
                        onFocus={handlePartidaFocus}
                        // onBlur={handlePartidaBlur}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        autoComplete="off"
                    />
                    {showPartidaSuggestions && filteredPartidaUbigeos.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                            {filteredPartidaUbigeos.map((ubigeo) => (
                                <li
                                    key={ubigeo.IDDIST}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm bg-white text-gray-800"
                                    onClick={() => handleSelectPartidaUbigeo(ubigeo)}
                                >
                                    {ubigeo.DISTRITO}, {ubigeo.PROVINCIA}, {ubigeo.DEPARTAMENTO} ({ubigeo.IDDIST})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    {" "}
                    {/* Made address span full width on small screens too */}
                    <Label
                        htmlFor="guia_Envio_Partida_Direccion"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Dirección de Partida
                    </Label>
                    <Input
                        type="text"
                        id="guia_Envio_Partida_Direccion"
                        name="guia_Envio_Partida_Direccion"
                        value={guia_Envio_Partida_Direccion}
                        onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                {/* --- Ubigeo de Llegada --- */}
                <div className="relative">
                    <Label
                        htmlFor="guia_Envio_Llegada_Ubigeo"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Ubigeo de Llegada
                    </Label>
                    <Input
                        type="text"
                        id="guia_Envio_Llegada_Ubigeo"
                        name="guia_Envio_Llegada_Ubigeo"
                        value={llegadaUbigeoInput}
                        onChange={handleLlegadaInputChange}
                        onFocus={handleLlegadaFocus}
                        // onBlur={handleLlegadaBlur}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        autoComplete="off"
                    />
                    {showLlegadaSuggestions && filteredLlegadaUbigeos.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                            {filteredLlegadaUbigeos.map((ubigeo) => (
                                <li
                                    key={ubigeo.IDDIST}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                                    onClick={() => handleSelectLlegadaUbigeo(ubigeo)}
                                >
                                    {ubigeo.DISTRITO}, {ubigeo.PROVINCIA}, {ubigeo.DEPARTAMENTO} ({ubigeo.IDDIST})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    {" "}
                    {/* Made address span full width on small screens too */}
                    <Label
                        htmlFor="guia_Envio_Llegada_Direccion"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Dirección de Llegada
                    </Label>
                    <Input
                        type="text"
                        id="guia_Envio_Llegada_Direccion"
                        name="guia_Envio_Llegada_Direccion"
                        value={guia_Envio_Llegada_Direccion}
                        onChange={handleChange}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    {" "}
                    {/* Made address span full width on small screens too */}
                    <Label
                        htmlFor="guia_Envio_Llegada_Direccion"
                        className="block text-sm font-semibold text-gray-700 text-left mb-1"
                    >
                        Placa del Vehiculo
                    </Label>
                    <Input
                        type="text"
                        id="guia_Envio_Vehiculo_Placa"
                        name="guia_Envio_Vehiculo_Placa"
                        value={guia_Envio_Vehiculo_Placa}
                        onChange={handleChangePrv}
                        className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default DatosGuiaEnvioPrivadoForm;
