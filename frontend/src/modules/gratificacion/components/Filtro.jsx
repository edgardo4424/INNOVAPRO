import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Check, Funnel, RotateCcw } from "lucide-react";

const Filtro = () => {
    return (
        <div className=" pt-8 flex gap-x-5  bg-red-">
            <div className="flex flex-col items-center justify-between w-full gap-x-5 border-2 border-gray-300 p-4 rounded-2xl">
                <div className="flex items-start justify-start gap-x-2 w-full py-2">
                    <Funnel />
                    <h2 className="font-bold">Filtro</h2>
                </div>
                <div className="grid grid-cols-3  w-full gap-4">
                    {/* Select de año */}
                    <Select
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona el año" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="03"></SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Select de semestre */}
                    <Select
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona el semestre" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025">Primer Semestre</SelectItem>
                            <SelectItem value="03">Segundo Semestre</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Select de filial */}
                    <Select
                    >
                        <SelectTrigger className="w-full border-1 border-gray-400">
                            <SelectValue placeholder="Selecciona la Filial" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="20562974998">ENCOFRADOS INNOVA S.A.C.</SelectItem>
                            <SelectItem value="20602696643">ANDAMIOS ELECTRICOS INNOVA S.A.C.</SelectItem>
                            <SelectItem value="20555389052">INDEK ANDINA E.I.R.L</SelectItem>
                            <SelectItem value="20603021933">INNOVA RENTAL MAQUINARIA S.A.C.</SelectItem>
                            <SelectItem value="20610202358">INNOVA GREEN ENERGY S.A.C.</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="hidden sm:flex  justify-end pt-4 gap-2 w-full ">
                    <Button variant="ghost" size="xs" className="h-7 px-2 cursor-pointer">
                        <RotateCcw className="mr-1 w-3 h-3" /> Limpiar
                    </Button>
                    <Button size="xs" className="h-7 px-2 cursor-pointer" >
                        <Check className="mr-1 w-3 h-3" /> Aplicar
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default Filtro;
