// import cuentaIR from "../../assets/cuentas_IR.png";
// //import cuentaDIMAQ from "../../assets/cuentas_DIMAQ.png";
// //import cuentaANDAMIOS from "../../assets/cuentas_ANDAMIOS.png";

// export default function generarImagenCuentas(doc, filial_id, currentY) {
//   let imagenCuenta = cuentaIR; // Solo hay una por ahora

//   // Cuando tenga más imágenes, puedo agregar esto:
//   /*
//   switch (filial_id) {
//     case 1:
//       imagenCuenta = cuentaIR;
//       break;
//     case 2:
//       imagenCuenta = cuentaDIMAQ;
//       break;
//     case 3:
//       imagenCuenta = cuentaANDAMIOS;
//       break;
//     default:
//       imagenCuenta = cuentaIR;
//   }
//   */

//   const cuentasImg = new Image();
//   cuentasImg.src = imagenCuenta;
//   cuentasImg.onload = () => {
//     doc.addImage(cuentasImg, "PNG", 25, currentY + 2, 145, 45);
//   };
// }

export async function renderImagenCuentas(doc, data, currentY) {
  return new Promise((resolve) => {
    const cuentasImg = new Image();
    const nombreArchivo = data.filial?.nombre_archivo_cuenta || "cuentas_IR"; // Por ahora solo uno

    cuentasImg.src = `/src/modules/cotizaciones/assets/${nombreArchivo}.png`; // Ruta base
    cuentasImg.onload = () => {
      doc.addImage(cuentasImg, "PNG", 25, currentY + 2, 145, 45);
      resolve(currentY + 50); // Ajusta si la imagen es más grande
    };
    cuentasImg.onerror = () => resolve(currentY); // Si falla, sigue sin imagen
  });
}