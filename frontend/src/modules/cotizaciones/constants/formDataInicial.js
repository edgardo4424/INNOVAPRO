// Este archivo define los datos iniciales del formulario de cotización
// que se utilizarán en el wizard de registro de cotizaciones.

const formDataInicial = {
  "entidad": {
    "contacto": {
      "id": 95,
      "nombre": "LUIS CAMACHE"
    },
    "cliente": {
      "id": 166,
      "razon_social": "INVERSIONES MULTIPLES LB  S.A.C."
    },
    "obra": {
      "id": 7,
      "nombre": "TORRE ALPHA NUEVA",
      "direccion": "Avenida Primavera, 850, Santiago de Surco",
      "ubicacion": "Lima, 51132, Perú"
    },
    "filial": {
      "id": 1,
      "razon_social": "ENCOFRADOS INNOVA S.A.C."
    }
  },
  "uso": {
    "id": 5,
    "nombre": "PUNTALES",
    "zonas": [
      {
        "zona": 1,
        "nota_zona": "Piso 21",
        "atributos_formulario": [
          {
            "cantidad": "150",
            "tipoPuntal": "3.00 m",
            "tripode": "NO"
          }
        ]
      }
    ],
    "despiece": [
      {
        "pieza_id": 156,
        "item": "PU.0100",
        "descripcion": "PUNTAL 3.00m",
        "total": 150,
        "peso_u_kg": 8.9,
        "peso_kg": 1335,
        "precio_u_venta_dolares": 48.65,
        "precio_venta_dolares": 7297.5,
        "precio_u_venta_soles": 180,
        "precio_venta_soles": 27000,
        "precio_u_alquiler_soles": 4.5,
        "precio_alquiler_soles": 675,
        "stock_actual": 3,
        "esPerno": false
      },
      {
        "pieza_id": 163,
        "item": "PU.0700",
        "descripcion": "PIN PRESION - 11mm",
        "total": 150,
        "peso_u_kg": 0.1,
        "peso_kg": 15,
        "precio_u_venta_dolares": 8.11,
        "precio_venta_dolares": 1216.5,
        "precio_u_venta_soles": 30,
        "precio_venta_soles": 4500,
        "precio_u_alquiler_soles": 0,
        "precio_alquiler_soles": 0,
        "stock_actual": 941,
        "esPerno": false
      },
      {
        "pieza_id": 165,
        "item": "PU.0900",
        "descripcion": "ARGOLLA - 48/40mm",
        "total": 150,
        "peso_u_kg": 0.1,
        "peso_kg": 15,
        "precio_u_venta_dolares": 8.11,
        "precio_venta_dolares": 1216.5,
        "precio_u_venta_soles": 30,
        "precio_venta_soles": 4500,
        "precio_u_alquiler_soles": 0,
        "precio_alquiler_soles": 0,
        "stock_actual": 1349,
        "esPerno": false
      }
    ],
    "resumenDespiece": {
      "total_piezas": 450,
      "peso_total_kg": 1365,
      "peso_total_ton": "1.36",
      "precio_subtotal_venta_soles": "36000.00",
      "precio_subtotal_venta_dolares": "9730.50",
      "precio_subtotal_alquiler_soles": "675.00"
    }
  },
  "cotizacion": {
    "id": "",
    "tipo": "Alquiler",
    "duracion_alquiler": 30,
    "descuento": 0,
    "requiereAprobacion": false
  },
  "atributos_opcionales": {
    "transporte": {
      "tiene_transporte": "",
      "tipo_transporte": "",
      "costo_tarifas_transporte": 0,
      "costo_distrito_transporte": 0,
      "costo_pernocte_transporte": 0
    },
    "instalacion": {
      "tipo_instalacion": "",
      "precio_instalacion_completa": 0,
      "precio_instalacion_parcial": 0,
      "nota_instalacion": ""
    },
    "pernos": {
      "tiene_pernos_disponibles": false
    }
  }
}

export default formDataInicial;