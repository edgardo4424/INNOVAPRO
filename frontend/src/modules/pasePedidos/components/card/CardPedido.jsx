const formatearFecha = (date) =>
  date
    ? new Intl.DateTimeFormat("es-ES", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    : "N/A";
const getEstadoClasses = (estado) => {
  switch (estado) {
    case "Confirmado":
      return "bg-yellow-400/90 !text-white border-yellow-300";
    case "Emitido":
      return "bg-blue-400/90 !text-white border-blue-300";
    case "Despachado":
      return "bg-green-400/90 !text-white border-green-300";
    default:
      return "bg-gray-400/90 !text-white border-gray-300";
  }
};

const CardPedido = ({ pedido }) => {
  // Usamos la función de clases de estado
  const estadoClasses = getEstadoClasses(pedido.estado);

  return (
    // Diseño de la tarjeta: Sombra, borde más sutil, fondo blanco
    <div className="flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white px-4 shadow-md transition duration-300 ease-in-out">
      {/* Encabezado y Etiqueta de Estado */}
      <div className=" flex items-center justify-between">
        <h3 className="text-md font-extrabold tracking-tight text-gray-900">
          {pedido.razon_social}
        </h3>
        <h3
          className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wider ${estadoClasses}`}
        >
          {pedido.estado}
        </h3>
      </div>

      {/* Contenido Detallado - Usando Grid para organización */}
      <div className="grid grid-cols-2 gap-x-4 text-sm">
        {/* Columna 1: Cliente y RUC */}
        <div className="col-span-[auto_1fr]">
          <p className="font-bold text-gray-700">Cliente:</p>
          <span className="line-clamp-1 text-gray-600">
            {pedido.cliente_razon_social}
          </span>
          <span className="block text-xs text-gray-500">
            {pedido.cliente_ruc}
          </span>
        </div>

        {/* Columna 2: Guía de Remisión (Solo si existe) */}
        <div className="col-span-1">
          <p className="font-bold text-gray-700">Guía Nro:</p>
          <span
            className={`font-mono text-xs font-semibold ${pedido.guia_nro ? "text-blue-600" : "text-gray-400 italic"}`}
          >
            {pedido.guia_nro || "PENDIENTE"}
          </span>
        </div>

        {/* Separador visual */}
        <hr className="col-span-2 my-1 border-gray-400" />

        {/* Columna 3: Fechas */}
        <div className="col-span-2 flex justify-between py-3 pt-1 text-xs">
          <div className="flex gap-x-2">
            <span className="font-semibold text-gray-700">Confir.</span>
            <span className="text-gray-500">
              {formatearFecha(pedido.fecha_confirmacion)}
            </span>
          </div>
          {pedido.fecha_despacho && (
            <div className="flex gap-x-2 text-right">
              <span className="font-semibold text-gray-700">Despacho</span>
              <span className="text-gray-500">
                {formatearFecha(pedido.fecha_despacho)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPedido;
