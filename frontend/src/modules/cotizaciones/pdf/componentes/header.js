import { drawJustifiedText } from "../../../../utils/pdf/drawJustifiedText"


export default function encabezadoCotizacion(doc, data) {
    const lh = 3;
    let currentY = 16;
    let colLeftX = 87;
    let colRightX = 147;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    
     // Columna izquierda
    currentY = drawJustifiedText(doc, "**Ref. cotización:** " + data.cotizacion?.codigo_documento, colLeftX, currentY, 55, 3, 7);
    if (data.obra?.direccion) {
        const texto = "**Dirección obra:** " + data.obra.direccion;
        currentY = drawJustifiedText(doc, texto, colLeftX, currentY, 55, 3, 7);
    }
    if (data.obra?.nombre) {
        const texto = "**Proyecto:** " + data.obra.nombre;
        currentY = drawJustifiedText(doc, texto, colLeftX, currentY, 55, 3, 7 );
    }
    if (data.cotizacion?.fecha) {
        currentY = drawJustifiedText(doc, "**Fecha:** " + data.cotizacion?.fecha, colLeftX, currentY, 55, 3, 7);
    }

    // Columna derecha
    let yRight = 16;
    const cliente = data.cliente || {};
    const contacto = data.contacto || {};

    if (cliente.razon_social) {
        const texto = "**Razón Social:** " + cliente.razon_social;
        yRight = drawJustifiedText(doc, texto, colRightX, yRight, 55, 3, 7);
    }
    if (cliente.ruc) {
        yRight = drawJustifiedText(doc, "**RUC:** " + cliente.ruc, colRightX, yRight, 55, 3, 7);
    }
    if (contacto.nombre) {
        yRight = drawJustifiedText(doc, "**A/A:** " + contacto.nombre, colRightX, yRight, 55, 3, 7);
    }
    if (cliente.domicilio_fiscal) {
        const texto = "**Domicilio Fiscal:** " + cliente.domicilio_fiscal;
        yRight = drawJustifiedText(doc, texto, colRightX, yRight, 55, 3, 7);
    }
    if (contacto.correo) {
        const texto = "**Email:** " + contacto.correo;
        yRight = drawJustifiedText(doc, texto, colRightX, yRight, 55, 3, 7);
    }

  return Math.max(currentY, yRight);
}