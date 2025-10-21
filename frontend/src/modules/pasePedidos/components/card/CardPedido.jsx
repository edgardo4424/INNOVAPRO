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

// NOTA: Se mantienen los colores de estado brillantes para que contrasten bien en dark mode,
// pero si deseas tonos más apagados, puedes cambiar los números (ej: 500/600 a 700/800).
const getEstadoClasses = (estado) => {
  switch (estado) {
    case "Confirmado":
      // Amarillo
      return "bg-yellow-500/90 !text-white border-yellow-400";
    case "Emitido":
      // Azul
      return "bg-blue-500/90 !text-white border-blue-400";
    case "Despachado":
      // Verde
      return "bg-green-500/90 !text-white border-green-400";
    default:
      // Gris
      return "bg-slate-500/90 !text-white border-slate-400";
  }
};

const CardPedido = ({ pedido }) => {
  const estadoClasses = getEstadoClasses(pedido.estado);

  return (
    <div className="flex cursor-pointer flex-col rounded-xl border border-slate-700 bg-slate-900 px-4 shadow-xl transition duration-300 ease-in-out">
      <div className=" flex items-center justify-between py-2">
        <h3 className="text-md font-extrabold tracking-tight !text-white">
          {pedido.razon_social}
        </h3>
        <h3
          className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wider ${estadoClasses}`}
        >
          {pedido.estado}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-x-4 text-sm">
        <div className="col-span-[auto_1fr] pb-1">
          <p className="font-bold text-slate-300">Cliente:</p>
          <span className="line-clamp-1 text-slate-200">
            {pedido.cliente_razon_social}
          </span>
          <span className="block text-xs text-slate-400">
            {pedido.cliente_ruc}
          </span>
        </div>

        <div className="col-span-1 pb-1">
          <p className="font-bold text-slate-300">Guía Nro:</p>
          <span
            className={`font-mono text-xs font-semibold ${pedido.guia_nro ? "text-blue-400" : "text-slate-500 italic"}`}
          >
            {pedido.guia_nro || "PENDIENTE"}
          </span>
        </div>

        <hr className="col-span-2 my-1 border-slate-700" />

        <div className="col-span-2 flex justify-between py-3 pt-1 text-xs">
          <div className="flex gap-x-2">
            <span className="font-semibold text-slate-300">Confir.</span>
            <span className="text-slate-400">
              {formatearFecha(pedido.fecha_confirmacion)}
            </span>
          </div>
          {pedido.fecha_despacho && (
            <div className="flex gap-x-2 text-right">
              <span className="font-semibold text-slate-300">Despacho</span>
              <span className="text-slate-400">
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