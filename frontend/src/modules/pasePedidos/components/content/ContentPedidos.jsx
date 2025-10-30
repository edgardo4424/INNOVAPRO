import { useEffect, useState } from "react";
import { usePedidos } from "../../context/PedidosContenxt";
import FiltroPedidos from "../FiltroPedidos";
import ModalNuevaTarea from "../modal/ModalNuevaTarea";
import ModalPedidoDetallado from "../modal/ModalPedidoDetallado";
import TablaConfirmado from "../tabla/TablaConfirmado";
import TablaSkeleton from "../TablaSkeleton";

const filtroInit = {
  estado: "",
  filial: "",
  fecha_incio: "",
  fecha_final: "",
  comercial: "",
};

const ContentPedidos = () => {
  const { pedidos, loading, filiales } = usePedidos();

  const [listaPedidos, setListaPedidos] = useState([]);
  const [filtroPedidos, setFiltroPedidos] = useState(filtroInit);

  // Modal vista pedido
  const [pedidoView, setPedidoView] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openNuevaTarea, setOpenNuevaTarea] = useState(false);

  useEffect(() => {
    if (!openNuevaTarea) {
      setPedidoView(null);
    }
  }, [openNuevaTarea]);

  // 🔥 Filtrado reactivo
  useEffect(() => {
    if (!pedidos) return;

    const { estado, filial, fecha_incio, fecha_final, comercial } =
      filtroPedidos;

    const result = pedidos.filter((p) => {
      // Comparaciones base
      const matchEstado = estado ? p.estado === estado : true;
      const matchFilial = filial ? p.filial === filial : true;

      // Comparar fechas (ajusta el campo real de tu pedido)
      const fechaPedido = p.fecha || p.fecha_emision || "";
      const matchFechaInicio = fecha_incio ? fechaPedido >= fecha_incio : true;
      const matchFechaFinal = fecha_final ? fechaPedido <= fecha_final : true;

      // 🆕 Filtrar por comercial (busca coincidencias parciales, insensible a mayúsculas)
      const matchComercial = comercial
        ? p.cm_Usuario?.toLowerCase().includes(comercial.toLowerCase())
        : true;

      return (
        matchEstado &&
        matchFilial &&
        matchFechaInicio &&
        matchFechaFinal &&
        matchComercial
      );
    });

    setListaPedidos(result);
  }, [filtroPedidos, pedidos]);

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
        ) : listaPedidos.length === 0 ? (
          <div className="w-full max-w-6xl py-12 text-center">
            <h2 className="text-2xl font-bold text-blue-600 md:text-3xl">
              No hay pedidos
            </h2>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <TablaConfirmado
              listaPedidos={listaPedidos}
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

            {openNuevaTarea && pedidoView && (
              <ModalNuevaTarea
                open={openNuevaTarea}
                setOpen={setOpenNuevaTarea}
                pedidoView={pedidoView}
                setPedidoView={setPedidoView}
                filiales={filiales}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPedidos;
