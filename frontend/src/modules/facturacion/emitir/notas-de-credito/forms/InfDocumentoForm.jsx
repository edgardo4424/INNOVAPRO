import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Search, SquarePen } from "lucide-react";
import { Calendar22 } from "../../factura-boleta/components/Calendar22";

const InfDocumentoForm = () => {
  return (
    <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
      <h2 className="text-2xl font-semibold mb-2 flex">
        Información del Documento
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mb-8">

        {/* Tipo de Operacion */}
        <div className="flex flex-col gap-1 col-span-full sm:col-span-1"> {/* Col-span-full para que ocupe todo el ancho en móviles */}
          <Label htmlFor="tipo_operacion">Tipo de Operación</Label>
          <Select
            name="tipo_operacion"
          // value={factura.tipo_Operacion}
          // onValueChange={(e) => {
          // handleSelectChange(e, "tipo_Operacion");
          // }}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
              <SelectValue placeholder="Selecciona un tipo de operación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0101">Venta Interna - (0101)</SelectItem>
              {/* <SelectItem value="0102">Exportación</SelectItem> */}
              {/* <SelectItem value="0103">No Domiciliados</SelectItem> */}
              {/* <SelectItem value="0104">Venta Interna – Anticipos</SelectItem>
                            <SelectItem value="0105">Venta Itinerante</SelectItem>
                            <SelectItem value="0106">Factura Guía</SelectItem>
                            <SelectItem value="0107">Venta Arroz Pilado</SelectItem>
                            <SelectItem value="0108">
                                Factura - Comprobante de Percepción
                            </SelectItem>
                            <SelectItem value="0110">Factura - Guía remitente</SelectItem>
                            <SelectItem value="0111">Factura - Guía transportista</SelectItem> */}
              {/* <SelectItem value="1001">Operaciones Gravadas</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Documento */}
        <div>
          <Label
            htmlFor="tipo_Doc"
            className="block text-sm text-left mb-1"
          >
            Tipo de Documento
          </Label>
          <Select
            name="tipo_operacion"
          // value={tipo_Doc}
          // onValueChange={(e) => {
          // handleSelectChange(e, "tipo_Doc");
          // }}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
              <SelectValue placeholder="Selecciona un tipo de Documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="07">Nota de Credito</SelectItem>
              <SelectItem value="08">Nota de Debito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Serie */}
        <div>
          <Label
            htmlFor="serie"
            className="block text-sm text-left mb-1"
          >
            Serie
          </Label>
          <div className="relative w-full">
            <Input
              type="text"
              id="serie"
              name="serie"
              className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
            // value={serie}
            // onChange={handleChange}
            // disabled={!serieEstado}
            />
            <button
              // onClick={activarSerie}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 `}>
              <SquarePen />
            </button>
          </div>
        </div>

        {/* Correlativo */}
        <div>
          <Label
            htmlFor="correlativo"
            className="block text-sm text-left mb-1"
          >
            Correlativo
          </Label>
          <div className="flex justify-between gap-x-2">
            <div className="relative w-full">
              <Input
                type="text"
                id="correlativo"
                name="correlativo"
                // value={correlativo}
                // onChange={handleChange}
                // disabled={!correlativoEstado}
                className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
              />
              <button
                // onClick={activarCorrelativo}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 `}>
                <SquarePen />
              </button>
            </div>
            <button className={`bg-blue-500 hover:bg-blue-600  cursor-pointer  text-white rounded-md px-2 `}
            // disabled={correlativoEstado}
            // onClick={(e) => buscarCorrelativo(e)}
            >
              {/* {loadingCorrelativo ? */}
              {/* <LoaderCircle className="w-4 h-4 animate-spin" /> */}
              {/* : */}
              <Search />
              {/* } */}
            </button>
          </div>
        </div>

        {/* Tipo de Moneda */}
        <div className="flex flex-col gap-1 col-span-full sm:col-span-1">
          <Label htmlFor="tipo_moneda">Tipo de Moneda</Label>
          <Select
          // value={factura.tipo_Moneda}
          // name="tipo_Moneda"
          // onValueChange={(e) => {
          // handleSelectChange(e, "tipo_Moneda");
          // }}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
              <SelectValue placeholder="Qué moneda usas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PEN">SOLES</SelectItem>
              <SelectItem value="USD">DÓLAR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fecha de Emisión */}
        <div>
          <Label
            htmlFor="fecha_Emision"
            className="block text-sm  text-left mb-1 "
          >
            Fecha de Emisión
          </Label>
          <Calendar22
            tipo={"fecha_Emision"}
            // Dato={guiaTransporte}
            // setDato={setGuiaTransporte}
            type="datetime-local"
            id="fecha_Emision"
            name="fecha_Emision"
            className="px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 focus:outline-none text-sm"
          />
        </div>

        {/* Ruc de la Empresa */}
        <div className="flex flex-col gap-1 col-span-full sm:col-span-1"> {/* Col-span-full para que ocupe todo el ancho en móviles */}
          <Label htmlFor="tipo_operacion">Ruc de la empresa</Label>
          <Select
            name="tipo_operacion"
          // value={factura.tipo_Operacion}
          // onValueChange={(e) => {
          // handleSelectChange(e, "tipo_Operacion");
          // }}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm"> {/* Estilo de borde mejorado */}
              <SelectValue placeholder="Selecciona un tipo de operación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20607086215">RUC DE PRUEBA</SelectItem>
              <SelectItem value="20603021933">Innova Rental Maquinaria Sac | Grupo Innova</SelectItem>
              <SelectItem value="20562974998">Encofrados Innova S.a.C. | Grupo Innova</SelectItem>
              <SelectItem value="20602696643">Andamios Electricos Innova S.a.C. | Grupo Innova</SelectItem>
              <SelectItem value="20555389052">Indek Andina e.I.R.L | Grupo Innova</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Observación */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <Label
            htmlFor="observacion"
            className="block text-sm text-left mb-1"
          >
            Observación
          </Label>
          <Textarea
            id="observacion"
            name="observacion"
            // value={observacion}
            // onChange={handleChange}
            rows="2"
            className="h-22 px-3 py-2 block w-full rounded-md border text-gray-800 border-gray-400 text-sm"
          >
          </Textarea>
        </div>
      </div>
    </div>
  )
}

export default InfDocumentoForm
