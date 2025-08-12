import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SelectScrollDownButton } from "@radix-ui/react-select";
import { Check, Funnel, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import gratificacionService from "../services/gratificacionService";

const Filtro = ({ filtro, setFiltro, Buscar }) => {
    const [filiales, setFiliales] = useState([]);

    useEffect(() => {
        const ObtenerFiliales = async () => {
            try {
                const res = await gratificacionService.obtenerFiliales();
                setFiliales(res);
            } catch (error) {
                console.log(error);
            }
        }
        ObtenerFiliales();
    }, []);


    const limpiar = () => setFiltro({ anio: "", semestre: "", filial: "" });

    return (
        <div className=" pt-8 flex gap-x-5  bg-red-">
            <div className="flex flex-col items-center justify-between w-full gap-x-5 border-2 border-gray-300 p-4 rounded-2xl">
                <div className="flex items-between justify-start gap-x-2 w-full py-2">
                    <div className="flex">
                        <Funnel />
                        <h2 className="font-bold">Filtro</h2>
                    </div>
                    {/* <div className="flex w-full justify-end">
                        <Button onClick={Buscar} size="xs" className="h-7 px-2 cursor-pointer" >
                            <Check className="mr-1 w-3 h-3" /> Aplicar
                        </Button>
                    </div> */}
                </div>
                <div className="grid grid-cols-3  w-full gap-4">
                    {/* Select de año */}
                    <Select
                        name="anio"
                        value={filtro.anio}
                        onValueChange={(v) => setFiltro((p) => ({ ...p, anio: v }))}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona el año" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                            <SelectItem value="2027">2027</SelectItem>
                            <SelectItem value="2028">2028</SelectItem>
                            <SelectItem value="2029">2029</SelectItem>
                            <SelectItem value="2030">2030</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Select de semestre */}
                    <Select
                        name="periodo"
                        value={filtro.periodo}
                        onValueChange={(v) => setFiltro((p) => ({ ...p, periodo: v }))}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona el periodo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="JULIO">Primer Periodo</SelectItem>
                            <SelectItem value="DICIEMBRE">Segundo Periodo</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Select de filial */}
                    <Select
                        name="filial_id"
                        value={filtro.filial_id}
                        onValueChange={(v) => setFiltro((p) => ({ ...p, filial_id: v }))}
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona la Filial" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                filiales.map((filial) => (
                                    <SelectItem key={filial.id} value={filial.id}>{filial.razon_social}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div className="hidden sm:flex  justify-end pt-4 gap-2 w-full ">
                    {/* <Button onClick={limpiar} variant="ghost" size="xs" className="h-7 px-2 cursor-pointer">
                        <RotateCcw className="mr-1 w-3 h-3" /> Limpiar
                    </Button> */}
                    <Button onClick={Buscar} size="xs" className="h-7 px-2 cursor-pointer" >
                        <Check className="mr-1 w-3 h-3" /> Aplicar
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default Filtro;
