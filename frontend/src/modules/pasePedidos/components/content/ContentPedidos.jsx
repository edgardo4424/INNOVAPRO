import { useState } from "react";
import { usePedidos } from "../../context/PedidosContenxt";
import FiltroPedidos from "../FiltroPedidos";
import ModalPedidoDetallado from "../modal/ModalPedidoDetallado";
import TablaConfirmado from "../tabla/TablaConfirmado";
import TablaSkeleton from "../TablaSkeleton";
import ModalValidarStock from "../modal/ModalValidarStock";

const ContentPedidos = () => {
  const { pedidos, loading } = usePedidos();

  //   ?? Vizualizar Pedido
  const [pedidoView, setPedidoView] = useState(null);
  const [openView, setOpenView] = useState(false);

  const [cotizacion_id, setCotizacion_id] = useState(null);
  const [openCotizacion, setOpenCotizacion] = useState(false);

  return (
    <div className="flex flex-col gap-y-4">
      <FiltroPedidos />
      <div className="w-full">
        {loading ? (
          <TablaSkeleton rows={10} />
        ) : pedidos.length === 0 ? (
          <div className="w-full max-w-6xl">
            <div className="mb-6 flex items-center justify-between"></div>
            <h2 className="text-2xl font-bold text-blue-600 md:text-3xl">
              No hay pedidos
            </h2>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <TablaConfirmado
              listaPedidos={pedidos}
              setOpen={setOpenView}
              setPedidoView={setPedidoView}
              setOpenCotizacion={setOpenCotizacion}
              setCotizacion_id={setCotizacion_id}
            />
            {openView && pedidoView && (
              <ModalPedidoDetallado
                open={openView}
                setOpen={setOpenView}
                pedidoView={pedidoView}
                setPedidoView={setPedidoView}
              />
            )}
            {
              // ?? Vizualizar Cotizacion
              openCotizacion && cotizacion_id && (
                <ModalValidarStock
                  open={openCotizacion}
                  setOpen={setOpenCotizacion}
                  cotizacion_id={cotizacion_id}
                  pedidoView={pedidoView}
                  setPedidoView={setPedidoView}
                  setCotizacion_id={setCotizacion_id}
                />
              )
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPedidos;
