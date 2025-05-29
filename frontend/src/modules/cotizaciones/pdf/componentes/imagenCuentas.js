import cuentaIR from "../../assets/cuentas_IR.png";
import cuentaIA from "../../assets/cuentas_IA.png";

export async function renderImagenCuentas(doc, data, currentY) {
   let imagenCuenta;
   switch (data.filial?.razon_social) {
     case "INNOVA RENTAL MAQUINARIA S.A.C":
       imagenCuenta = cuentaIR;
       break;
     case "INDEK ANDINA E.I.R.L":
       imagenCuenta = cuentaIA;
       break;
    default:
       imagenCuenta = cuentaIR;
   }

   return new Promise((resolve) => {
    const cuentaImg = new Image();
    cuentaImg.src = imagenCuenta; // Ruta de la imagen según la filial
    cuentaImg.onload = () => {
      doc.addImage(cuentaImg, "PNG", 25, currentY + 2, 145, 45);
      resolve(currentY + 50); // Ajusta si la imagen es más grande
    };
    cuentaImg.onerror = () => resolve(currentY); // Si falla, sigue sin imagen
   })
}

// export async function renderImagenCuentas(doc, data, currentY) {
//   return new Promise((resolve) => {
//     const cuentasImg = new Image();
//     const nombreArchivo = data.filial?.nombre_archivo_cuenta || "cuentas_IR"; // Por ahora solo uno

//     cuentasImg.src = `/src/modules/cotizaciones/assets/${nombreArchivo}.png`; // Ruta base
//     cuentasImg.onload = () => {
//       doc.addImage(cuentasImg, "PNG", 25, currentY + 2, 145, 45);
//       resolve(currentY + 50); // Ajusta si la imagen es más grande
//     };
//     cuentasImg.onerror = () => resolve(currentY); // Si falla, sigue sin imagen
//   });
// }