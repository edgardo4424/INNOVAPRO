import { createContext, useContext, useEffect, useState } from "react";
import filialesService from "../../facturacion/service/FilialesService";

const PedidosContenxt = createContext();

const ArrayPedidos = [
  {
    id_contrato: 1,
    id_pedido: 1,
    filial: "ENCOFRADOS INNOVA S.A.C.",
    estado: "Confirmado",
    guia_Envio_Cod_Traslado: "13",
    ubicacion: "",
    cliente_Tipo_Doc: "06",
    cliente_Num_Doc: "20602860338 ",
    cliente_Razon_Social: "Deister Software Peru S.a.C.",
    nombre_Contacto: "Deco",
    ot_Usuario_Pase: "Amelia Isabel",
    ot_Usuario_Revisado: "Amelia Isabel",
    ot_Respuesta_Pase: "",
    cm_Usuario: "Lucas Romero",
    cm_Email: "lucas@grupoinnova.pe",
    cm_Telefono: "No disponble",
    obra: "Campnou",
    nro_contrato: "ae-20255",
    empresa_Ruc: "20562974998",
    guia_Envio_Peso_Total: 2174.3500000000004,
    guia_Envio_Und_Peso_Total: "KGM",
    detalle: [
      {
        index: null,
        unidad: "UNI",
        cantidad: 4,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 4,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 7,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 1,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 1,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 8,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 8,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 8,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
    ],
    ValoresPublico: {
      guia_Envio_Cod_Traslado: "13",
      guia_Envio_Des_Traslado: "ALQUILER",
      guia_Envio_Mod_Traslado: "01",
      transportista: {
        tipo_Doc: "6",
        nro_Doc: "",
        razon_Social: "",
        nro_mtc: "",
      },
    },
    ValoresPrivado: null,
    guia_Envio_Partida_Ubigeo: "",
    guia_Envio_Partida_Direccion: "Miraflores, Perú",
    guia_Envio_Llegada_Ubigeo: "",
    guia_Envio_Llegada_Direccion:
      "AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE",
  },
  {
    id_contrato: 2,
    id_pedido: 2,
    filial: "ANDAMIOS ELECTRICOS INNOVA S.A.C.",
    estado: "Confirmado",
    guia_Envio_Cod_Traslado: "13",
    ubicacion: "",
    cliente_Tipo_Doc: "06",
    cliente_Num_Doc: "20602784402",
    cliente_Razon_Social: "Dekoding S.a.C.",
    nombre_Contacto: "Deco",
    ot_Usuario_Pase: "Claudia Celeste",
    ot_Usuario_Revisado: "Claudia Celeste",
    ot_Respuesta_Pase: "",
    cm_Usuario: "Lucas Romero",
    cm_Email: "lucas@grupoinnova.pe",
    cm_Telefono: "No disponble",
    obra: "Campnou",
    nro_contrato: "ae-2027",
    empresa_Ruc: "20602696643",
    guia_Envio_Peso_Total: 1537.66,
    guia_Envio_Und_Peso_Total: "KGM",
    detalle: [
      {
        index: null,
        unidad: "UNI",
        cantidad: 1,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 4,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 1,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
      {
        index: null,
        unidad: "UNI",
        cantidad: 2,
        cod_Producto: "Esperando a que luis lo incluya en la despices_detalles",
        descripcion: "Esperando a que luis lo incluya en la despices_detalles",
      },
    ],
    ValoresPublico: null,
    ValoresPrivado: {
      guia_Envio_Cod_Traslado: "02",
      guia_Envio_Des_Traslado: "VENTA",
      guia_Envio_Mod_Traslado: "02",
    },
    guia_Envio_Partida_Ubigeo: "",
    guia_Envio_Partida_Direccion: "Miraflores, Perú",
    guia_Envio_Llegada_Ubigeo: "",
    guia_Envio_Llegada_Direccion:
      "AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE",
  },
];

export function PedidosProvider({ children }) {
  const [filiales, setFiliales] = useState([
    {
      id_contrato: 1,
      id_pedido: 1,
      filial: "ENCOFRADOS INNOVA S.A.C.",
      estado: "Confirmado",
      guia_Envio_Cod_Traslado: "13",
      ubicacion: "",
      cliente_Tipo_Doc: "06",
      cliente_Num_Doc: "20602860338 ",
      cliente_Razon_Social: "Deister Software Peru S.a.C.",
      nombre_Contacto: "Deco",
      ot_Usuario_Pase: "Amelia Isabel",
      ot_Usuario_Revisado: "Amelia Isabel",
      ot_Respuesta_Pase: "",
      cm_Usuario: "Lucas Romero",
      cm_Email: "lucas@grupoinnova.pe",
      cm_Telefono: "No disponble",
      obra: "Campnou",
      nro_contrato: "ae-20255",
      empresa_Ruc: "20562974998",
      guia_Envio_Peso_Total: 2174.3500000000004,
      guia_Envio_Und_Peso_Total: "KGM",
      detalle: [
        {
          index: null,
          unidad: "UNI",
          cantidad: 4,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 4,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 7,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 1,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 1,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 8,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 8,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 8,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
      ],
      ValoresPublico: {
        guia_Envio_Cod_Traslado: "13",
        guia_Envio_Des_Traslado: "ALQUILER",
        guia_Envio_Mod_Traslado: "01",
        transportista: {
          tipo_Doc: "6",
          nro_Doc: "",
          razon_Social: "",
          nro_mtc: "",
        },
      },
      ValoresPrivado: null,
      guia_Envio_Partida_Ubigeo: "",
      guia_Envio_Partida_Direccion: "Miraflores, Perú",
      guia_Envio_Llegada_Ubigeo: "",
      guia_Envio_Llegada_Direccion:
        "AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE",
    },
    {
      id_contrato: 2,
      id_pedido: 2,
      filial: "ANDAMIOS ELECTRICOS INNOVA S.A.C.",
      estado: "Confirmado",
      guia_Envio_Cod_Traslado: "13",
      ubicacion: "",
      cliente_Tipo_Doc: "06",
      cliente_Num_Doc: "20602784402",
      cliente_Razon_Social: "Dekoding S.a.C.",
      nombre_Contacto: "Deco",
      ot_Usuario_Pase: "Claudia Celeste",
      ot_Usuario_Revisado: "Claudia Celeste",
      ot_Respuesta_Pase: "",
      cm_Usuario: "Lucas Romero",
      cm_Email: "lucas@grupoinnova.pe",
      cm_Telefono: "No disponble",
      obra: "Campnou",
      nro_contrato: "ae-2027",
      empresa_Ruc: "20602696643",
      guia_Envio_Peso_Total: 1537.66,
      guia_Envio_Und_Peso_Total: "KGM",
      detalle: [
        {
          index: null,
          unidad: "UNI",
          cantidad: 1,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 4,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 1,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
        {
          index: null,
          unidad: "UNI",
          cantidad: 2,
          cod_Producto:
            "Esperando a que luis lo incluya en la despices_detalles",
          descripcion:
            "Esperando a que luis lo incluya en la despices_detalles",
        },
      ],
      ValoresPublico: null,
      ValoresPrivado: {
        guia_Envio_Cod_Traslado: "02",
        guia_Envio_Des_Traslado: "VENTA",
        guia_Envio_Mod_Traslado: "02",
      },
      guia_Envio_Partida_Ubigeo: "",
      guia_Envio_Partida_Direccion: "Miraflores, Perú",
      guia_Envio_Llegada_Ubigeo: "",
      guia_Envio_Llegada_Direccion:
        "AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE",
    },
  ]);
  const [pedidos, setPedidos] = useState(ArrayPedidos);
  const [loading, setLoading] = useState(false);

  // ?? OBTENER TODAS LAS FILIALES

  useEffect(() => {
    const consultarFiliales = async () => {
      try {
        const data = await filialesService.ObtenerPiezas();
        if (data.length === 0) {
          toast.error("No se encontraron filiales");
          return;
        }
        setFiliales(data);
      } catch (error) {
        console.error("Error al consultar filiales:", error);
        toast.error("Ocurrió un error al obtener las filiales");
      }
    };
    consultarFiliales();
  }, []);

  return (
    <PedidosContenxt.Provider
      value={{
        filiales,
        setFiliales,
        pedidos,
        setPedidos,
        loading,
        setLoading,
      }}
    >
      {children}
    </PedidosContenxt.Provider>
  );
}

export function usePedidos() {
  return useContext(PedidosContenxt);
}
