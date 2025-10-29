const { Tarea } = require("../../../tareas/infrastructure/models/tareaModel");
const pases_pedido_model = require("../../infraestructure/utils/pase_pedido_model_front");
const db = require("../../../../database/models");
const obtenerRestoPiezas = require("../../infraestructure/services/obtenerRestoPiezas");
module.exports = async (pasePedidoRepository, transaction = null) => {
  const pases_pedidos =
    await pasePedidoRepository.obtenerPasesPedidos(transaction);

  const transform_data = await Promise.all(
    pases_pedidos.map(async (p) => {
      const pedido = { ...p.get({ plain: true }) };
      const pase_pedido = pases_pedido_model();
      pase_pedido.contrato_id=pedido.contrato_id;
      pase_pedido.pedido_id = pedido.id;
      pase_pedido.cotizacion_id=pedido.contrato.cotizacion_id;
      pase_pedido.filial=pedido.contrato.cotizacion.empresas_proveedora.razon_social;
      pase_pedido.estado=pedido.estado;
      pase_pedido.tarea_id=pedido.tarea_id
      pase_pedido.tipo_Servicio=pedido.contrato.cotizacion.tipo_cotizacion //Alquiler o venta
      pase_pedido.ubicacion= pedido.contrato.cotizacion.obra.ubicacion.includes("Provincia de Lima")?"Lima":"Provincia";

      //*DATOS DEL CLIENTE 
      if (pedido.contrato.cotizacion.cliente.tipo == "Persona Jurídica") {
        pase_pedido.cliente_Tipo_Doc = "6";
        pase_pedido.cliente_Num_Doc = pedido.contrato.cotizacion.cliente.ruc;
        pase_pedido.cliente_Razon_Social=pedido.contrato.cotizacion.cliente.razon_social;
      }
      if (pedido.contrato.cotizacion.cliente.tipo == "Persona Natural") {
        const t_doc =
          pedido.contrato.cotizacion.cliente.tipo_documento === "DNI"
            ? "1"
            : "4";
        pase_pedido.cliente_Tipo_Doc = t_doc;
        pase_pedido.cliente_Num_Doc = pedido.contrato.cotizacion.cliente.dni;
      }
      pase_pedido.clienteId=pedido.contrato.cotizacion.cliente.id;

      pase_pedido.contrato_id=pedido.contrato.cotizacion.contacto.id;
      pase_pedido.nombre_Contacto=pedido.contrato.cotizacion.contacto.nombre;

      const tarea = await Tarea.findOne({
        where: { cotizacionId: pedido.contrato.cotizacion.id },
        include: [
          {
            model: db.usuarios,
            as: "usuario_solicitante",
            include: [{ model: db.trabajadores, as: "trabajador" }],
          },
          {
            model: db.usuarios,
            as: "tecnico_asignado",
            include: [{ model: db.trabajadores, as: "trabajador" }],
          },
        ],
      });

      if (tarea?.tecnico_asignado) {
        pase_pedido.ot_Usuario_Pase=tarea.tecnico_asignado.trabajador.nombres;
        pase_pedido.ot_Usuario_Revisado=tarea.tecnico_asignado.trabajador.nombres;
      }
      const trabajador=pedido.contrato.cotizacion.usuario.trabajador
      pase_pedido.cm_Usuario=`${trabajador.nombres} ${trabajador.apellidos}`;
      pase_pedido.cm_Email=pedido.contrato.cotizacion.usuario.email;
      pase_pedido.cm_Telefono=trabajador.telefono||"No disponble"







      pase_pedido.obra = pedido.contrato.cotizacion.obra.nombre;
      pase_pedido.obraId = pedido.contrato.cotizacion.obra.id;
      pase_pedido.nro_contrato = pedido.contrato.ref_contrato;
      pase_pedido.empresa_Ruc =
      pedido.contrato.cotizacion.empresas_proveedora.ruc;
      pase_pedido.empresaProveedoraId= pedido.contrato.cotizacion.empresas_proveedora.id;




      const lista_despiece =
        pedido.contrato.cotizacion.despiece.despieces_detalles;
      let sumatoria_peso = 0;
      let lista_piezas_para_emitir = [];
      const restoPiezas=await obtenerRestoPiezas(lista_despiece,pedido.contrato_id);
      for (const pieza of restoPiezas) {
        const payload = {
          index: null,
          unidad: "UNI",
          cantidad: pieza.cantidad,
          cod_Producto:pieza.item,
          descripcion:pieza.descripcion
        };
        sumatoria_peso += Number(pieza.peso_kg);
        lista_piezas_para_emitir.push(payload)
      }



      pase_pedido.guia_Envio_Peso_Total = sumatoria_peso;
      pase_pedido.detalle = lista_piezas_para_emitir;
      if (pedido.contrato.cotizacion.tiene_transporte) {
        //La empresa(innova)hace el transporte
        pase_pedido.ValoresPrivado = {
          guia_Envio_Cod_Traslado:
            pedido.contrato.cotizacion.tipo_cotizacion == "Alquiler"
              ? "13"
              : "02",
          guia_Envio_Des_Traslado:
            pedido.contrato.cotizacion.tipo_cotizacion == "Alquiler"
              ? "ALQUILER"
              : "VENTA",
          guia_Envio_Mod_Traslado: "02",
        };
      } else {
        pase_pedido.ValoresPublico = {
          guia_Envio_Cod_Traslado:
            pedido.contrato.cotizacion.tipo_cotizacion == "Alquiler"
              ? "13"
              : "02",
          guia_Envio_Des_Traslado:
            pedido.contrato.cotizacion.tipo_cotizacion == "Alquiler"
              ? "ALQUILER"
              : "VENTA",
          guia_Envio_Mod_Traslado: "01",
          transportista: {
            tipo_Doc: "6",
            nro_Doc: "",
            razon_Social: "",
            nro_mtc: "",
          },
        };
      }
      pase_pedido.guia_Envio_Partida_Direccion =
        pedido.contrato.cotizacion.obra.direccion;
      pase_pedido.guia_Envio_Llegada_Direccion =
        pedido.contrato.cotizacion.empresas_proveedora.direccion;

      return pase_pedido;
    })
  );
  return {
    codigo: 202,
    respuesta: {
      mensaje: "Pases de pedido obtenidos correctamente",
      pases_pedidos: transform_data,
    },
  };
};