const pases_pedido_model = require("../infraestructure/utils/pase_pedido_model_front");

module.exports = async (pasePedidoRepository, transaction = null) => {
  const pases_pedidos =
    await pasePedidoRepository.obtenerPasesPedidosConfirmados(transaction);

  const trandform_data = pases_pedidos.map((p) => {
    const pedido = { ...p.get({ plain: true }) };
    const pase_pedido = pases_pedido_model();
    pase_pedido.obra = pedido.contrato.cotizacion.obra.nombre;
    pase_pedido.nro_contrato = pedido.contrato.ref_contrato;
    pase_pedido.id_pedido = p.id;
    pase_pedido.empresa_ruc =
      pedido.contrato.cotizacion.empresas_proveedora.ruc;
    if (pedido.contrato.cotizacion.cliente.tipo == "Persona Jurídica") {
      pase_pedido.cliente_tipo_Doc = "06";
      pase_pedido.cliente_num_Doc = pedido.contrato.cotizacion.cliente.ruc;
    }
    if (pedido.contrato.cotizacion.cliente.tipo == "Persona Natural") {
      const t_doc =
        pedido.contrato.cotizacion.cliente.tipo_documento === "DNI"
          ? "01"
          : "04";
      pase_pedido.cliente_tipo_Doc = t_doc;
      pase_pedido.cliente_num_Doc = pedido.contrato.cotizacion.cliente.dni;
    }
    const lista_despiece =
      pedido.contrato.cotizacion.despiece.despieces_detalles;
    let sumatoria_peso = 0;
    const detalles = [];
    for (const pieza of lista_despiece) {
      const payload = {
        index: null,
        unidad: "UNI",
        cantidad: pieza.cantidad,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      };
      sumatoria_peso += Number(pieza.peso_kg) * Number(pieza.cantidad);

      detalles.push(payload);
    }
    pase_pedido.guia_Envio_Peso_Total = sumatoria_peso;
    pase_pedido.detalle = detalles;
    if (pedido.contrato.cotizacion.tiene_transporte) {
      //La empresa(innova)hace el transporte
      pase_pedido.ValoresPrivado = {
        guia_Envio_Cod_Traslado:
          pedido.contrato.cotizacion == "Alquiler" ? "13" : "02",
        guia_Envio_Des_Traslado:
          pedido.contrato.cotizacion == "Alquiler" ? "ALQUILER" : "VENTA",
        guia_Envio_Mod_Traslado: "02",
      };
    } else {
      pase_pedido.ValoresPrivado = {
        guia_Envio_Cod_Traslado:
          pedido.contrato.cotizacion == "Alquiler" ? "13" : "02",
        guia_Envio_Des_Traslado:
          pedido.contrato.cotizacion == "Alquiler" ? "ALQUILER" : "VENTA",
        guia_Envio_Mod_Traslado: "01",
        transportista: {
          tipo_Doc: "6",
          nro_Doc: "",
          razon_Social: "",
          nro_mtc: "",
        },
      };
    }
    pase_pedido.guia_Envio_Partida_Direccion=pedido.contrato.cotizacion.obra.direccion;
    pase_pedido.guia_Envio_Llegada_Direccion=pedido.contrato.cotizacion.empresas_proveedora.direccion;
    
    return pase_pedido;    
  });
  return {
    codigo: 202,
    respuesta: {
      mensaje: "Pases de pedido obtenidos correctamente",
      pases_pedidos:trandform_data,
    },
  };
};
