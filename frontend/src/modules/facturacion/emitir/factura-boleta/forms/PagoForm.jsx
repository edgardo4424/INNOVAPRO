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
import { Calendar24 } from "../../notas-de-credito/components/calendar24";
import { validarModal } from "../utils/validarModal";
import { PagoValidarEstados, valorIncialPago } from "../utils/valoresInicial";

const PagoForm = ({ closeModal }) => {
  const {
    factura,
    setFactura,
    precioDolarActual,
    pagoActual,
    pagoValida,
    setPagoActual,
    setPagoValida,
    retencionActivado,
    retencion,
    detraccion,
    detraccionActivado,
  } = useFacturaBoleta();

  // ? LISTA DE LOS PAGOS
  const { forma_pago: ListaDePago } = factura;

  //  ? MONTO TOAL PAGOS REGISTRADOS
  const montoTotalPagos = ListaDePago.reduce(
    (total, pago) => total + (parseFloat(pago.monto) || 0),
    0,
  );

  // ? MONTO RESTANTE
  let montoRestante = factura.monto_Imp_Venta;

  // TODO: SI SE APLICA RETENCION O DETRACCION, VALIDADO SI EL TIPO DE MONEDA ES USD O PEN
  let montoNeto = factura.monto_Imp_Venta;
  // * CONDICIONAL PARA CALCULAR EL MONTO NETO SEGUN EL TIPO DE MONEDA
  if (retencionActivado) {
    if (factura.tipo_Moneda === "USD") {
      montoNeto =
        factura.monto_Imp_Venta - retencion.descuento_monto / precioDolarActual;
      montoNeto = parseFloat(montoNeto.toFixed(2));
    } else {
      montoNeto = factura.monto_Imp_Venta - retencion.descuento_monto;
    }
  } else if (factura.tipo_Operacion == "1001" && !retencionActivado) {
    if (factura.tipo_Moneda === "USD") {
      montoNeto =
        factura.monto_Imp_Venta -
        detraccion.detraccion_mount / precioDolarActual;
      montoNeto = parseFloat(montoNeto.toFixed(2));
    } else {
      montoNeto = factura.monto_Imp_Venta - detraccion.detraccion_mount;
    }
  } else {
    montoNeto = factura.monto_Imp_Venta;
  }
  // * CONDICIONAL PARA REDONDEAR EL MONTO NETO
  montoNeto = parseFloat(montoNeto);

  const [activeButton, setActiveButton] = useState(false);
  const [numeroCuotas, setNumeroCuotas] = useState(1);

  // ?? Datos para calculadora
  const [daysToAdd, setDaysToAdd] = useState("");

  const montoTotalFactura = parseFloat(montoRestante || 0);

  // * FUNCION PARA OBTENER LA FECHA DEL ULTIMO DIA DEL MES
  const getEndOfMonth = (monthsToAdd) => {
    const now = new Date();
    const target = new Date(
      now.getFullYear(),
      now.getMonth() + monthsToAdd + 1,
      0,
    );

    const ymdPeru = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(target);

    return `${ymdPeru}T00:00:00-05:00`;
  };

  // * FUNCION PARA GENERAR CUOTAS EN PAGO ACTUAL
  const generarCuotasEnPagoActual = (numCuotas) => {
    if (numCuotas <= 0 || !factura.monto_Imp_Venta) return;

    const montoTotalDisponible = parseFloat(montoRestante);
    const montoPorCuota = (montoTotalDisponible / numCuotas).toFixed(2);
    const nuevasCuotas = [];

    for (let i = 0; i < numCuotas; i++) {
      let monto = parseFloat(montoPorCuota);

      //? Ajustar la última cuota para compensar redondeos
      if (i === numCuotas - 1) {
        const sumaAnteriores = nuevasCuotas.reduce(
          (sum, c) => sum + parseFloat(c.monto),
          0,
        );
        monto = parseFloat((montoTotalDisponible - sumaAnteriores).toFixed(2));
      }

      nuevasCuotas.push({
        tipo: "Credito",
        monto: monto,
        cuota: i + 1,
        fecha_Pago: getEndOfMonth(i),
      });
    }

    setPagoActual(nuevasCuotas);
  };

  //* Función para generar las cuotas reales basadas en montoNeto
  const generarCuotasReales = (cuotasFormaPago) => {
    if (!cuotasFormaPago || cuotasFormaPago.length === 0) return [];

    const numCuotas = cuotasFormaPago.length;
    const montoPorCuotaReal = (montoNeto / numCuotas).toFixed(2);
    const cuotasReales = [];

    for (let i = 0; i < numCuotas; i++) {
      let monto = parseFloat(montoPorCuotaReal);

      // Ajustar la última cuota para compensar redondeos
      if (i === numCuotas - 1) {
        const sumaAnteriores = cuotasReales.reduce(
          (sum, c) => sum + parseFloat(c.monto),
          0,
        );
        monto = parseFloat((montoNeto - sumaAnteriores).toFixed(2));
      }

      cuotasReales.push({
        tipo: cuotasFormaPago[i].tipo,
        monto: monto,
        cuota: cuotasFormaPago[i].cuota,
        fecha_Pago: cuotasFormaPago[i].fecha_Pago,
      });
    }

    return cuotasReales;
  };

  //* Manejar cambio en número de cuotas
  const handleCuotasChange = (e) => {
    const value = e.target.value;
    const numCuotas = parseInt(value.substring(0, Math.min(2, value.length)));

    if (value === "" || isNaN(numCuotas) || numCuotas < 1) {
      setNumeroCuotas("");
      // Resetear a un array con un objeto base para crédito
      setPagoActual([
        {
          tipo: "Credito",
          monto: 0,
          cuota: pagoActual.length + 1,
          fecha_Pago: getEndOfMonth(0),
        },
      ]);
    } else {
      setNumeroCuotas(numCuotas);
      generarCuotasEnPagoActual(numCuotas);
    }
  };

  //? Actualizar fecha de una cuota específica
  const actualizarFechaCuota = (index, nuevaFecha) => {
    const cuotasActualizadas = [...pagoActual];
    cuotasActualizadas[index] = {
      ...cuotasActualizadas[index],
      fecha_Pago: nuevaFecha,
    };
    setPagoActual(cuotasActualizadas);
  };

  // * MANEJO DEL CAMBIO EN TIPO
  const handleSelectChange = (value, name) => {
    if (name === "tipo") {
      if (value === "Contado") {
        //? Para contado: un solo objeto con cuota = 0
        setPagoActual([
          {
            tipo: "Contado",
            monto: parseFloat(montoRestante),
            cuota: 0,
            fecha_Pago:
              new Date().toISOString().split("T")[0] + "T00:00:00-05:00",
          },
        ]);
        setNumeroCuotas(1);
      } else if (value === "Credito") {
        // Para crédito: un objeto base que se expandirá al seleccionar cuotas
        setPagoActual([
          {
            tipo: "Credito",
            monto: 0,
            cuota: ListaDePago.length + 1,
            fecha_Pago: getEndOfMonth(0),
          },
        ]);
        setNumeroCuotas("");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Solo aplicable para pagos de contado (un solo objeto)
    if (pagoActual[0].tipo !== "Contado") return;

    const pago = pagoActual[0];

    // Permitir que el campo quede vacío sin bloquearlo
    if (value === "") {
      setPagoActual([
        {
          ...pago,
          [name]: value,
        },
      ]);
      return;
    }

    const valorNumerico = parseFloat(value);

    // Validación: No permitir negativos ni NaN
    if (isNaN(valorNumerico) || valorNumerico < 0) {
      return;
    }

    // Validar solo si es el campo 'monto'
    if (name === "monto") {
      const previo = parseFloat(pago.monto) || 0;
      const sumaReal = montoTotalPagos - previo + valorNumerico;

      if (sumaReal > montoTotalFactura) {
        return;
      }
    }

    // Modificar el primer objeto del array
    const updatedPago = { ...pago, [name]: valorNumerico };
    setPagoActual([updatedPago]);
  };

  const handleAgregar = async () => {
    let validar;

    if (pagoActual[0].tipo === "Contado") {
      // Para contado, validar solo el primer objeto
      validar = await validarModal("pago", pagoActual[0], factura);

      if (!validar.validos) {
        if (validar.message) {
          toast.error(validar.message, { position: "top-right" });
        }
        setPagoValida(validar.errores);
        return;
      }

      if (pagoActual[0].monto > montoRestante) {
        toast.error(
          "El monto de la cuota no puede ser mayor al monto restante",
          { position: "top-right" },
        );
        return;
      }

      // Generar cuota real con montoNeto para contado
      const cuotaReal = {
        ...pagoActual[0],
        monto: Number(montoNeto.toFixed(2)),
      };

      // Agregar el pago de contado
      setFactura((prevFactura) => ({
        ...prevFactura,
        forma_pago: [...pagoActual],
        cuotas_Real: [cuotaReal],
        neto_Pagar: Number(montoNeto.toFixed(2)),
      }));
    } else if (pagoActual[0].tipo === "Credito") {
      // Para crédito, validar que hay cuotas generadas
      if (pagoActual.length === 0 || numeroCuotas === "") {
        toast.error("Debe generar al menos una cuota", {
          position: "top-right",
        });
        return;
      }

      // Validar cada cuota
      for (let cuota of pagoActual) {
        validar = await validarModal("pago", cuota, factura);
        if (!validar.validos) {
          if (validar.message) {
            toast.error(validar.message, { position: "top-right" });
          }
          setPagoValida(validar.errores);
          return;
        }
      }

      // Verificar que todas las cuotas tengan fecha de pago
      const cuotasSinFecha = pagoActual.some((cuota) => !cuota.fecha_Pago);
      if (cuotasSinFecha) {
        toast.error("Todas las cuotas deben tener fecha de pago", {
          position: "top-right",
        });
        return;
      }

      // Generar cuotas reales basadas en montoNeto
      const cuotasReales = generarCuotasReales(pagoActual);

      // Agregar todas las cuotas de crédito
      setFactura((prevFactura) => ({
        ...prevFactura,
        forma_pago: [...pagoActual],
        cuotas_Real: [...cuotasReales],
        neto_Pagar: Number(montoNeto.toFixed(2)),
      }));

      setNumeroCuotas(1);
    }

    // Resetear pagoActual
    setPagoActual(valorIncialPago);
    closeModal();
  };

  const handleCancelar = () => {
    setPagoActual(valorIncialPago);
    closeModal();
  };

  useEffect(() => {
    setActiveButton(false);
    setPagoValida(PagoValidarEstados);
  }, []);

  useEffect(() => {
    setNumeroCuotas(pagoActual.length);
  }, []);

  useEffect(() => {
    if (pagoActual[0]?.tipo === "Contado") {
      setPagoActual([
        {
          ...pagoActual[0],
          monto: montoTotalFactura,
        },
      ]);
    }
  }, [pagoActual[0]?.tipo]);

  

  return (
    <div className="col-span-4 w-full overflow-y-auto">
      <form action="" className="grid w-full grid-cols-4 gap-x-2 gap-y-3 py-8">
        {/* Método de pago */}
        <div className="col-span-4 flex flex-col gap-1 md:col-span-2">
          <Label>Método de pago</Label>
          <Select
            name="tipo"
            onValueChange={(e) => {
              handleSelectChange(e, "tipo");
            }}
            value={pagoActual[0]?.tipo || ""}
          >
            <SelectTrigger className="w-full border-1 border-gray-400">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Contado">Contado</SelectItem>
              <SelectItem value="Credito">Credito</SelectItem>
            </SelectContent>
          </Select>
          {pagoValida.tipo && (
            <span className="text-sm text-red-500">
              Debes seleccionar un método de pago
            </span>
          )}
        </div>

        {/* Número de cuotas (solo para Credito) */}
        {pagoActual[0]?.tipo === "Credito" && (
          <div className="col-span-4 flex flex-col gap-1 md:col-span-2">
            <Label>Número de cuotas</Label>
            <Input
              type="number"
              placeholder="Número de cuotas"
              className="border-1 border-gray-400"
              value={numeroCuotas}
              onChange={handleCuotasChange}
              min="1"
              maxLength="2"
            />
          </div>
        )}

        {/* Monto (solo para Contado) */}
        {pagoActual[0]?.tipo === "Contado" && (
          <div className="col-span-4 flex flex-col gap-1 md:col-span-2">
            <Label>Monto a pagar</Label>
            <Input
              type="number"
              name="monto"
              placeholder="Monto"
              className="border-1 border-gray-400"
              onWheel={(e) => e.target.blur()}
              value={pagoActual[0].monto}
              onChange={handleInputChange}
              disabled
            />
            {pagoValida.monto && (
              <span className="text-sm text-red-500">
                Debes ingresar un monto
              </span>
            )}
          </div>
        )}

        {/* Fecha de Pago (solo para Contado) */}
        {pagoActual[0]?.tipo === "Contado" && (
          <div className="col-span-4 flex flex-col gap-1 md:col-span-2">
            <div className="flex justify-between">
              <Label>Fecha de Pago:</Label>
            </div>
            <input
              type="date"
              name="fecha_Pago"
              disabled
              className="rounded-md border-1 border-gray-400 p-1"
              value={pagoActual[0].fecha_Pago.split("T")[0]}
              onChange={(e) =>
                setPagoActual([
                  {
                    ...pagoActual[0],
                    fecha_Pago: e.target.value + "T00:00:00-05:00",
                  },
                ])
              }
            />
          </div>
        )}
      </form>

      {/* Vista previa de cuotas generadas (para Credito) */}
      {pagoActual[0]?.tipo === "Credito" &&
        pagoActual.length > 0 &&
        numeroCuotas !== "" && (
          <div className="max-h-[400px] overflow-y-auto rounded-lg border p-2 md:p-4">
            <h3 className="mb-3 text-lg font-semibold">Cuotas Generadas:</h3>

            {/* Información de montos */}
            {(retencionActivado || factura.tipo_Operacion === "1001") && (
              <div className="mb-4 rounded-lg bg-blue-50 md:p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Monto Original:
                    </span>
                    <p className="text-gray-800">
                      {factura.tipo_Moneda} {montoRestante.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-blue-600">
                      Monto Neto (Real):
                    </span>
                    <p className="font-semibold text-blue-700">
                      {factura.tipo_Moneda} {montoNeto.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {pagoActual.map((cuota, index) => {
                // Calcular el monto real para mostrar
                const montoReal = parseFloat(
                  (montoNeto / pagoActual.length).toFixed(2),
                );
                const montoRealAjustado =
                  index === pagoActual.length - 1
                    ? parseFloat(
                        (
                          montoNeto -
                          montoReal * (pagoActual.length - 1)
                        ).toFixed(2),
                      )
                    : montoReal;

                return (
                  <div
                    key={index}
                    className="grid gap-3 rounded border-l-4 border-blue-400 bg-gray-50 p-2 md:grid-cols-3 md:p-3"
                  >
                    <div>
                      <Label className="text-sm font-medium">
                        Cuota {cuota.cuota}
                      </Label>
                      <div className="space-y-1">
                        {retencionActivado ||
                        factura.tipo_Operacion == "1001" ? (
                          <>
                            <p className="text-sm text-gray-600">
                              Pago: {factura.tipo_Moneda}
                              {cuota.monto.toFixed(2)}
                            </p>
                            <p className="text-sm font-medium text-blue-600">
                              Neto Pago: {factura.tipo_Moneda}
                              {montoRealAjustado.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Forma Pago: {factura.tipo_Moneda}
                            {cuota.monto.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm">Fecha de Pago:</Label>
                      <Calendar24
                        initialDate={cuota.fecha_Pago}
                        setDato={(newData) => {
                          actualizarFechaCuota(index, newData.fecha_Pago);
                        }}
                        tipo="fecha_Pago"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 border-t pt-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Forma Pago:</span>
                  <p className="font-medium text-gray-600">
                    {factura.tipo_Moneda}{" "}
                    {pagoActual.reduce((sum, c) => sum + c.monto, 0).toFixed(2)}
                  </p>
                </div>
                {retencionActivado ||
                  (factura.tipo_Operacion == "1001" && (
                    <div>
                      <span className="text-blue-600">Total Neto Real:</span>
                      <p className="font-medium text-blue-600">
                        {factura.tipo_Moneda} {montoNeto.toFixed(2)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      {/* Información para pagos de contado */}
      {pagoActual[0]?.tipo === "Contado" &&
        (retencionActivado || factura.tipo_Operacion == "1001") && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  Monto a Mostrar:
                </span>
                <p className="text-gray-800">
                  {factura.tipo_Moneda} {pagoActual[0].monto.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="font-medium text-blue-600">
                  Monto Real a Pagar:
                </span>
                <p className="font-semibold text-blue-700">
                  {factura.tipo_Moneda} {montoNeto.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button
          variant="outline"
          onClick={handleCancelar}
          className="cursor-pointer border-2 border-gray-400 hover:bg-red-50 hover:text-red-600"
        >
          Cancelar
        </Button>
        <Button
          disabled={activeButton}
          onClick={handleAgregar}
          className="cursor-pointer bg-blue-600 hover:bg-blue-800"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default PagoForm;
