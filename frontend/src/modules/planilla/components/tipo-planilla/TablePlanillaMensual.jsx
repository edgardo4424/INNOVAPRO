import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import RowPlanillaMensual from "./RowPlanillaMensual";
import RowTotalPlanillaMensual from "./RowTotalPlanillaMensual";
import { Button } from "@/components/ui/button";
import ModalImportesTrabajador from "./ModalmportesTrabajador";

const TablePlanillaMensual = ({
  planillaMensualTipoPlanilla,
  filiales,
  filial_id,
  datosTotalesPlanilla = {
    sumatoria_sueldo_basico: 0,
    sumatoria_sueldo_mensual: 0,
    sumatoria_sueldo_bruto: 0,
    sumatoria_sueldo_neto: 0,
    sumatoria_saldo_por_pagar: 0,
    sumatoria_essalud: 0,
    sumatoria_vida_ley: 0,
    sumatoria_sctr_salud: 0,
    sumatoria_sctr_pension: 0,
  },
}) => {
  const [filtro, setFiltro] = useState("");

const filtrarTrabajadores = (trabajadores) => {
  const resultado = trabajadores.filter((t) =>
    `${t.nombres_apellidos}`
      .toLowerCase()
      .includes(filtro?.toLowerCase())
  );

  console.log("Filtro aplicado:", filtro);
  console.log("Resultados filtrados:", resultado);

  return resultado;
};

  return (
    <article className="flex w-full flex-col overflow-x-auto rounded-xl border-2 p-5 shadow-xl">
      <section className="flex justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Planilla</h1>
        </div>
        <section className=" flex space-x-6">
          <div className="relative w-98">
            <Input
              type="search"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              placeholder="Buscar por nombres"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <Search className="absolute top-2 right-3 h-5 w-5 text-gray-400" />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            {filiales?.length > 0 && filial_id && (
              <ModalImportesTrabajador filial_id={filial_id} />
            )}
          </div>
        </section>
      </section>

      {/* Tabla scrollable con headers sticky */}
      <div className="mt-4 max-h-[600px] overflow-auto rounded-md bg-gray-100">
        <table className="w-full min-w-[1500px]">
          <thead className="bg-innova-blue sticky top-0 z-10 text-xs text-white">
            {/* --- PRIMERA FILA: GRUPOS --- */}
            <tr>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Acciones
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Tipo Doc
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                N° Doc
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Nombres y Apellidos
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Área
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                AFP
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Fecha Ingreso
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Días Labor
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Sueldo Base
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Sueldo Mensual
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Asig. Fam.
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Descanso Méd
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Lic. con Goce
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Lic. sin Goce
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Vacaciones
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Vac. Vendidas
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Gratificación
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                CTS
              </th>

              {/* GRUPO HORAS EXTRAS */}
              <th
                colSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Prom. H. Extras
              </th>

              {/* GRUPO FALTAS */}
              <th
                colSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Importe Faltas
              </th>

              {/* GRUPO TARDANZAS */}
              <th
                colSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Importe Tardanzas
              </th>

              {/* GRUPO BONOS */}
              <th
                colSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Bonos
              </th>

              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Sueldo Bruto
              </th>

              {/* GRUPO DESCUENTOS */}
              <th
                colSpan="5"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Descuentos al Trabajador
              </th>

              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Total Desc.
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Sueldo Neto
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Sueldo Quin.
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Adelanto/Prést.
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Saldo x Pagar
              </th>
              <th
                rowSpan="2"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                ESSALUD 9%
              </th>

              {/* GRUPO APORTES */}
              <th
                colSpan="4"
                className="px-2 py-2 text-center whitespace-nowrap"
              >
                Aportes al Trabajador
              </th>
            </tr>

            {/* --- SEGUNDA FILA: SUBCOLUMNAS --- */}
            <tr>
              {/* HORAS EXTRAS */}
              <th className="px-2 py-2 text-center whitespace-nowrap">1Q</th>
              <th className="px-2 py-2 text-center whitespace-nowrap">2Q</th>

              {/* FALTAS */}
              <th className="px-2 py-2 text-center whitespace-nowrap">1Q</th>
              <th className="px-2 py-2 text-center whitespace-nowrap">2Q</th>

              {/* TARDANZAS */}
              <th className="px-2 py-2 text-center whitespace-nowrap">1Q</th>
              <th className="px-2 py-2 text-center whitespace-nowrap">2Q</th>

              {/* BONOS */}
              <th className="px-2 py-2 text-center whitespace-nowrap">1Q</th>
              <th className="px-2 py-2 text-center whitespace-nowrap">2Q</th>

              {/* DESCUENTOS */}
              <th className="px-2 py-2 text-center whitespace-nowrap">ONP</th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                AFP Oblig.
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                Seguro
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                Comisión
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                5ta Categ.
              </th>

              {/* APORTES */}
              <th className="px-2 py-2 text-center whitespace-nowrap">
                Vida Ley
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                SCTR Salud
              </th>
              <th className="px-2 py-2 text-center whitespace-nowrap">
                SCTR Pensión
              </th>
            </tr>
          </thead>

          <tbody className="mt16">
            {planillaMensualTipoPlanilla.length > 0 && (
              <>
                {filtrarTrabajadores(planillaMensualTipoPlanilla).map(
                  (e, index) => (
                    <RowPlanillaMensual key={index} e={e} />
                  ),
                )}
                <RowTotalPlanillaMensual
                  datosTotalesPlanilla={datosTotalesPlanilla}
                />
              </>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default TablePlanillaMensual;
