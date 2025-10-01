import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, Funnel } from "lucide-react";
import { listaMeses } from "../utils/valorInicial";

const Filtro = ({ filiales, filtro, setFiltro, Buscar,nombre_button="Aplicar",hidden=false }) => {
  const anhoActual = new Date().getFullYear();
  const utlimosCincoAnhos = Array.from({ length: 5 }, (_, i) => anhoActual - i);

  return (
    <div className=" flex gap-x-5 w-full">
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
              name="mes"
              value={filtro.mes}
              onValueChange={(v) => setFiltro((p) => ({ ...p, mes: v }))}

            >
              <SelectTrigger className="w-full border-1 border-gray-400">
                <SelectValue placeholder="Selecciona el mes" />
              </SelectTrigger>
              <SelectContent>
                {
                  listaMeses.map((mes) => (
                    <SelectItem key={mes.value} value={mes.value}>
                      {mes.label}
                    </SelectItem>
                  ))
                }

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
                {utlimosCincoAnhos.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
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
          
          {
            !hidden&&<div className="md:col-span-1">
            <Button onClick={Buscar} className="px-2 cursor-pointer w-full">
              <Check className="mr-1 w-3 h-3" /> {nombre_button}
            </Button>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Filtro;
