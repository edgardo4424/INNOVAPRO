import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, Funnel } from "lucide-react";

const Filtro = ({ filiales, filtro, setFiltro, Buscar }) => {

  
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
        <div className="grid grid-cols-1 md:grid-cols-7  w-full gap-4">
         
          {/* Select del mes */}
          <div className="md:col-span-2">
            <Select
              name="periodo"
              value={filtro.periodo}
              onValueChange={(v) => setFiltro((p) => ({ ...p, periodo: v }))}
            >
              <SelectTrigger className="w-full border-1 border-gray-400">
                <SelectValue placeholder="Selecciona el mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="01">Enero</SelectItem>
                <SelectItem value="02">Febrero</SelectItem>
                <SelectItem value="03">Marzo</SelectItem>
                <SelectItem value="04">Abril</SelectItem>
                <SelectItem value="05">Mayo</SelectItem>
                <SelectItem value="06">Junio</SelectItem>
                <SelectItem value="07">Julio</SelectItem>
                <SelectItem value="08">Agosto</SelectItem>
                <SelectItem value="09">Setiembre</SelectItem>
                <SelectItem value="10">Octubre</SelectItem>
                <SelectItem value="11">Noviembre</SelectItem>
                <SelectItem value="12">Diciembre</SelectItem>
              </SelectContent>
            </Select>
          </div>

           {/* Select de año */}
          <div className="md:col-span-2">
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
          </div>


          {/* Select de filial */}
          <div className="md:col-span-2">
            <Select
              name="filial_id"
              value={filtro.filial_id}
              onValueChange={(v) => setFiltro((p) => ({ ...p, filial_id: v }))}
            >
              <SelectTrigger className="w-full border-1 border-gray-400">
                <SelectValue placeholder="Selecciona la Filial" />
              </SelectTrigger>
              <SelectContent>
                {filiales.map((filial) => (
                  <SelectItem key={filial.id} value={filial.id}>
                    {filial.razon_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
            <Button onClick={Buscar} className="px-2 cursor-pointer w-full">
              <Check className="mr-1 w-3 h-3" /> Aplicar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filtro;
