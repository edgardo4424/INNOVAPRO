import React from "react";
import TablaItems from "../tabla/TablaItems";

const FormPedido = ({ pedidoView: pedido }) => {
  const bgEstado = (estado) => {
    switch (estado) {
      case "Confirmado":
        // 🟢 Verde: Listo, Aprobado
        return "bg-green-400 !text-white";
      case "Pre Confirmado":
        // 🟡 Amarillo/Azul: En proceso, En revisión (Si quieres que el azul signifique 'Proceso Activo')
        return "bg-yellow-400 !text-white";
      case "Por Confirmar":
        // 🔴 Rojo/Naranja: Requiere atención inmediata, Falta aprobación crítica
        return "bg-orange-400 !text-white";
      default:
        return "bg-gray-400 !text-white";
    }
  };

  return (
    <div className="mx-auto max-w-4xl border border-gray-400 font-sans text-sm shadow-xl print:border-none print:shadow-none">
      {/* 1. Bloque: Cabecera y Aprobaciones */}
      <div className="flex items-start justify-between border-b border-gray-400 bg-gray-50 p-3">
        {/* Logo e Identificación del Documento */}
        <div className="flex w-full items-center space-x-3">
          <div className="flex w-8/12 justify-center pt-1">
            <p className="text-innova-blue text-2xl font-bold">
              PASE PEDIDO N° {pedido?.nro_Pedido || "N/A"}
            </p>
          </div>
          {/* Firmas / V°B° (Agrupación) */}
          <div className="w-4/12 border border-gray-300 bg-white p-2 pt-1 text-right text-xs">
            <p className="mb-1 text-sm font-extrabold">APROBACIONES</p>
            <div className="grid grid-cols-2 gap-x-4">
              <p className="border-b border-dashed font-bold">
                {pedido?.ot_Usuario_Pase || "N/A"}
              </p>
              <p className="border-b border-dashed font-bold">
                {pedido?.ot_Usuario_Revisado || "N/A"}
              </p>
              <p className="mt-1 text-gray-500 italic">PASE PEDIDO</p>
              <p className="mt-1 text-gray-500 italic">
                {pedido?.ot_Respuesta_Pase || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bloque: Estado del Pedido (Bandera) */}
      <div
        className={`py-1 text-center text-lg font-bold uppercase ${bgEstado(pedido?.estado)} text-white`}
      >
        {pedido?.estado || "N/A"}
      </div>

      {/* 3. Bloque: Datos Principales (Filial, Cliente, Obra/Proyecto) */}
      <div className="border-b border-gray-400">
        {/* Fila 1: Filial y Cliente */}
        <div className="grid grid-cols-5 divide-x divide-gray-400">
          <div className="col-span-2 flex flex-col justify-center bg-gray-100 p-2 text-center font-semibold">
            <span className="text-xs text-gray-600 uppercase">
              Filial Operativa
            </span>
            <span className="mt-0.5 text-sm font-bold">
              {pedido?.filial || "N/A"}
            </span>
          </div>
          <div className="col-span-3 flex flex-col justify-center bg-gray-50 p-2 text-center font-bold">
            <span className="text-xs text-gray-600 uppercase">
              Cliente / Razón Social
            </span>
            <span className="mt-0.5 text-sm font-extrabold">
              {pedido?.cliente_Razon_Social || "N/A"}
            </span>
          </div>
        </div>

        {/* Fila 2: Tipo y Obra */}
        <div className="grid grid-cols-5 divide-x divide-gray-400 border-t border-gray-400">
          <div className="col-span-2 flex flex-col justify-center bg-gray-100 p-2 text-center font-semibold">
            <span className="text-xs text-gray-600 uppercase">
              Tipo de Servicio
            </span>
            <span className="mt-0.5 text-sm font-bold">
              {pedido?.tipo_Servicio || "N/A"}
            </span>
          </div>
          <div className="col-span-3 flex flex-col justify-center bg-gray-50 p-2 text-center font-bold">
            <span className="text-xs text-gray-600 uppercase">
              Obra / Proyecto
            </span>
            <span className="mt-0.5 text-sm font-extrabold">
              {pedido?.obra || "N/A"}
            </span>
          </div>
        </div>

        {/* Fila 3: Ubicación y Plan */}
        <div className="grid grid-cols-5 divide-x divide-gray-400 border-t border-gray-400">
          <div className="col-span-2 flex flex-col justify-center bg-gray-100 p-2 text-center font-semibold">
            <span className="text-xs text-gray-600 uppercase">
              Ubicación / Ciudad
            </span>
            <span className="mt-0.5 text-sm font-bold">
              {pedido?.ubicacion || "N/A"}
            </span>
          </div>
          <div className="col-span-3 flex flex-col justify-center bg-gray-50 p-2 text-center font-bold">
            <span className="text-xs text-gray-600 uppercase">
              Tarifario / Plan
            </span>
            <span className="mt-0.5 text-sm">
              {pedido?.tarifario || "N/A"} /
              <span className="text-innova-blue ml-1 font-extrabold underline">
                {pedido?.plan_Tarifario || "N/A"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bloque: Logística y Notas (Panel Lateral) */}
      <div className="grid grid-cols-3 divide-x divide-gray-400">
        {/* Columna 1 y 2: Logística y Tiempos */}
        <div className="col-span-2 bg-orange-100 p-3 text-xs">
          <p className="mb-1 border-b border-red-700 pb-0.5 text-base font-bold text-red-700 uppercase">
            Instrucciones de Despacho
          </p>
          <div className="grid grid-cols-2 gap-y-1">
            <p className="flex gap-x-2">
              <span className="font-semibold">Obra Nueva:</span>
              <span>{pedido?.obra_Nueva || "N/A"}</span>
            </p>
            <p className="flex gap-x-2">
              <span className="font-semibold">F. Pase Pedido:</span>
              <span>{pedido.f_Pase_Pedido}</span>
            </p>
            <p className="flex gap-x-2">
              <span className="font-semibold">F. Entrega:</span>
              <span>{pedido?.f_Entrega || "N/A"}</span>
            </p>
            <p className="flex gap-x-2">
              <span className="font-semibold">Hora Obra:</span>
              <span>{pedido?.hora_Obra || "N/A"}</span>
            </p>
            <p className="flex gap-x-2">
              <span className="font-semibold">Transporte:</span>
              <span>{pedido?.tranporte || "N/A"}</span>
            </p>
            <p className="flex gap-x-2">
              <span className="font-semibold">Peso ( {pedido?.guia_Envio_Und_Peso_Total || "N/A"} ):</span>
              <span>{pedido?.guia_Envio_Peso_Total || "N/A"}</span>
            </p>
          </div>
          <p className="mt-2 bg-amber-200 py-1 pl-1 font-bold text-gray-800 uppercase">
            {pedido?.mensaje_Extra || "N/A"}
          </p>
        </div>

        {/* Columna 3: Nota Adicional */}
        <div className="bg-yellow-50 p-3 text-xs">
          <p className="border-b border-gray-400 pb-0.5 font-bold">
            Nota Adicional / Observaciones:
          </p>
          <p className="mt-1 text-gray-600 italic">
            {pedido?.Observacion || "[ESPACIO PARA NOTAS DEL EJECUTIVO]"}
          </p>
        </div>
      </div>

      {/* 5. Bloque: Detalle de Productos (Espacio reservado) */}
      <div className="border-t border-gray-400 bg-white p-3">
        <TablaItems items={pedido?.detalle} />
      </div>

      {/* 6. Bloque: Detalle de Servicios (Espacio reservado) */}
      <div className="grid grid-cols-2 px-10 py-3">
        <div className="grid grid-cols-2">
          <span className="font-bold">Ref. contrato:</span>
          <span>Contrato 1</span>
          <span className="font-bold">Dirección Obra:</span>
          <span>Dirección 1</span>
          <span className="font-bold">Proyecto:</span>
          <span>Proyecto 1</span>
          <span className="font-bold">Fecha:</span>
          <span>10/10/2025</span>
          <span className="font-bold">Telf:</span>
          <span>9999999</span>
          <span className="font-bold">Comercial:</span>
          <span>Miguel</span>
          <span className="font-bold">E-mail:</span>
          <span>azul@innova</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="font-bold">Razon Social:</span>
          <span>cliente</span>
          <span className="font-bold">Ruc:</span>
          <span>4999999999</span>
          <span className="font-bold">A/A:</span>
          <span>Ing. Miguel</span>
          <span className="font-bold">Domicilio Fiscal:</span>
          <span>
            AV. 28 DE JULIO MZ E LT18 URB. BALNEARIO PUNTA HERMOSA SUR
          </span>
          <span className="font-bold">E-mail:</span>
          <span>dad@innova</span>
        </div>
      </div>

      {/* Contrato */}
      <div>
        <h1 className="text-center font-bold underline">
          CONTRATO DE ALQUILER DE MATERIAL
        </h1>
      </div>

      <div className="flex w-full px-10 py-3">
        <ul>
          <li>
            <h2>Servicio de Alquiler</h2>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FormPedido;
