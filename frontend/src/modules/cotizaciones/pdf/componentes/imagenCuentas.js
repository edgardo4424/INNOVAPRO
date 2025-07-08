import cuentaIR from "../../assets/cuentas_IR.png";
import cuentaIA from "../../assets/cuentas_IA.png";
import cuentaEI from "../../assets/cuentas_EI.png";
import cuentaAE from "../../assets/cuentas_AE.png";
import { verificarSaltoDePagina } from "./pagina";

export async function renderImagenCuentas(doc, data, currentY) {
   let imagenCuenta;
   switch (data.filial?.razon_social) {
     case "INNOVA RENTAL MAQUINARIA S.A.C":
       imagenCuenta = cuentaIR;
       break;
     case "INDEK ANDINA E.I.R.L":
       imagenCuenta = cuentaIA;
       break;
     case "ENCOFRADOS INNOVA S.A.C.":
       imagenCuenta = cuentaEI;
       break;
     case "ANDAMIOS ELECTRICOS INNOVA S.A.C.":
       imagenCuenta = cuentaAE;
       break;
    default:
       imagenCuenta = cuentaIR;
   }

   const cuentaImg = new Image();
   cuentaImg.src = imagenCuenta; // Ruta de la imagen según la filial

   await new Promise((resolve) => {
    cuentaImg.onload = () => resolve();
    cuentaImg.onerror = () => reject("Error al cargar la imagen de cuentas");
   });

   // 🔁 Validar salto de página antes de insertar la imagen
   currentY = await verificarSaltoDePagina(doc, currentY, data, 30); // 50 = altura de la imagen
   doc.addImage(cuentaImg, "PNG", 25, currentY + 2, 170, 30);
   return currentY + 50; // Ajusta si la imagen es más grande
};