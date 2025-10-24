import { createContext, useContext, useEffect, useState } from "react";
import filialesService from "../../facturacion/service/FilialesService";
import pedidosService from "../service/PedidosService";

const PedidosContenxt = createContext();

export function PedidosProvider({ children }) {
  const [filiales, setFiliales] = useState([]);
  const [pedidos, setPedidos] = useState([
        {
            "contrato_id": 80,
            "pedido_id": 3,
            "cotizacion_id": 77,
            "filial": "ENCOFRADOS INNOVA S.A.C.",
            "estado": "Confirmado",
            "guia_Envio_Cod_Traslado": "13",
            "ubicacion": "Lima",
            "cliente_Tipo_Doc": "06",
            "cliente_Num_Doc": "12345678912",
            "cliente_Razon_Social": "Real Madrid Fc",
            "nombre_Contacto": "zidane",
            "ot_Usuario_Pase": "",
            "ot_Usuario_Revisado": "",
            "ot_Respuesta_Pase": "",
            "cm_Usuario": "Lucas Romero",
            "cm_Email": "lucas@grupoinnova.pe",
            "cm_Telefono": "No disponble",
            "empresaProveedoraId": 1,
            "clienteId": 61,
            "obraId": 58,
            "contactoId": 79,
            "obra": "Bernabeu",
            "nro_contrato": "ae-45",
            "empresa_Ruc": "20562974998",
            "guia_Envio_Peso_Total": 4153.9,
            "guia_Envio_Und_Peso_Total": "KGM",
            "ValoresPublico": {
                "guia_Envio_Cod_Traslado": "13",
                "guia_Envio_Des_Traslado": "ALQUILER",
                "guia_Envio_Mod_Traslado": "01",
                "transportista": {
                    "tipo_Doc": "6",
                    "nro_Doc": "",
                    "razon_Social": "",
                    "nro_mtc": ""
                }
            },
            "ValoresPrivado": null,
            "guia_Envio_Partida_Ubigeo": "",
            "guia_Envio_Partida_Direccion": "San Borja, Perú",
            "guia_Envio_Llegada_Ubigeo": "",
            "guia_Envio_Llegada_Direccion": "AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE",
            "detalle": [
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 8,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 8,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 6,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 12,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 1,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 2,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 2,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 6,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                }
            ]
        },
        {
            "contrato_id": 79,
            "pedido_id": 4,
            "cotizacion_id": 78,
            "filial": "INDEK ANDINA E.I.R.L",
            "estado": "Confirmado",
            "guia_Envio_Cod_Traslado": "13",
            "ubicacion": "Lima",
            "cliente_Tipo_Doc": "06",
            "cliente_Num_Doc": "12345685278",
            "cliente_Razon_Social": "Fc Barcelona",
            "nombre_Contacto": "Deco",
            "ot_Usuario_Pase": "",
            "ot_Usuario_Revisado": "",
            "ot_Respuesta_Pase": "",
            "cm_Usuario": "Lucas Romero",
            "cm_Email": "lucas@grupoinnova.pe",
            "cm_Telefono": "No disponble",
            "empresaProveedoraId": 3,
            "clienteId": 62,
            "obraId": 57,
            "contactoId": 79,
            "obra": "CAMP NOU ",
            "nro_contrato": "ak-89",
            "empresa_Ruc": "20555389052",
            "guia_Envio_Peso_Total": 21874.79,
            "guia_Envio_Und_Peso_Total": "KGM",
            "ValoresPublico": null,
            "ValoresPrivado": {
                "guia_Envio_Cod_Traslado": "02",
                "guia_Envio_Des_Traslado": "VENTA",
                "guia_Envio_Mod_Traslado": "02"
            },
            "guia_Envio_Partida_Ubigeo": "",
            "guia_Envio_Partida_Direccion": "Miraflores, Perú",
            "guia_Envio_Llegada_Ubigeo": "",
            "guia_Envio_Llegada_Direccion": "AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE",
            "detalle": [
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 12,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 16,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 20,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 20,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 6,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 6,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 6,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 6,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 14,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 3,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                },
                {
                    "index": null,
                    "unidad": "UNI",
                    "cantidad": 4,
                    "cod_Producto": "Esperando a que luis lo incluya en la despices_detalles",
                    "descripcion": "Esperando a que luis lo incluya en la despices_detalles"
                }
            ]
        }
    ]);
  // const [pedidos, setPedidos] = useState([]);
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

  const ObtenerPasePedidos = async () => {
    try {
      const { mensaje, pases_pedidos } =
        await pedidosService.obtenerPasePedidos();
      if (pases_pedidos.length === 0) {
        setPedidos([]);
      } else {
        setPedidos(pases_pedidos);
      }
    } catch (error) {}
  };

  useEffect(() => {
    // ObtenerPasePedidos();
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
