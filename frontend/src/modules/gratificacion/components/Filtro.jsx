import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, Funnel, RotateCcw } from "lucide-react";

const Filtro = ({ filiales, filtro, setFiltro, Buscar }) => {
 const anhoActual = new Date().getFullYear();
const utlimosCincoAnhos = Array.from({ length: 5 }, (_, i) => anhoActual - i);

  return (
    <div className="flex gap-x-5">
      <div className="flex flex-col items-center justify-between w-full gap-x-5 border-2 border-gray-300 p-4 rounded-2xl">
        <div className="flex items-between justify-start gap-x-2 w-full py-2">
          <div className="flex">
            <Funnel />
            <h2 className="font-bold">Filtro</h2>
          </div>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7  w-full gap-4">
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
                {utlimosCincoAnhos.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select de semestre */}
          <div className="md:col-span-2">
            <Select
              name="periodo"
              value={filtro.periodo}
              onValueChange={(v) => setFiltro((p) => ({ ...p, periodo: v }))}
            >
              <SelectTrigger className="w-full border-1 border-gray-400">
                <SelectValue placeholder="Selecciona el periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JULIO">Julio</SelectItem>
                <SelectItem value="DICIEMBRE">Diciembre</SelectItem>
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
