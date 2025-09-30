// Este archivo define los datos iniciales del formulario de cotización
// que se utilizarán en el wizard de registro de cotizaciones.

const formDataInicial = {
  "entidad": {
    "contacto": {
      "id": null,
      "nombre": ""
    },
    "cliente": {
      "id": null,
      "razon_social": ""
    },
    "obra": {
      "id": null,
      "nombre": "",
      "direccion": "",
      "ubicacion": ""
    },
    "filial": {
      "id": null,
      "razon_social": ""
    }
  },
  "uso": {
    "id": null,
    "nombre": "",
    "zonas": [
      {
        "zona": null,
        "nota_zona": "",
        "atributos_formulario": []
      }
    ],
    "despiece": [],
    "resumenDespiece": {}
  },
  "cotizacion": {
    "id": null,
    "tipo": "Alquiler",
    "duracion_alquiler": null,
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