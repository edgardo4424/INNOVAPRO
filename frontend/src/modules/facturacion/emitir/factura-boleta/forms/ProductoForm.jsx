import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalListaDeProductos from "../../../components/modal/ModalListaDeProductos";
import { validarModal } from "../utils/validarModal";
import { ProductoValidarEstados } from "../utils/valoresInicial";

const ProductoForm = ({ closeModal }) => {
  const {
    setFactura,
    agregarProducto,
    productoActual,
    setProductoActual,
    edicionProducto,
    productoValida,
    eliminarProducto,
    setProductoValida,
    factura,
  } = useFacturaBoleta();

  const [activeButton, setActiveButton] = useState(false);
  const [tipoItem, setTipoItem] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const IGV_PERCENT = 0.18;
    const TIP_AFECTACION_GRAVADAS = [
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
    ];
    const TIP_AFECTACION_EXONERADAS = [
      "20",
      "21",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "40",
    ];

    // Validar entrada numérica
    let validatedValue = value;
    if (["cantidad", "monto_Valor_Unitario"].includes(name)) {
      const numericValue = parseFloat(value);
      validatedValue =
        isNaN(numericValue) || numericValue < 0 ? 0 : numericValue;
    }

    // Obtener valores actuales
    const cantidad =
      name === "cantidad"
        ? validatedValue
        : parseFloat(productoActual.cantidad || 0);

    const valorUnitario =
      name === "monto_Valor_Unitario"
        ? validatedValue
        : parseFloat(productoActual.monto_Valor_Unitario || 0);

    const tipAfeIgv = productoActual.tip_Afe_Igv || "10";

    // Calcular valores con 6 decimales
    const monto_Base_Igv = +(cantidad * valorUnitario).toFixed(2);
    let igv = 0;
    let total_Impuestos = 0;
    let monto_Precio_Unitario = 0;

    if (TIP_AFECTACION_GRAVADAS.includes(tipAfeIgv)) {
      igv = +(monto_Base_Igv * IGV_PERCENT).toFixed(2);
      total_Impuestos = igv;
      monto_Precio_Unitario = +(valorUnitario * (1 + IGV_PERCENT)).toFixed(2);
    } else if (TIP_AFECTACION_EXONERADAS.includes(tipAfeIgv)) {
      igv = 0;
      total_Impuestos = 0;
      monto_Precio_Unitario = +valorUnitario.toFixed(2);
    } else {
      igv = 0;
      total_Impuestos = 0;
      monto_Precio_Unitario = +valorUnitario.toFixed(2);
    }

    const monto_Valor_Venta = +(cantidad * valorUnitario).toFixed(2);

    setProductoActual((prevValores) => ({
      ...prevValores,
      [name]:
        typeof validatedValue === "string"
          ? validatedValue.toUpperCase()
          : validatedValue,
      monto_Base_Igv,
      igv,
      total_Impuestos,
      monto_Precio_Unitario,
      monto_Valor_Venta,
      porcentaje_Igv: TIP_AFECTACION_GRAVADAS.includes(tipAfeIgv) ? 18 : 0,
    }));
  };

  const handleDescripcion = (e) => {
    const { value } = e.target;
    setProductoActual((prevValores) => ({
      ...prevValores,
      descripcion: value,
    }));
  };

  useEffect(() => {
    handleInputChange({
      target: {
        name: "monto_Valor_Unitario",
        value: productoActual.monto_Valor_Unitario,
      },
    });
  }, [productoActual.tip_Afe_Igv]);

  const handleSelectChange = (value, name) => {
    setProductoActual((prevValores) => ({
      ...prevValores,
      [name]: value,
    }));
  };

  const handleAgregar = async () => {
    setActiveButton(true);
    let validar = await validarModal("producto", productoActual, factura);

    if (!validar.validos) {
      if (validar.message) {
        toast.warn(validar.message, { position: "top-right" });
      }
      setProductoValida(validar.errores);
      setActiveButton(false);
      return;
    }
    setActiveButton(false);
    agregarProducto();
    closeModal();
  };

  const handleEliminar = () => {
    eliminarProducto();
    closeModal();
  };

  useEffect(() => {
    setActiveButton(false);
    setProductoValida(ProductoValidarEstados);
  }, []);

  return (
    <div className="max-h-[45dvh] min-h-[40dvh] w-full overflow-y-scroll md:max-h-[unset] md:overflow-y-hidden">
      <div className="flex w-full justify-end">
        <ModalListaDeProductos
          itemActual={productoActual}
          setItemActual={setProductoActual}
          formulario={factura}
          tipo="factura"
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        // Default to 1 column on small screens, 2 on medium, 4 on large
        className="grid w-full grid-cols-1 gap-x-2 gap-y-3 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Código de Producto */}
        <div className="relative col-span-full flex flex-col gap-1 md:col-span-1">
          <Label>Código de Producto</Label>
          <input
            type="text"
            placeholder="Ej: AM.0100 o Husillo"
            name="cod_Producto"
            value={productoActual.cod_Producto}
            onChange={handleInputChange}
            list="piezas-lista"
            className="rounded border-1 border-gray-400 p-2"
          />
          <span
            className={`text-sm text-red-500 ${
              productoValida.cod_Producto ? "block" : "hidden"
            }`}
          >
            Debes ingresar el codigo del producto
          </span>
        </div>

        {/* Unidad */}
        <div className={`col-span-full flex flex-col gap-1 md:col-span-1`}>
          <Label>Tipo (valor interno)</Label>
          <Select
            name="tipo_item"
            value={productoActual.tipo_item}
            className={`${productoValida?.tipo_item ? "border-red-500" : "border-gray-400"}`}
            onValueChange={(e) => handleSelectChange(e, "tipo_item")}
            // disabled={!tipoItem}
          >
            <SelectTrigger
              className={`w-full border-1 ${productoValida?.tipo_item ? "border-red-500" : "border-gray-400"}`}
            >
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALQUILER">ALQUILER</SelectItem>
              <SelectItem value="TRANSPORTE">TRANSPORTE</SelectItem>
              <SelectItem value="SERVICIO">SERVICIO</SelectItem>
              <SelectItem value="VENTA">VENTA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Unidad */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-1">
          <Label>Unidad</Label>
          <Select
            name="unidad"
            value={productoActual.unidad}
            onValueChange={(e) => handleSelectChange(e, "unidad")}
          >
            <SelectTrigger className="w-full border-1 border-gray-400">
              <SelectValue placeholder="Unidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NIU">NIU - Unidades</SelectItem>
              <SelectItem value="ZZ">ZZ - Servicio</SelectItem>
              <SelectItem value="GRM">GRM - Gramo</SelectItem>
              <SelectItem value="KGM">KGM - Kilogramo</SelectItem>
              <SelectItem value="LTR">LTR - Litro</SelectItem>
              <SelectItem value="MTR">MTR - Metro</SelectItem>
              <SelectItem value="DZ">DZ - Docena</SelectItem>
              <SelectItem value="BX">BX - Caja</SelectItem>
              <SelectItem value="MLT">MLT - Mililitro</SelectItem>
              <SelectItem value="MMT">MMT - Milímetro</SelectItem>
              <SelectItem value="MMK">MMK - Milímetro Cuadrado</SelectItem>
              <SelectItem value="MMQ">MMQ - Milímetro Cúbico</SelectItem>
              <SelectItem value="CMK">CMK - Centímetro Cuadrado</SelectItem>
              <SelectItem value="CMQ">CMQ - Centímetro Cúbico</SelectItem>
              <SelectItem value="CMT">CMT - Centímetro Lineal</SelectItem>
              <SelectItem value="CEN">CEN - Ciento de Unidades</SelectItem>
              <SelectItem value="LEF">LEF - Hoja</SelectItem>
              <SelectItem value="HLT">HLT - Hectolitro</SelectItem>
            </SelectContent>
          </Select>
          <span
            className={`text-sm text-red-500 ${productoValida.unidad ? "block" : "hidden"}`}
          >
            Debes ingresar la unidad del producto.
          </span>
        </div>

        {/* Cantidad */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-2 lg:col-span-1">
          <Label>Cantidad</Label>
          <Input
            type="number"
            name="cantidad"
            value={productoActual.cantidad || ""}
            onChange={handleInputChange}
            className={`border-1 ${productoValida?.cantidad ? "border-red-500" : "border-gray-400"}`}
          />
        </div>

        {/* Valor Unitario */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-2 lg:col-span-1">
          <Label>Valor Unitario (max. 6 dec.)</Label>
          <Input
            type="number"
            name="monto_Valor_Unitario"
            value={productoActual.monto_Valor_Unitario || ""}
            step="0.01"
            onChange={handleInputChange}
            className={`border-1 ${productoValida?.monto_Valor_Unitario ? "border-red-500" : "border-gray-400"}`}
            list="piezas-lista"
          />
        </div>

        {/* Porcentaje IGV */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-1 lg:col-span-1">
          <Label>% IGV</Label>
          <Input
            type="number"
            name="porcentaje_Igv"
            value={productoActual.porcentaje_Igv}
            step="0.01"
            onChange={handleInputChange}
            className="border-1 border-gray-400"
            disabled
          />
        </div>

        {/* IGV */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-1 lg:col-span-1">
          <Label>IGV</Label>
          <Input
            type="number"
            name="igv"
            value={productoActual.igv}
            step="0.01"
            onChange={handleInputChange}
            className="border-1 border-gray-400"
            disabled
          />
        </div>

        {/* Base IGV */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-1 lg:col-span-1">
          <Label>Base IGV</Label>
          <Input
            type="number"
            name="monto_Base_Igv"
            value={productoActual.monto_Base_Igv}
            step="0.01"
            onChange={handleInputChange}
            className="border-1 border-gray-400"
            disabled
          />
        </div>

        {/* Tipo Afectación IGV */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-2 lg:col-span-1">
          <Label>Tipo Afe. IGV</Label>
          <Select
            value={productoActual.tip_Afe_Igv}
            onValueChange={(e) => handleSelectChange(e, "tip_Afe_Igv")}
          >
            <SelectTrigger className="w-full border-1 border-gray-400">
              <SelectValue placeholder="Tipo Afectación IGV" />
            </SelectTrigger>
            <SelectContent>
              {/* Gravado */}
              <SelectItem value="10">
                10 - Gravado - Operación Onerosa
              </SelectItem>
              {/* <SelectItem value="11">11 - Retiro por premio</SelectItem> */}
              {/* <SelectItem value="12">12 - Retiro por donación</SelectItem> */}
              {/* <SelectItem value="13">13 - Retiro</SelectItem> */}
              {/* <SelectItem value="14">14 - Retiro por publicidad</SelectItem> */}
              {/* <SelectItem value="15">15 - Bonificaciones</SelectItem> */}
              {/* <SelectItem value="16">16 - Entrega a trabajadores</SelectItem> */}
              {/* <SelectItem value="17">17 - IVAP</SelectItem> */}

              {/* Exonerado */}
              <SelectItem value="20">
                20 - Exonerado - Operación Onerosa
              </SelectItem>
              {/* <SelectItem value="21">21 - Transferencia Gratuita</SelectItem> */}

              {/* Inafecto */}
              <SelectItem value="30">
                30 - Inafecto - Operación Onerosa
              </SelectItem>
              <SelectItem value="31">31 - Retiro por Bonificación</SelectItem>
              {/* <SelectItem value="32">32 - Retiro</SelectItem> */}
              {/* <SelectItem value="33">33 - Muestras Médicas</SelectItem> */}
              {/* <SelectItem value="34">34 - Convenio Colectivo</SelectItem> */}
              {/* <SelectItem value="35">35 - Retiro por premio</SelectItem> */}
              {/* <SelectItem value="36">36 - Retiro por publicidad</SelectItem> */}

              {/* Exportación */}
              {/* <SelectItem value="40">40 - Exportación</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Total Impuestos */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-2 lg:col-span-1">
          <Label>Total Impuestos</Label>
          <Input
            type="number"
            name="total_Impuestos"
            value={productoActual.total_Impuestos}
            step="0.01"
            onChange={handleInputChange}
            className="border-1 border-gray-400"
            disabled
          />
        </div>

        {/* Precio Unitario */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-2 lg:col-span-1">
          <Label>Precio Unitario</Label>
          <Input
            type="number"
            name="monto_Precio_Unitario"
            value={productoActual.monto_Precio_Unitario}
            step="0.01"
            onChange={handleInputChange}
            className="border-1 border-gray-400"
            disabled
          />
        </div>

        {/* Valor de Venta */}
        <div className="col-span-full flex flex-col gap-1 md:col-span-2 lg:col-span-1">
          <Label>Valor de Venta</Label>
          <Input
            type="number"
            name="monto_Valor_Venta"
            value={productoActual.monto_Valor_Venta}
            step="0.01"
            onChange={handleInputChange}
            className="border-1 border-gray-400"
            disabled
          />
        </div>

        {/* Factor ICBPER */}
        {/* <div className="col-span-full flex flex-col gap-1 md:col-span-2 lg:col-span-1">
          <Label>Factor ICBPER</Label>
          <Input
            type="number"
            name="factor_Icbper"
            value={productoActual.factor_Icbper}
            step="0.01"
            onChange={handleInputChange}
            disabled
            className="border-1 border-gray-400"
          />
        </div> */}

        {/* Descripción */}
        <div
          className={`col-span-full flex flex-col gap-1 md:col-span-${tipoItem ? "3" : "4"}`}
        >
          <Label>Descripción</Label>
          <div className="relative w-full">
            <textarea
              type="text"
              name="descripcion"
              value={productoActual.descripcion}
              onChange={handleDescripcion}
              maxLength={250}
              className={`h-40 w-full resize-none rounded-xl border-1 p-2 uppercase ${productoValida?.descripcion ? "border-red-500" : "border-gray-400"}`}
            />
            <p className="absolute right-4 bottom-2 mt-2 text-right text-sm text-gray-500">
              {productoActual.descripcion.length}/250
            </p>
          </div>
        </div>
      </form>
      {/* 🔘 Botones de acción */}
      <div className="mt-4 flex flex-wrap justify-end gap-3 border-t pt-4 pr-2">
        {edicionProducto?.edicion == true && (
          <Button
            variant="outline"
            onClick={handleEliminar}
            className={
              "w-full cursor-pointer border-2 bg-red-600 text-white hover:scale-105 hover:bg-red-600 hover:text-white md:w-auto"
            }
          >
            Eliminar
          </Button>
        )}
        <Button
          variant="outline"
          onClick={closeModal}
          className={
            "bg-innova-orange hover:bg-innova-orange w-full cursor-pointer border-2 text-white hover:scale-105 hover:text-white md:w-auto"
          }
        >
          Cancelar
        </Button>
        <Button
          disabled={activeButton}
          onClick={handleAgregar}
          form="form-producto"
          className={
            "bg-innova-blue hover:bg-innova-blue w-full cursor-pointer hover:scale-105 md:w-auto"
          }
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default ProductoForm;
