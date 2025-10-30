import { useEffect, useState } from "react";
import { usePedidos } from "../../context/PedidosContenxt";
import FiltroPedidos from "../FiltroPedidos";
import ModalNuevaTarea from "../modal/ModalNuevaTarea";
import ModalPedidoDetallado from "../modal/ModalPedidoDetallado";
import TablaConfirmado from "../tabla/TablaConfirmado";
import TablaSkeleton from "../TablaSkeleton";

let filtroInit = {
  estado: "",
  filial: "",
  fecha: "",
};

const ContentPedidos = () => {
  const { pedidos, loading, filiales } = usePedidos();

  const [ListaPedidos, setListaPedidos] = useState(pedidos);
  const [filtroPedidos, setFiltroPedidos] = useState(filtroInit);

  //   ?? Vizualizar Pedido
  const [pedidoView, setPedidoView] = useState(null);
  const [openView, setOpenView] = useState(false);

  const [openNuevaTarea, setOpenNuevaTarea] = useState(false);

  useEffect(() => {
    if (!openNuevaTarea) {
      setPedidoView(null);
    }
  }, [openNuevaTarea]);

  useEffect(() => {}, [filtroPedidos]);

  return (
    <div className="flex flex-col gap-y-4">
      <FiltroPedidos
        filiales={filiales}
        setFiltroPedidos={setFiltroPedidos}
        filtroPedidos={filtroPedidos}
      />
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
              setOpenNuevaTarea={setOpenNuevaTarea}
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
              openNuevaTarea && pedidoView && (
                <ModalNuevaTarea
                  open={openNuevaTarea}
                  setOpen={setOpenNuevaTarea}
                  pedidoView={pedidoView}
                  setPedidoView={setPedidoView}
                  filiales={filiales}
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
