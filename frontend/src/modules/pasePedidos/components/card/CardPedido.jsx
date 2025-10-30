const formatearFecha = (dateString) => {
  if (!dateString) return "";
  const fecha = new Date(dateString);

  const dia = fecha.getDate().toString().padStart(2, "0");
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const anio = fecha.getFullYear();

  let horas = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const ampm = horas >= 12 ? "pm" : "am";
  horas = horas % 12 || 12; // convierte a formato 12h

  return `${dia}/${mes}/${anio} ${horas}:${minutos} ${ampm}`;
};

const getEstadoClasses = (estado) => {
  switch (estado) {
    case "Incompleto":
      return "bg-orange-500/90 text-white border border-orange-400 shadow-sm";
    case "Stock Confirmado":
      return "bg-yellow-500/90 text-white border border-yellow-400 shadow-sm";
    case "Emitido":
      return "bg-blue-500/90 text-white border border-blue-400 shadow-sm";
    case "Despachado":
      return "bg-green-500/90 text-white border border-green-400 shadow-sm";
    default:
      return "bg-slate-500/90 text-white border border-slate-400 shadow-sm";
  }
};


const CardPedido = ({ pedido }) => {
  const estadoClasses = getEstadoClasses(pedido.estado);

  return (
    <div className="flex cursor-pointer flex-col rounded-xl border border-slate-700 bg-slate-900 px-4 shadow-xl transition duration-300 ease-in-out">
      <div className="flex items-center justify-between py-2">
        <h3 className="text-md font-extrabold tracking-tight !text-white">
          {pedido.razon_social}
        </h3>
        <h3
          className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wider !text-white ${estadoClasses}`}
        >
          {pedido.estado}
        </h3>
      </div>

      <div className="grid grid-cols-[full_1fr] gap-x-4 text-sm">
        <div className="col-span-[auto_1fr] pb-1">
          <p className="font-bold text-slate-300">Cliente:</p>
          <span className="line-clamp-1 text-slate-200">
            {pedido.cliente_razon_social}
          </span>
          <span className="block text-xs text-slate-400">
            {pedido.cliente_ruc}
          </span>
        </div>

        {pedido?.guias && pedido?.guias.length > 0 && (
          <div className="col-span-1 pb-1">
            <p className="font-bold text-slate-300">Guías Nro:</p>
            <p className="flex flex-col">
              {pedido?.guias.map((guia, index) => (
                <span
                  key={guia.id}
                  className={`font-mono text-xs font-semibold ${guia ? "text-blue-400" : "text-slate-500 italic"}`}
                >
                  {guia.guia_nro || "N/A"}
                </span>
              ))}
            </p>
          </div>
        )}

        {pedido.guia_nro && (
          <div className="col-span-1 pb-1">
            <p className="font-bold text-slate-300">Guía Nro:</p>
            <span
              className={`font-mono text-xs font-semibold ${pedido.guia_nro ? "text-blue-400" : "text-slate-500 italic"}`}
            >
              {pedido.guia_nro || "N/A"}
            </span>
          </div>
        )}

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
