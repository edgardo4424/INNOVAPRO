import { createContext, useContext, useEffect, useState } from "react";
import filialesService from "../../facturacion/service/FilialesService";

const PedidosContenxt = createContext();

const ArrayPedidos = [
  // --- EJEMPLOS: POR CONFIRMAR ---
  {
    id_pedido: 52,
    filial: "ENCOFRADOS INNOVA S.A.C.",
    empresa_Ruc: "20562974998",
    nro_Pedido: "PED-00101",
    estado: "Confirmado",
    tipo_Servicio: "Alquiler",
    guia_Envio_Cod_Traslado: "13",
    ubicacion: "Lima",

    cliente_Tipo_Doc: "6",
    cliente_Num_Doc: "20602860338",
    cliente_Razon_Social: "Constructora Alfa S.A.C.",
    nombre_Contacto: "Ing. Delfín Estebes",
    dom_Fiscal: "Av. Los Olivos 1234",
    cli_Email: "B2p3w@example.com",

    ot_Usuario_Pase: "LUCERO",
    ot_Usuario_Revisado: "AMELIA",
    ot_Respuesta_Pase: "VISTO BUENO",

    cm_Usuario: "Kaya Chalco",
    cm_Email: "B2p3w@example.com",
    cm_Telefono: "987654321",

    obra: "Edificio Residencial Sol",
    obra_Direccion: "Av. Los Olivos 1234",
    nro_contrato: "CON-00101",
    guia_Envio_Peso_Total: "0.45",
    guia_Envio_Und_Peso_Total: "TEN",

    obra_Nueva: "No",
    f_Pase_Pedido: "25/10/2025",
    f_Entrega: "25/10/2025",
    hora_Obra: "08:00",
    tranporte: "CLIENTE",

    estado_Equipo: "Basico",
    tipo_Plan_Equipo: "Plan INTERMEDIO",

    direccion_Obra: "Av. Los Olivos 1234",

    mensaje_Extra: "No se entrega en la obra",
    Observacion:
      "lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae.",

    detalle: [
      {
        index: null,
        unidad: "NIU",
        cantidad: "1.00",
        cod_Producto: "AE.0100",
        descripcion: "MOTOR - SEM6301",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "1.00",
        cod_Producto: "AE.0400",
        descripcion: "MOTOR - TIN8010",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "1.00",
        cod_Producto: "AE.0800",
        descripcion: "TABLERO - TIN8019",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "4.00",
        cod_Producto: "AE.1600",
        descripcion: "CABLE DE ACERO D=8.6mm - 40m",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.1800",
        descripcion: "CABLE DE ACERO D=8.6mm PARA ARRIOSTRE ",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.1900",
        descripcion: "CABLE DE ACERO D=8.6mm PARA TRACCION ",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.2100",
        descripcion: "PIEZA EN U PARA COLGAR CABLE DE ACERO - ABIERTA",
        peso_unitario: 0,
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "6.00",
        cod_Producto: "AE.2300",
        descripcion: 'PIEZA EN "U" PARA TRACCION DE CABLE DE ACERO',
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.2500",
        descripcion: "TENSOR PARA CABLE DE ACERO",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "6.00",
        cod_Producto: "AE.2600",
        descripcion: "GUARDACABOS PARA CABLE DE ACERO D=17mm",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "44.00",
        cod_Producto: "AE.2700",
        descripcion: "GRAPA PARA CABLE DE ACERO",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "6.00",
        cod_Producto: "AE.3200",
        descripcion: "POLEA - D=17mm",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.3300",
        descripcion: "POLEA - PARA MARCO",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.3400",
        descripcion: "RUEDA - PARA MARCO",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.3500",
        descripcion: "POLEA Y RUEDA PARA FRENO DE EMERGENCIA",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.3600",
        descripcion: "MARCO PARA MOTOR - ESTANDAR",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "3.00",
        cod_Producto: "AE.4200",
        descripcion: "PLATAFORMA - 2.00m  P18/ P70/P78",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "3.00",
        cod_Producto: "AE.4500",
        descripcion: "BARANDA ALTA - 2.00m",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "3.00",
        cod_Producto: "AE.4800",
        descripcion: "BARANDA BAJA - 2.00m",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "4.00",
        cod_Producto: "AE.5700",
        descripcion: "GARRUCHA CON FRENO - BLANCA",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.5900",
        descripcion: "GARRUCHA CONTRA MURO - 1G",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "4.00",
        cod_Producto: "AE.6300",
        descripcion: "TUBO CUADRADO - TT",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.6400",
        descripcion: "TUBO CUADRADO - INTERMEDIO",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "4.00",
        cod_Producto: "AE.6600",
        descripcion: "TUBO EN T SIMPLE - BAJA",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.6700",
        descripcion: "TUBO EN T CON POLEA",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.6800",
        descripcion: "SOPORTE PESCANTE ESTANDAR",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.7000",
        descripcion: "SOPORTE CONTRAPESAS ESTANDAR",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "1.00",
        cod_Producto: "AE.7200",
        descripcion: "CABLE ELECTRICO CON GUIA DE CABLE DE ACERO - 100m",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.7500",
        descripcion: "MENNEKE PARA CABLE DE MOTOR",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.7600",
        descripcion: "MENNEKE PARA CABLE ELECTRICO",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "1.00",
        cod_Producto: "AE.7800",
        descripcion: "MANDO A DISTANCIA DE 3P - TIN y TIR",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.7900",
        descripcion: "TOPE DE FIN DE CARRERA",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.8000",
        descripcion: "SWITCH DE FIN DE CARRERA",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.8100",
        descripcion: "SENSOR DE FIN DE CARRERA",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.8200",
        descripcion: "FRENO DE EMERGENCIA - ESTANDAR   F568/ F509",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.8400",
        descripcion: "PALANCA DE FRENO ELECTROMAGNETICO ",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "1.00",
        cod_Producto: "AE.8800",
        descripcion: "DRIZA TEJIDA DE 5/8 - 60m  C:637",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "1.00",
        cod_Producto: "AE.8900",
        descripcion: "DRIZA TEJIDA DE 5/8 - 50m  C:438",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.9500",
        descripcion: "FRENO DE LINEA DE VIDA - 50mm  C:568/ C:569",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.9800",
        descripcion: "PROTECTORES LINEA DE VIDA",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "8.00",
        cod_Producto: "AE.9900",
        descripcion: "PIN + PASADOR DE HENDIDURA SIMPLE - 15 x 60",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "4.00",
        cod_Producto: "AE.10100",
        descripcion: "PERNO HEXAGONAL G.8.8 - M18 x 150  - CON VAINA ",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "2.00",
        cod_Producto: "AE.10200",
        descripcion: "PERNO HEXAGONAL G.8.8 - M16 x 90",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "10.00",
        cod_Producto: "AE.10300",
        descripcion: "PERNO HEXAGONAL G.8.8 - M14 x 150",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "16.00",
        cod_Producto: "AE.10400",
        descripcion: "PERNO HEXAGONAL G.8.8  - M14 x 120",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "16.00",
        cod_Producto: "AE.10600",
        descripcion: "PERNO HEXAGONAL G.8.8 - M12 x 140",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "16.00",
        cod_Producto: "AE.10700",
        descripcion: "PERNO HEXAGONAL G.8.8 - M12 x 130",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "6.00",
        cod_Producto: "AE.10900",
        descripcion: "PERNO HEXAGONAL G.8.8 - M12 x 70",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "4.00",
        cod_Producto: "AE.11100",
        descripcion: "PERNO HEXAGONAL G.8.8 - M10 x 90",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "16.00",
        cod_Producto: "AE.11300",
        descripcion: "PERNO HEXAGONAL G.8.8 - M10 x 25",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "12.00",
        cod_Producto: "AE.11400",
        descripcion: "PERNO HEXAGONAL G.5.8 - M8 x 70",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "36.00",
        cod_Producto: "AE.11500",
        descripcion: "CONTRAPESO DE 25KG",
      },
      {
        index: null,
        unidad: "NIU",
        cantidad: "4.00",
        cod_Producto: "AE.11600",
        descripcion: "CONTRAPESO DE 5KG - CON PERNOS",
      },
    ],

    contrato_Contenido: {
      title: "Servicio de Alquier",
      subtitle: "Contrato de Alquiler",
      descripcion: "<p><b>CP.1</b>: Escaleta de acceso dwjadwabda wkwd wakdh wadh dhawd awdh awkdalwk</p>",
      list:[
        {
          title: "CP.1",
          description: "Escaleta de acceso dwjadwabda wkwd wakdh wadh dhawd awdh awkdalwk"
        },
        {
          title: "CP.2",
          description: "Escaleta de acceso dwjadwabda wkwd wakdh wadh dhawd awdh awkdalwk"
        }
      ]
    },
  },
];

export function PedidosProvider({ children }) {
  const [filiales, setFiliales] = useState([]);
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
