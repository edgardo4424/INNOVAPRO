'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('borradores', [
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 1,
        empresa_ruc: "10749283781",
        cliente_num_doc: "74938165248",
        cliente_razon_social: "Cliente A",
        fecha_emision: "2024-09-01",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 2,
        empresa_ruc: "10749283781",
        cliente_num_doc: "85246791302",
        cliente_razon_social: "Cliente B",
        fecha_emision: "2024-09-05",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 3,
        empresa_ruc: "10749283781",
        cliente_num_doc: "96385274103",
        cliente_razon_social: "Cliente C",
        fecha_emision: "2024-09-10",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 4,
        empresa_ruc: "10749283781",
        cliente_num_doc: "12345678901",
        cliente_razon_social: "Cliente D",
        fecha_emision: "2024-09-15",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 5,
        empresa_ruc: "10749283781",
        cliente_num_doc: "23456789012",
        cliente_razon_social: "Cliente E",
        fecha_emision: "2024-09-20",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 6,
        empresa_ruc: "10749283781",
        cliente_num_doc: "34567890123",
        cliente_razon_social: "Cliente F",
        fecha_emision: "2024-09-25",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 7,
        empresa_ruc: "10749283781",
        cliente_num_doc: "45678901234",
        cliente_razon_social: "Cliente G",
        fecha_emision: "2024-09-30",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 8,
        empresa_ruc: "10749283781",
        cliente_num_doc: "56789012345",
        cliente_razon_social: "Cliente H",
        fecha_emision: "2024-10-05",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 9,
        empresa_ruc: "10749283781",
        cliente_num_doc: "67890123456",
        cliente_razon_social: "Cliente I",
        fecha_emision: "2024-10-10",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 10,
        empresa_ruc: "10749283781",
        cliente_num_doc: "78901234567",
        cliente_razon_social: "Cliente J",
        fecha_emision: "2024-10-15",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "boleta",
        serie: "F001",
        correlativo: 11,
        empresa_ruc: "10749283781",
        cliente_num_doc: "89012345678",
        cliente_razon_social: "Cliente K",
        fecha_emision: "2024-10-20",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "boleta",
        serie: "F001",
        correlativo: 12,
        empresa_ruc: "10749283781",
        cliente_num_doc: "90123456789",
        cliente_razon_social: "Cliente L",
        fecha_emision: "2024-10-25",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "boleta",
        serie: "F001",
        correlativo: 13,
        empresa_ruc: "10749283781",
        cliente_num_doc: "01234567890",
        cliente_razon_social: "Cliente M",
        fecha_emision: "2024-10-30",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "boleta",
        serie: "F001",
        correlativo: 14,
        empresa_ruc: "10749283781",
        cliente_num_doc: "12304567891",
        cliente_razon_social: "Cliente N",
        fecha_emision: "2024-11-01",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "boleta",
        serie: "F001",
        correlativo: 15,
        empresa_ruc: "10749283781",
        cliente_num_doc: "23451678902",
        cliente_razon_social: "Cliente Ñ",
        fecha_emision: "2024-11-05",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "boleta",
        serie: "F001",
        correlativo: 16,
        empresa_ruc: "10749283781",
        cliente_num_doc: "34567819013",
        cliente_razon_social: "Cliente O",
        fecha_emision: "2024-11-10",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "boleta",
        serie: "F001",
        correlativo: 17,
        empresa_ruc: "10749283781",
        cliente_num_doc: "45678920124",
        cliente_razon_social: "Cliente P",
        fecha_emision: "2024-11-15",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "boleta",
        serie: "F001",
        correlativo: 18,
        empresa_ruc: "10749283781",
        cliente_num_doc: "56789031235",
        cliente_razon_social: "Cliente Q",
        fecha_emision: "2024-11-20",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 19,
        empresa_ruc: "10749283781",
        cliente_num_doc: "67890142346",
        cliente_razon_social: "Cliente R",
        fecha_emision: "2024-11-25",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 20,
        empresa_ruc: "10749283781",
        cliente_num_doc: "78901253457",
        cliente_razon_social: "Cliente S",
        fecha_emision: "2024-11-30",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 21,
        empresa_ruc: "10749283781",
        cliente_num_doc: "89012364568",
        cliente_razon_social: "Cliente T",
        fecha_emision: "2024-12-05",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 22,
        empresa_ruc: "10749283781",
        cliente_num_doc: "90123475679",
        cliente_razon_social: "Cliente U",
        fecha_emision: "2024-12-10",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 23,
        empresa_ruc: "10749283781",
        cliente_num_doc: "01234586780",
        cliente_razon_social: "Cliente V",
        fecha_emision: "2024-12-15",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 24,
        empresa_ruc: "10749283781",
        cliente_num_doc: "12345697891",
        cliente_razon_social: "Cliente W",
        fecha_emision: "2024-12-20",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 25,
        empresa_ruc: "10749283781",
        cliente_num_doc: "23456708902",
        cliente_razon_social: "Cliente X",
        fecha_emision: "2024-12-25",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 26,
        empresa_ruc: "10749283781",
        cliente_num_doc: "34567819013",
        cliente_razon_social: "Cliente Y",
        fecha_emision: "2024-12-30",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 27,
        empresa_ruc: "10749283781",
        cliente_num_doc: "45678920124",
        cliente_razon_social: "Cliente Z",
        fecha_emision: "2025-01-05",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 28,
        empresa_ruc: "10749283781",
        cliente_num_doc: "56789031235",
        cliente_razon_social: "Cliente AA",
        fecha_emision: "2025-01-10",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 29,
        empresa_ruc: "10749283781",
        cliente_num_doc: "67890142346",
        cliente_razon_social: "Cliente BB",
        fecha_emision: "2025-01-15",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 30,
        empresa_ruc: "10749283781",
        cliente_num_doc: "78901253457",
        cliente_razon_social: "Cliente CC",
        fecha_emision: "2025-01-20",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 31,
        empresa_ruc: "10749283781",
        cliente_num_doc: "89012364568",
        cliente_razon_social: "Cliente DD",
        fecha_emision: "2025-01-25",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 32,
        empresa_ruc: "10749283781",
        cliente_num_doc: "90123475679",
        cliente_razon_social: "Cliente EE",
        fecha_emision: "2025-02-01",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 33,
        empresa_ruc: "10749283781",
        cliente_num_doc: "01234586780",
        cliente_razon_social: "Cliente FF",
        fecha_emision: "2025-02-05",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 34,
        empresa_ruc: "10749283781",
        cliente_num_doc: "12345697891",
        cliente_razon_social: "Cliente GG",
        fecha_emision: "2025-02-10",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 35,
        empresa_ruc: "10749283781",
        cliente_num_doc: "23456708902",
        cliente_razon_social: "Cliente HH",
        fecha_emision: "2025-02-15",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 36,
        empresa_ruc: "10749283781",
        cliente_num_doc: "34567819013",
        cliente_razon_social: "Cliente II",
        fecha_emision: "2025-02-20",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 37,
        empresa_ruc: "10749283781",
        cliente_num_doc: "45678920124",
        cliente_razon_social: "Cliente JJ",
        fecha_emision: "2025-02-25",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 38,
        empresa_ruc: "10749283781",
        cliente_num_doc: "56789031235",
        cliente_razon_social: "Cliente KK",
        fecha_emision: "2025-03-01",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 39,
        empresa_ruc: "10749283781",
        cliente_num_doc: "67890142346",
        cliente_razon_social: "Cliente LL",
        fecha_emision: "2025-03-05",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      },
      {
        tipo_borrador: "factura",
        serie: "F001",
        correlativo: 40,
        empresa_ruc: "10749283781",
        cliente_num_doc: "78901253457",
        cliente_razon_social: "Cliente MM",
        fecha_emision: "2025-03-10",
        body: `{"tipo_Operacion":"0101","tipo_Doc":"01","serie":"F001","correlativo":"1","tipo_Moneda":"PEN","fecha_Emision":"2025-08-15T05:00:00-05:00","empresa_Ruc":"10749283781","cliente_Tipo_Doc":"6","cliente_Num_Doc":"20562974998","cliente_Razon_Social":"ENCOFRADOS INNOVA S.A.C.","cliente_Direccion":"AV. ALFREDO BENAVIDES NRO. 1579 INT. 602 URB. SAN JORGE","monto_Oper_Gravadas":0,"monto_Igv":0,"total_Impuestos":0,"valor_Venta":0,"sub_Total":0,"monto_Imp_Venta":0,"monto_Oper_Exoneradas":0,"estado_Documento":"0","manual":false,"id_Base_Dato":"15265","observaciones":"1221E12","usuario_id":1,"detalle":[],"forma_pago":[],"legend":[{"legend_Code":"1000","legend_Value":""}]}`,
        usuario_id: 1
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('borradores', null, {});
  }
};

