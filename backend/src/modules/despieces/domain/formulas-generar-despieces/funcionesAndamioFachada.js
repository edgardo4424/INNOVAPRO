// AM.0100 – Husillo de nivelación: Calcula la cantidad de husillos según el tipo de servicio y número de andamios
function calcularHusilloNivelacion({
   tipoServicio,
   longitud,
   cantidadAndamios,
}) {
   if (tipoServicio === "VOLADO") {
      return 0;
   }
   if (longitud > 0 && cantidadAndamios === 0) {
      return 4;
   }
   if (longitud > 0 && cantidadAndamios > 0) {
      return 2;
   }
   return 0;
}
// AM.0300 – Pieza de inicio: suma el valor de F21 más el doble de F23
function calcularPiezaInicio(valorHusilloNivelacion, valorPerfilMetalico) {
   return valorHusilloNivelacion + valorPerfilMetalico * 2;
}

// AM.0400 – Perfil metálico UPN de 3.00 m: según tipo de servicio, longitud y número de andamios
function calcularPerfilMetalicoUPN({
   tipoServicio,
   longitud,
   cantidadAndamios,
}) {
   if (tipoServicio === "VOLADO") {
      if (longitud > 0 && cantidadAndamios === 0) {
         return 2;
      } else if (longitud > 0 && cantidadAndamios > 0) {
         return 1;
      }
   }
   return 0;
}

function calcularMarcoCombi200({ ancho, tipoVerticales, alturaAndamio }, f22) {
   // Si el ancho es 1020 o 1090 y el tipo es COMBI, no aplica
   if ((ancho === 1020 || ancho === 1090) && tipoVerticales === "COMBI") {
      return "ERROR";
   }
   // Solo para COMBI: calcula según altura par o impar
   if (tipoVerticales === "COMBI") {
      return alturaAndamio % 2 === 0
         ? f22 * alturaAndamio * 0.25
         : f22 * (alturaAndamio - 1) * 0.25;
   }
   return 0;
}

// AM.0700 – Vertical 2.00 m: calcula solo para MULTI, usa longitud, cantidad de andamios y altura
function calcularVertical200({
   tipoVerticales,
   longitud,
   cantidadAndamios,
   alturaAndamio,
}) {
   if (tipoVerticales === "MULTI") {
      if (longitud > 0 && cantidadAndamios === 0) {
         return alturaAndamio % 2 === 0
            ? alturaAndamio * 2
            : (alturaAndamio + 1) * 2;
      }
      if (longitud > 0 && cantidadAndamios > 0) {
         return alturaAndamio;
      }
   }
   return 0;
}

function calcularVertical150() {
   return 0;
}

function calcularVertical100({
   longitud,
   cantidadAndamios,
   alturaAndamio,
   tipoVerticales,
}) {
   const esPar = (x) => x % 2 === 0;
   if (alturaAndamio == null || alturaAndamio === "") {
      return 0;
   }
   if (longitud > 0 && cantidadAndamios === 0) {
      if (esPar(alturaAndamio)) {
         return 4;
      } else if (tipoVerticales === "COMBI" && !esPar(alturaAndamio)) {
         return 8;
      }
      return 0;
   }
   if (longitud > 0 && cantidadAndamios > 0) {
      if (tipoVerticales === "MULTI") {
         return 1;
      } else if (!esPar(alturaAndamio)) {
         return 3;
      }
      return 1;
   }
   return 0;
}

function calcularVertical050() {
   return 0;
}

function calcularEspiga(f24, f25, f26, f27, f28, f42, f43, f44, f97) {
   // console.log("f24", f24);
   // console.log("f25", f25);
   // console.log("f26", f26);
   // console.log("f27", f27);
   // console.log("f28", f28);
   // console.log("f42", f42);
   // console.log("f43", f43);
   // console.log("f44", f44);
   // console.log("f97", f97);

   return f24 * 2 + f25 + f26 + f27 + f28 + f42 + f43 + f44 + f97;
}

// AM.1300 – Horizontal Multi de 3072 mm: calcula según longitud, ubicación, servicio, altura y barandilla
function calcularHorizontalMulti3072({
   longitud,
   ubicacionProyecto,
   tipoServicio,
   alturaAndamio,
   barandilla3072_2072,
}) {
   const esPar = (x) => x % 2 === 0;
   const b30 = 3072;
   const longitudesInvalidas = [2572, 1572, 1090, 1020, 732];

   // Error si hay barandilla en longitudes específicas
   if (longitudesInvalidas.includes(longitud) && barandilla3072_2072) {
      return "ERROR";
   }

   // Caso longitud igual a la de referencia (b30)
   if (longitud === b30) {
      if (ubicacionProyecto === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return esPar(alturaAndamio)
               ? 1.5 * alturaAndamio + 3
               : 1.5 * alturaAndamio + 3.5;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA1";
            }
            return esPar(alturaAndamio) ? 1.5 * alturaAndamio + 4 : "NE/NA2";
         }
      } else {
         // Ubicación distinta de Lima
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return 2 * alturaAndamio + 2;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA3";
            }
            return esPar(alturaAndamio) ? 2 * alturaAndamio + 4 : "NE/NA4";
         }
      }
   }
}

// AM.1400
function calcularHorizontalMulti2572({
   longitud,
   ubicacionProyecto,
   tipoServicio,
   alturaAndamio,
   barandilla3072_2072,
}) {
   const b31 = 2572; // B31
   // misma lógica que AM.1300, cambiando sólo el valor de referencia
   const longitudesInvalidas = [2572, 1572, 1090, 1020, 732];
   const esPar = (x) => x % 2 === 0;
   if (longitudesInvalidas.includes(longitud) && barandilla3072_2072)
      return "ERROR";

   if (longitud === b31) {
      if (ubicacionProyecto === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return esPar(alturaAndamio)
               ? 1.5 * alturaAndamio + 3
               : 1.5 * alturaAndamio + 3.5;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA1";
            }
            return esPar(alturaAndamio) ? 1.5 * alturaAndamio + 4 : "NE/NA2";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return 2 * alturaAndamio + 2;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA3";
            }
            return esPar(alturaAndamio) ? 2 * alturaAndamio + 4 : "NE/NA4";
         }
      }
   }
}

// AM.1500

function calcularHorizontalMulti2072({
   longitud,
   ubicacionProyecto,
   tipoServicio,
   alturaAndamio,
   barandilla3072_2072,
}) {
   const b32 = 2072; // B32
   const longitudesInvalidas = [2572, 1572, 1090, 1020, 732];
   const esPar = (x) => x % 2 === 0;
   if (longitudesInvalidas.includes(longitud) && barandilla3072_2072)
      return "ERROR";

   if (longitud === b32) {
      if (ubicacionProyecto === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return esPar(alturaAndamio)
               ? 1.5 * alturaAndamio + 3
               : 1.5 * alturaAndamio + 3.5;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA1";
            }
            return esPar(alturaAndamio) ? 1.5 * alturaAndamio + 4 : "NE/NA2";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return 2 * alturaAndamio + 2;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA3";
            }
            return esPar(alturaAndamio) ? 2 * alturaAndamio + 4 : "NE/NA4";
         }
      }
   }
}

// AM.1600
function calcularHorizontalMulti1572({
   longitud,
   ubicacionProyecto,
   tipoServicio,
   alturaAndamio,
   barandilla3072_2072,
}) {
   const b33 = 1572; // B33
   const longitudesInvalidas = [2572, 1572, 1090, 1020, 732];
   const esPar = (x) => x % 2 === 0;
   if (longitudesInvalidas.includes(longitud) && barandilla3072_2072)
      return "ERROR";

   if (longitud === b33) {
      if (ubicacionProyecto === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return esPar(alturaAndamio)
               ? 1.5 * alturaAndamio + 3
               : 1.5 * alturaAndamio + 3.5;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA1";
            }
            return esPar(alturaAndamio) ? 1.5 * alturaAndamio + 4 : "NE/NA2";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return 2 * alturaAndamio + 2;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA3";
            }
            return esPar(alturaAndamio) ? 2 * alturaAndamio + 4 : "NE/NA4";
         }
      }
   }
}

// AM.1800
function calcularHorizontalMulti1090(params) {
   const {
      longitud, // F5
      ancho, // F6
      ubicacionProyecto, // F4
      tipoServicio, // F9
      tipoVerticales, // F10
      alturaAndamio, // F7
      barandilla3072_2072, // F11 (booleano)
      cantidadAndamios, // E5
   } = params;

   const B34 = 1090;
   const invalidLongitudes = [2572, 1572, 1090, 1020, 732];
   const isEven = (x) => x % 2 === 0;

   // ——— PARTE 1 ———
   // Error si longitud inválida + barandilla
   if (invalidLongitudes.includes(longitud) && barandilla3072_2072) {
      return "ERROR";
   }

   let part1 = 0;
   if (longitud === B34) {
      if (ubicacionProyecto === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               part1 = isEven(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            } else {
               part1 = isEven(alturaAndamio)
                  ? 1.5 * alturaAndamio + 3
                  : 1.5 * alturaAndamio + 3.5;
            }
         } else {
            if (barandilla3072_2072) {
               part1 = isEven(alturaAndamio) ? alturaAndamio + 2 : "NE/NA1";
            } else {
               part1 = isEven(alturaAndamio)
                  ? 1.5 * alturaAndamio + 4
                  : "NE/NA2";
            }
         }
      } else {
         // fuera de LIMA
         if (tipoServicio === "NORMAL") {
            part1 = barandilla3072_2072
               ? isEven(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3
               : 2 * alturaAndamio + 2;
         } else {
            part1 = barandilla3072_2072
               ? isEven(alturaAndamio)
                  ? alturaAndamio + 2
                  : "NE/NA3"
               : isEven(alturaAndamio)
               ? 2 * alturaAndamio + 4
               : "NE/NA4";
         }
      }
   }

   // Si la parte 1 devolvió texto de error o NE/NA, propagamos
   if (
      part1 === "ERROR" ||
      (typeof part1 === "string" && part1.startsWith("NE/NA"))
   ) {
      return part1;
   }

   // ——— PARTE 2 ———
   // Error si ancho 1090/1020 + VOLADO o COMBI
   if (
      ([1090, 1020].includes(ancho) && tipoServicio === "VOLADO") ||
      ([1090, 1020].includes(ancho) && tipoVerticales === "COMBI")
   ) {
      return "ERROR";
   }

   let part2 = 0;
   if (ancho === B34) {
      if (tipoVerticales === "MULTI") {
         if (tipoServicio === "NORMAL") {
            if (longitud > 0 && cantidadAndamios > 0) {
               part2 = isEven(alturaAndamio)
                  ? 0.5 * alturaAndamio + 1
                  : 0.5 * alturaAndamio + 1.5;
            } else {
               part2 = isEven(alturaAndamio)
                  ? 3 * alturaAndamio + 2
                  : 3 * alturaAndamio + 3;
            }
         } else {
            if (longitud > 0 && cantidadAndamios > 0) {
               part2 = isEven(alturaAndamio)
                  ? 0.5 * alturaAndamio + 1
                  : "NE/NA";
            } else {
               part2 = isEven(alturaAndamio) ? 3 * alturaAndamio + 6 : "NE/NA";
            }
         }
      } else {
         // tipoVerticales ≠ MULTI
         if (tipoServicio === "NORMAL") {
            if (longitud > 0 && cantidadAndamios > 0) {
               part2 = isEven(alturaAndamio) ? 1 : 2;
            } else {
               part2 = isEven(alturaAndamio)
                  ? 2 * alturaAndamio + 2
                  : 4 * alturaAndamio - 4;
            }
         } else {
            if (longitud > 0 && cantidadAndamios > 0) {
               part2 = isEven(alturaAndamio) ? 1 : "NE/NA";
            } else {
               part2 = isEven(alturaAndamio) ? 2 * alturaAndamio + 6 : "NE/NA";
            }
         }
      }
   }

   if (
      part2 === "ERROR" ||
      (typeof part2 === "string" && part2.startsWith("NE/NA"))
   ) {
      return part2;
   }

   // ——— Resultado final: suma de ambas partes ———
   return part1 + part2;
}

// AM.1900 – Horizontal Multi de 1020 mm
function calcularHorizontalMulti1020({
   longitud,
   ancho,
   ubicacionProyecto,
   tipoServicio,
   tipoVerticales,
   alturaAndamio,
   barandilla3072_2072,
   cantidadAndamios,
}) {
   const b35 = 1020; // B35
   const valoresInvalidos = [2572, 1572, 1090, 1020, 732];
   const esPar = (x) => x % 2 === 0;

   // Primera parte
   if (valoresInvalidos.includes(longitud) && barandilla3072_2072) {
      return "ERROR";
   }
   if (longitud === b35) {
      if (ubicacionProyecto === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return esPar(alturaAndamio)
               ? 1.5 * alturaAndamio + 3
               : 1.5 * alturaAndamio + 3.5;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA1";
            }
            return esPar(alturaAndamio) ? 1.5 * alturaAndamio + 4 : "NE/NA2";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            }
            return 2 * alturaAndamio + 2;
         } else {
            if (barandilla3072_2072) {
               return esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA3";
            }
            return esPar(alturaAndamio) ? 2 * alturaAndamio + 4 : "NE/NA4";
         }
      }
   }

   // Segunda parte
   if (
      ([1090, 1020].includes(ancho) && tipoServicio === "VOLADO") ||
      ([1090, 1020].includes(ancho) && tipoVerticales === "COMBI")
   ) {
      return "ERROR";
   }
   if (ancho === b35) {
      if (tipoVerticales === "MULTI") {
         if (tipoServicio === "NORMAL") {
            if (longitud > 0 && cantidadAndamios > 0) {
               return esPar(alturaAndamio)
                  ? 0.5 * alturaAndamio + 1
                  : 0.5 * alturaAndamio + 1.5;
            }
            return esPar(alturaAndamio)
               ? 3 * alturaAndamio + 2
               : 3 * alturaAndamio + 3;
         } else {
            if (longitud > 0 && cantidadAndamios > 0) {
               return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NE/NA";
            }
            return esPar(alturaAndamio) ? 3 * alturaAndamio + 6 : "NE/NA";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (longitud > 0 && cantidadAndamios > 0) {
               return esPar(alturaAndamio) ? 1 : 2;
            }
            return esPar(alturaAndamio)
               ? 2 * alturaAndamio + 2
               : 4 * alturaAndamio - 4;
         } else {
            if (longitud > 0 && cantidadAndamios > 0) {
               return esPar(alturaAndamio) ? 1 : "NE/NA";
            }
            return esPar(alturaAndamio) ? 2 * alturaAndamio + 6 : "NE/NA";
         }
      }
   }

   return 0;
}

function calcularHorizontalMulti0732(
   {
      longitud, // F5
      ubicacionProyecto, // F4
      tipoServicio, // F9
      alturaAndamio, // F7
      barandilla3072_2072, // F11
      ancho, // F6
      tipoVerticales, // F10
      cantidadAndamios, // E5 (no está en la tabla F)
   },
   f41 // F41 (no está en la tabla)
) {
   const b36 = 732;
   const invalidLongitudes = [2572, 1572, 1090, 1020, 732];
   const esPar = (x) => x % 2 === 0;

   // Primera parte del IF principal
   if (invalidLongitudes.includes(longitud) && barandilla3072_2072) {
      return "ERROR";
   }
   let resultado1 = 0;
   if (longitud === b36) {
      if (ubicacionProyecto === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               resultado1 = esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            } else {
               resultado1 = esPar(alturaAndamio)
                  ? 1.5 * alturaAndamio + 3
                  : 1.5 * alturaAndamio + 3.5;
            }
         } else {
            if (barandilla3072_2072) {
               resultado1 = esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA1";
            } else {
               resultado1 = esPar(alturaAndamio)
                  ? 1.5 * alturaAndamio + 4
                  : "NE/NA2";
            }
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandilla3072_2072) {
               resultado1 = esPar(alturaAndamio)
                  ? alturaAndamio + 2
                  : alturaAndamio + 3;
            } else {
               resultado1 = 2 * alturaAndamio + 2;
            }
         } else {
            if (barandilla3072_2072) {
               resultado1 = esPar(alturaAndamio) ? alturaAndamio + 2 : "NE/NA3";
            } else {
               resultado1 = esPar(alturaAndamio)
                  ? 2 * alturaAndamio + 4
                  : "NE/NA4";
            }
         }
      }
   }

   // Segunda parte sumada del IF
   if (
      ([1090, 1020].includes(ancho) && tipoServicio === "VOLADO") ||
      ([1090, 1020].includes(ancho) && tipoVerticales === "COMBI")
   ) {
      return "ERROR";
   }
   let resultado2 = 0;
   if (ancho === b36) {
      if (tipoVerticales === "MULTI") {
         if (tipoServicio === "NORMAL") {
            if (longitud > 0 && cantidadAndamios > 0) {
               resultado2 = esPar(alturaAndamio)
                  ? 0.5 * alturaAndamio + 1
                  : 0.5 * alturaAndamio + 1.5;
            } else {
               resultado2 = esPar(alturaAndamio)
                  ? 3 * alturaAndamio + 2
                  : 3 * alturaAndamio + 3;
            }
         } else {
            if (longitud > 0 && cantidadAndamios > 0) {
               resultado2 = esPar(alturaAndamio)
                  ? 0.5 * alturaAndamio + 1
                  : "NE/NA";
            } else {
               resultado2 = esPar(alturaAndamio)
                  ? 3 * alturaAndamio + 6
                  : "NE/NA";
            }
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (longitud > 0 && cantidadAndamios > 0) {
               resultado2 = esPar(alturaAndamio) ? 1 : 2;
            } else {
               resultado2 = esPar(alturaAndamio)
                  ? 2 * alturaAndamio + 2
                  : 4 * alturaAndamio - 4;
            }
         } else {
            if (longitud > 0 && cantidadAndamios > 0) {
               resultado2 = esPar(alturaAndamio) ? 1 : "NE/NA";
            } else {
               resultado2 = esPar(alturaAndamio)
                  ? 2 * alturaAndamio + 6
                  : "NE/NA";
            }
         }
      }
   }

   // Si cualquiera de los resultados es texto, lo devolvemos directamente
   if (typeof resultado1 !== "number") return resultado1;
   if (typeof resultado2 !== "number") return resultado2;

   // Resultado final: suma de ambas partes menos 2 * F41
   return resultado1 + resultado2 - 2 * f41;
}

function calcularHorizontalMulti432MensulaN() {
   return 0;
}

function calcularHorizontalMulti432MensulaE() {
   return 0;
}

// 19. AM.2800 – Barandillas Combi 3072 mm: según longitud, barandilla y servicio
function calcularBarandillasCombi3072({
   longitud, // F5
   tipoServicio, // F9
   alturaAndamio, // F7
   barandilla3072_2072, // F11
}) {
   const b39 = 3072;
   const invalidLengths = [2572, 1572, 1500, 1090, 1020];
   const esPar = (x) => x % 2 === 0;

   if (barandilla3072_2072 && invalidLengths.includes(longitud)) {
      return "ERROR";
   }
   if (longitud === b39 && barandilla3072_2072) {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio - 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

// 20. AM.2900 – Barandillas Combi 2072 mm: según longitud, barandilla y servicio
function calcularBarandillasCombi2072({
   longitud, // F5
   tipoServicio, // F9
   alturaAndamio, // F7
   barandilla3072_2072, // F11
}) {
   const b40 = 2072;
   const invalidLengths = [2572, 1572, 1500, 1090, 1020];
   const esPar = (x) => x % 2 === 0;

   if (barandilla3072_2072 && invalidLengths.includes(longitud)) {
      return "ERROR";
   }
   if (longitud === b40 && barandilla3072_2072) {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio - 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

//AM.3000	BARANDILLAS COMBI 0732mm
function calcularBarandillasCombi0732({
   ancho, // F6
   barandilla732, // F12
   longitud, // F5
   tipoServicio, // F9
   alturaAndamio, // F7
   cantidadAndamios, // E5
}) {
   const esPar = (x) => x % 2 === 0;

   // Error si hay barandilla y ancho prohibido
   if (barandilla732 && (ancho === 1090 || ancho === 1020)) {
      return "ERROR";
   }

   // Solo cuando ancho=732 y hay barandilla
   if (ancho === 732 && barandilla732) {
      // Normal
      if (tipoServicio === "NORMAL") {
         // si hay andamios y longitud > 0 → 0
         if (longitud > 0 && cantidadAndamios > 0) {
            return 0;
         }
         // altura par → altura, impar → altura-1
         return esPar(alturaAndamio) ? alturaAndamio : alturaAndamio - 1;
      }
      // No-normal
      if (longitud > 0 && cantidadAndamios > 0) {
         return 0;
      }
      return esPar(alturaAndamio) ? alturaAndamio + 2 : "NA/NE";
   }

   return 0;
}
// AM.3100 – Ménsula 1090 mm: sin fórmula, retorna siempre 0
function calcularMensula1090() {
   return 0;
}
// AM.3200 – Ménsula 700 mm: sin fórmula, retorna siempre 0
function calcularMensula700() {
   return 0;
}
// AM.3300 – Ménsula 300 mm: sin fórmula, retorna siempre 0
function calcularMensula300() {
   return 0;
}

// AM.3400 – Rodapié 3072 mm - E: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie3072E({
   longitud, // F5
   tipoRodapie, // F16
   tipoServicio, // F9
   alturaAndamio, // F7
}) {
   const b45 = 3072;
   const esPar = (x) => x % 2 === 0;

   // Casos de error según longitud y tipo de rodapié
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }

   // Solo cuando es rodapié ESP y longitud=3072
   if (longitud === b45 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }

   return 0;
}

function calcularRodapie2572E({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b46 = 2572;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   if (longitud === b46 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

function calcularRodapie2072E({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b47 = 2072;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   if (longitud === b47 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

function calcularRodapie1020E({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
   cantidadAndamios,
}) {
   const b48 = 1020;
   const esPar = (x) => x % 2 === 0;

   // Parte 1: por longitud
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res1 = 0;
   if (longitud === b48 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         res1 = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         res1 = esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
      }
   }

   // Parte 2: por ancho
   if (
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res2 = 0;
   if (ancho === b48 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         res2 =
            longitud > 0 && cantidadAndamios > 0
               ? 0
               : esPar(alturaAndamio)
               ? alturaAndamio
               : alturaAndamio - 1;
      } else {
         res2 =
            longitud > 0 && cantidadAndamios > 0
               ? 0
               : esPar(alturaAndamio)
               ? alturaAndamio + 2
               : "NA/NE";
      }
   }

   if (typeof res1 !== "number") return res1;
   if (typeof res2 !== "number") return res2;
   return res1 + res2;
}

// AM.3800 – Rodapié 0732 mm - E: combina longitud y ancho de rodapié
function calcularRodapie0732E({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
   cantidadAndamios,
}) {
   const b49 = 732;
   const esPar = (x) => x % 2 === 0;

   // Parte 1: por longitud
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res1 = 0;
   if (longitud === b49 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         res1 = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         res1 = esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
      }
   }

   // Parte 2: por ancho
   if (
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res2 = 0;
   if (ancho === b49 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         res2 =
            longitud > 0 && cantidadAndamios > 0
               ? 0
               : esPar(alturaAndamio)
               ? alturaAndamio
               : alturaAndamio - 1;
      } else {
         res2 =
            longitud > 0 && cantidadAndamios > 0
               ? 0
               : esPar(alturaAndamio)
               ? alturaAndamio + 2
               : "NA/NE";
      }
   }

   if (typeof res1 !== "number") return res1;
   if (typeof res2 !== "number") return res2;
   return res1 + res2;
}

// AM.3900 – Rodapié 3072 mm - C: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie3072C({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b50 = 3072;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   if (longitud === b50 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

// AM.4000 – Rodapié 2572 mm - C: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie2572C({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b51 = 2572;
   const esPar = (x) => x % 2 === 0;

   // Casos de error
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }

   // Solo cuando longitud = 2572 y tipoRodapie = CHI
   if (longitud === b51 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }

   return 0;
}

// AM.4100 – Rodapié 2072 mm - C: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie2072C({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b52 = 2072;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }

   if (longitud === b52 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }

   return 0;
}

// AM.4200 – Rodapié 1572 mm - C: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie1572C({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b53 = 1572;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }

   if (longitud === b53 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }

   return 0;
}
// AM.4300 – Rodapié 1090 mm - C: combina longitud y ancho de rodapié, servicio y altura
function calcularRodapie1090C({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
   cantidadAndamios,
}) {
   const b54 = 1090;
   const esPar = (x) => x % 2 === 0;

   // Parte 1: por longitud
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res1 = 0;
   if (longitud === b54 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         res1 = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         res1 = esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
      }
   }

   // Parte 2: por ancho
   if (
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res2 = 0;
   if (ancho === b54 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         if (longitud > 0 && cantidadAndamios > 0) {
            res2 = 0;
         } else {
            res2 = esPar(alturaAndamio) ? alturaAndamio : alturaAndamio - 1;
         }
      } else {
         if (longitud > 0 && cantidadAndamios > 0) {
            res2 = 0;
         } else {
            res2 = esPar(alturaAndamio) ? alturaAndamio + 2 : "NA/NE";
         }
      }
   }

   if (typeof res1 !== "number") return res1;
   if (typeof res2 !== "number") return res2;
   return res1 + res2;
}

// AM.4400 – Rodapié 0732 mm - C: combina longitud y ancho de rodapié, servicio y altura
function calcularRodapie0732C({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
   cantidadAndamios,
}) {
   const b55 = 732;
   const esPar = (x) => x % 2 === 0;

   // Parte 1: por longitud
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res1 = 0;
   if (longitud === b55 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         res1 = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         res1 = esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
      }
   }

   // Parte 2: por ancho
   if (
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res2 = 0;
   if (ancho === b55 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         if (longitud > 0 && cantidadAndamios > 0) {
            res2 = 0;
         } else {
            res2 = esPar(alturaAndamio) ? alturaAndamio : alturaAndamio - 1;
         }
      } else {
         if (longitud > 0 && cantidadAndamios > 0) {
            res2 = 0;
         } else {
            res2 = esPar(alturaAndamio) ? alturaAndamio + 2 : "NA/NE";
         }
      }
   }

   if (typeof res1 !== "number") return res1;
   if (typeof res2 !== "number") return res2;
   return res1 + res2;
}

// AM.4500 – Rodapié 3072 mm - N: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie3072N({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b56 = 3072;
   const esPar = (x) => x % 2 === 0;

   // Casos de error por combinación inválida
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }

   // Sólo si longitud = 3072 y tipoRodapié = NEO
   if (longitud === b56 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }

   return 0;
}

// AM.4600 – Rodapié 2572 mm - N: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie2572N({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b57 = 2572;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   if (longitud === b57 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

// AM.4700 – Rodapié 2072 mm - N: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie2072N({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b58 = 2072;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   if (longitud === b58 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

// AM.4800 – Rodapié 1572 mm - N: según longitud, tipo de rodapié, servicio y altura
function calcularRodapie1572N({
   longitud,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
}) {
   const b59 = 1572;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   if (longitud === b59 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

// AM.4900 – Rodapié 1090 mm - N: combina longitud y ancho de rodapié, servicio, altura y cantidad de andamios
function calcularRodapie1090N({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
   cantidadAndamios,
}) {
   const b60 = 1090;
   const esPar = (x) => x % 2 === 0;

   // ——— Validación ERROR (longitud) ———
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }

   let res1 = 0;
   if (longitud === b60 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         // aquí sí aplicamos la mitad de la altura, como en Excel
         if (esPar(alturaAndamio)) {
            res1 = alturaAndamio / 2;
         } else {
            res1 = alturaAndamio / 2 + 0.5;
         }
      } else {
         // rama “NO NORMAL” según Excel: mitad +1 para par, NA/NE para impar
         if (esPar(alturaAndamio)) {
            res1 = alturaAndamio / 2 + 1;
         } else {
            res1 = "NA/NE";
         }
      }
   }

   // ——— Validación ERROR (ancho) ———
   if (
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }

   let res2 = 0;
   if (ancho === b60 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         // aquí mantenemos el chequeo de longitud>0 && cantidadAndamios>0,
         // que en Excel estaba en la rama de ancho
         if (longitud > 0 && cantidadAndamios > 0) {
            res2 = 0;
         } else {
            res2 = esPar(alturaAndamio) ? alturaAndamio : alturaAndamio - 1;
         }
      } else {
         if (longitud > 0 && cantidadAndamios > 0) {
            res2 = 0;
         } else {
            res2 = esPar(alturaAndamio) ? alturaAndamio + 2 : "NA/NE";
         }
      }
   }

   // si alguno devolvió cadena (ERROR o “NA/NE”), cortamos
   if (typeof res1 !== "number") return res1;
   if (typeof res2 !== "number") return res2;

   return res1 + res2;
}

// AM.5000 – Rodapié 0732 mm - N: según longitud, ancho, tipo de rodapié, servicio, altura y cantidad de andamios
function calcularRodapie0732N({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   alturaAndamio,
   cantidadAndamios,
}) {
   const b61 = 732;
   const esPar = (x) => x % 2 === 0;

   // Parte 1: condición por longitud
   if (
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res1 = 0;
   if (longitud === b61 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         res1 = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         res1 = esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
      }
   }

   // Parte 2: condición por ancho
   if (
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && (tipoRodapie === "CHI" || tipoRodapie === "NEO"))
   ) {
      return "ERROR";
   }
   let res2 = 0;
   if (ancho === b61 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         if (longitud > 0 && cantidadAndamios > 0) {
            res2 = 0;
         } else {
            res2 = esPar(alturaAndamio) ? alturaAndamio : alturaAndamio - 1;
         }
      } else {
         if (longitud > 0 && cantidadAndamios > 0) {
            res2 = 0;
         } else {
            res2 = esPar(alturaAndamio) ? alturaAndamio + 2 : "NA/NE";
         }
      }
   }

   // Devolver texto inmediatamente si alguna parte retorna texto
   if (typeof res1 !== "number") return res1;
   if (typeof res2 !== "number") return res2;
   return res1 + res2;
}

// AM.5100 – Diagonal de 3072 mm: calcula si hay diagonales y la longitud coincide
function calcularDiagonal3072({
   longitud,
   diagonales,
   tipoServicio,
   alturaAndamio,
}) {
   const b62 = 3072;
   const esPar = (x) => x % 2 === 0;

   if (diagonales && longitud === b62) {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         return esPar(alturaAndamio) ? 0.5 * alturaAndamio : "NA/NE";
      }
   }
   return 0;
}

// AM.5200 – Diagonal de 2572 mm

function calcularDiagonal2572({
   longitud,
   diagonales,
   tipoServicio,
   alturaAndamio,
}) {
   const b63 = 2572;
   const esPar = (x) => x % 2 === 0;

   if (diagonales && longitud === b63) {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         return esPar(alturaAndamio) ? 0.5 * alturaAndamio : "NA/NE";
      }
   }
   return 0;
}
// AM.5200 – Diagonal de 2572 mm
function calcularDiagonal2072({
   longitud,
   diagonales,
   tipoServicio,
   alturaAndamio,
}) {
   const b64 = 2072;
   const esPar = (x) => x % 2 === 0;

   if (diagonales && longitud === b64) {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         return esPar(alturaAndamio) ? 0.5 * alturaAndamio : "NA/NE";
      }
   }
   return 0;
}

// AM.5400 – Diagonal de 1572 mm
function calcularDiagonal1572({
   longitud,
   diagonales,
   tipoServicio,
   alturaAndamio,
}) {
   const b65 = 1572;
   const esPar = (x) => x % 2 === 0;

   if (diagonales && longitud === b65) {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         return esPar(alturaAndamio) ? 0.5 * alturaAndamio : "NA/NE";
      }
   }
   return 0;
}
// AM.5500 – Diagonal de 1090 mm: calcula si hay diagonales y la longitud coincide
function calcularDiagonal1090({
   diagonales,
   longitud,
   tipoServicio,
   alturaAndamio,
}) {
   const b66 = 1090;
   const esPar = (x) => x % 2 === 0;

   if (diagonales && longitud === b66) {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio : "NA/NE";
   }
   return 0;
}
// AM.5600 – Diagonal de 1020 mm: calcula si hay diagonales y la longitud coincide
function calcularDiagonal1020({
   diagonales,
   longitud,
   tipoServicio,
   alturaAndamio,
}) {
   const b67 = 1020;
   const esPar = (x) => x % 2 === 0;

   if (diagonales && longitud === b67) {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio : "NA/NE";
   }
   return 0;
}
// AM.6000 – Plataforma metálica 290×3072 mm - E
function calcularPlataforma3072E(
   {
      longitud, // F5
      ancho, // F6
      plataformaAcceso, // F14
      tipoPlataforma, // F15
      tipoServicio, // F9
      alturaAndamio, // F7
   },
   f87 // F87 (valor externo)
) {
   const b68 = 3072;
   const esPar = (x) => x % 2 === 0;

   // Error inicial por combinación inválida de longitud y tipo de plataforma
   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   // Parte principal: sólo si longitud = 3072 y plataforma ESP
   let resultado = 0;
   if (longitud === b68 && tipoPlataforma === "ESP") {
      // factor base según tipoPlataforma y ancho
      let factorBase = 0;
      if (tipoPlataforma === "ESP") {
         if (ancho === 732) {
            factorBase = 2;
         } else if (ancho === 1020 || ancho === 1090) {
            factorBase = 3;
         }
      } else if (tipoPlataforma === "CHI") {
         if (ancho === 1090) {
            factorBase = 3;
         } else if (ancho === 1020 || ancho === 732) {
            factorBase = 2;
         }
      }
      // factor de servicio según tipoServicio y paridad de altura
      let factorServicio;
      if (tipoServicio === "NORMAL") {
         factorServicio = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         factorServicio = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      }
      if (typeof factorServicio !== "number") {
         return factorServicio;
      }
      resultado = factorBase * factorServicio;
   }

   // Resta: si es plataforma ESP con acceso y misma longitud
   let resta = 0;
   if (tipoPlataforma === "ESP" && plataformaAcceso && longitud === b68) {
      if (tipoServicio === "NORMAL") {
         resta = esPar(alturaAndamio) ? 2 * f87 - 2 : 2 * f87;
      } else if (tipoServicio === "VOLADO") {
         resta = 2 * f87;
      }
   }

   return resultado - resta;
}

// AM.6100 – Plataforma metálica 290×2572 mm - E
function calcularPlataforma2572E(
   {
      longitud,
      ancho,
      plataformaAcceso,
      tipoPlataforma,
      tipoServicio,
      alturaAndamio,
   },
   f88 // F88
) {
   const b69 = 2572;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let resultado = 0;
   if (longitud === b69 && tipoPlataforma === "ESP") {
      let factorBase = 0;
      if (tipoPlataforma === "ESP") {
         if (ancho === 732) factorBase = 2;
         else if (ancho === 1020 || ancho === 1090) factorBase = 3;
      } else if (tipoPlataforma === "CHI") {
         if (ancho === 1090) factorBase = 3;
         else if (ancho === 1020 || ancho === 732) factorBase = 2;
      }
      let factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      resultado = factorBase * factorServicio;
   }

   let resta = 0;
   if (tipoPlataforma === "ESP" && plataformaAcceso && longitud === b69) {
      if (tipoServicio === "NORMAL") {
         resta = esPar(alturaAndamio) ? 2 * f88 - 2 : 2 * f88;
      } else if (tipoServicio === "VOLADO") {
         resta = 2 * f88;
      }
   }

   return resultado - resta;
}

// AM.6200 – Plataforma metálica 290×2072 mm - E
function calcularPlataforma2072E(
   {
      longitud,
      ancho,
      plataformaAcceso,
      tipoPlataforma,
      tipoServicio,
      alturaAndamio,
   },
   f89 // F89
) {
   const b70 = 2072;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let resultado = 0;
   if (longitud === b70 && tipoPlataforma === "ESP") {
      let factorBase = 0;
      if (tipoPlataforma === "ESP") {
         if (ancho === 732) factorBase = 2;
         else if (ancho === 1020 || ancho === 1090) factorBase = 3;
      } else if (tipoPlataforma === "CHI") {
         if (ancho === 1090) factorBase = 3;
         else if (ancho === 1020 || ancho === 732) factorBase = 2;
      }
      let factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      resultado = factorBase * factorServicio;
   }

   let resta = 0;
   if (tipoPlataforma === "ESP" && plataformaAcceso && longitud === b70) {
      if (tipoServicio === "NORMAL") {
         resta = esPar(alturaAndamio) ? 2 * f89 - 2 : 2 * f89;
      } else if (tipoServicio === "VOLADO") {
         resta = 2 * f89;
      }
   }

   return resultado - resta;
}

// AM.6300 – Plataforma metálica 290×1572 mm - E
function calcularPlataforma290x1572E(
   {
      longitud, // F5
      ancho, // F6
      plataformaAcceso, // F14
      tipoPlataforma, // F15
      tipoServicio, // F9
      alturaAndamio, // F7
   },
   f90 // F90 (externo)
) {
   const b71 = 1572;
   const esPar = (x) => x % 2 === 0;

   // Error inicial: combinación inválida de longitud y tipoPlataforma
   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let resultado = 0;
   // Cálculo principal sólo si coincide longitud y es ESP
   if (longitud === b71 && tipoPlataforma === "ESP") {
      // factorBase según ancho cuando es ESP
      let factorBase;
      if (ancho === 732) factorBase = 2;
      else if (ancho === 1020 || ancho === 1090) factorBase = 3;
      else factorBase = 0;

      // factorServicio según tipoServicio y paridad de altura
      let factorServicio;
      if (tipoServicio === "NORMAL") {
         factorServicio = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      } else {
         factorServicio = esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      }
      if (typeof factorServicio !== "number") return factorServicio;

      resultado = factorBase * factorServicio;
   }

   // Substracción si es ESP, hay acceso y coincide longitud
   let resta = 0;
   if (tipoPlataforma === "ESP" && plataformaAcceso && longitud === b71) {
      if (tipoServicio === "NORMAL") {
         resta = esPar(alturaAndamio) ? 2 * f90 - 2 : 2 * f90;
      } else if (tipoServicio === "VOLADO") {
         resta = 2 * f90;
      }
   }

   return resultado - resta;
}

// AM.6400 – Plataforma metálica 290×1020 mm - E
function calcularPlataforma290x1020E({
   longitud, // F5
   ancho, // F6
   tipoPlataforma, // F15
   tipoServicio, // F9
   alturaAndamio, // F7
}) {
   const b72 = 1020;
   const esPar = (x) => x % 2 === 0;

   // Error inicial
   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   // Cálculo principal sólo si coincide longitud y es ESP
   if (longitud === b72 && tipoPlataforma === "ESP") {
      // factorBase
      let factorBase =
         ancho === 732 ? 2 : ancho === 1020 || ancho === 1090 ? 3 : 0;
      // factorServicio
      const factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      return factorBase * factorServicio;
   }

   return 0;
}

// AM.6500 – Plataforma metálica 290×0732 mm - E
function calcularPlataforma290x0732E({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   alturaAndamio,
}) {
   const b73 = 732;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }
   if (longitud === b73 && tipoPlataforma === "ESP") {
      let factorBase =
         ancho === 732 ? 2 : ancho === 1020 || ancho === 1090 ? 3 : 0;
      const factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      return factorBase * factorServicio;
   }
   return 0;
}

// AM.6600 – Plataforma metálica 320×3072 mm - C
function calcularPlataforma320x3072C(
   {
      longitud,
      ancho,
      plataformaAcceso,
      tipoPlataforma,
      tipoServicio,
      alturaAndamio,
   },
   f87 // F87 (externo)
) {
   const b74 = 3072;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let resultado = 0;
   // Principio: sólo si coincide longitud y es CHI
   if (longitud === b74 && tipoPlataforma === "CHI") {
      // factorBase cuando es CHI
      let factorBase =
         ancho === 1090 ? 3 : ancho === 1020 || ancho === 732 ? 2 : 0;
      // factorServicio
      const factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      resultado = factorBase * factorServicio;
   }

   // Substracción si CHI, hay acceso y coincide longitud
   let resta = 0;
   if (tipoPlataforma === "CHI" && plataformaAcceso && longitud === b74) {
      if (tipoServicio === "NORMAL") {
         resta = esPar(alturaAndamio) ? 2 * f87 - 2 : 2 * f87;
      } else if (tipoServicio === "VOLADO") {
         resta = 2 * f87;
      }
   }

   return resultado - resta;
}

// AM.6700 – Plataforma metálica 320×2572 mm - C
function calcularPlataforma320x2572C(
   {
      longitud,
      ancho,
      plataformaAcceso,
      tipoPlataforma,
      tipoServicio,
      alturaAndamio,
   },
   f88 // F88 (externo)
) {
   const b75 = 2572;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let resultado = 0;
   if (longitud === b75 && tipoPlataforma === "CHI") {
      let factorBase =
         ancho === 1090 ? 3 : ancho === 1020 || ancho === 732 ? 2 : 0;
      const factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      resultado = factorBase * factorServicio;
   }

   let resta = 0;
   if (tipoPlataforma === "CHI" && plataformaAcceso && longitud === b75) {
      if (tipoServicio === "NORMAL") {
         resta = esPar(alturaAndamio) ? 2 * f88 - 2 : 2 * f88;
      } else if (tipoServicio === "VOLADO") {
         resta = 2 * f88;
      }
   }

   return resultado - resta;
}
// AM.6800 – Plataforma metálica 320×2072 mm - C
function calcularPlataforma320x2072C(
   {
      longitud, // F5
      ancho, // F6
      plataformaAcceso, // F14
      tipoPlataforma, // F15
      tipoServicio, // F9
      alturaAndamio, // F7
   },
   f89 // F89
) {
   const b76 = 2072;
   const esPar = (x) => x % 2 === 0;

   // ERROR si combinación inválida longitud/tipoPlataforma
   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let resultado = 0;
   // principal: longitud = 2072 y tipo = CHI
   if (longitud === b76 && tipoPlataforma === "CHI") {
      // factorBase según tipoPlataforma y ancho
      let factorBase =
         tipoPlataforma === "ESP"
            ? ancho === 732
               ? 2
               : ancho === 1020 || ancho === 1090
               ? 3
               : 0
            : tipoPlataforma === "CHI"
            ? ancho === 1090
               ? 3
               : ancho === 1020 || ancho === 732
               ? 2
               : 0
            : 0;
      // factorServicio según servicio y altura
      let factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") {
         return factorServicio;
      }
      resultado = factorBase * factorServicio;
   }

   // resta si CHI, acceso y longitud = 2072
   let resta = 0;
   if (tipoPlataforma === "CHI" && plataformaAcceso && longitud === b76) {
      if (tipoServicio === "NORMAL") {
         resta = esPar(alturaAndamio) ? 2 * f89 - 2 : 2 * f89;
      } else if (tipoServicio === "VOLADO") {
         resta = 2 * f89;
      }
   }

   return resultado - resta;
}
// AM.6900 – Plataforma metálica 320×1572 mm - C
function calcularPlataforma320x1572C(
   {
      longitud, // F5
      ancho, // F6
      plataformaAcceso, // F14
      tipoPlataforma, // F15
      tipoServicio, // F9
      alturaAndamio, // F7
   },
   f90 // F90
) {
   const b77 = 1572;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let resultado = 0;
   if (longitud === b77 && tipoPlataforma === "CHI") {
      let factorBase =
         tipoPlataforma === "ESP"
            ? ancho === 732
               ? 2
               : ancho === 1020 || ancho === 1090
               ? 3
               : 0
            : tipoPlataforma === "CHI"
            ? ancho === 1090
               ? 3
               : ancho === 1020 || ancho === 732
               ? 2
               : 0
            : 0;
      let factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      resultado = factorBase * factorServicio;
   }

   let resta = 0;
   if (tipoPlataforma === "CHI" && plataformaAcceso && longitud === b77) {
      if (tipoServicio === "NORMAL") {
         resta = esPar(alturaAndamio) ? 2 * f90 - 2 : 2 * f90;
      } else if (tipoServicio === "VOLADO") {
         resta = 2 * f90;
      }
   }

   return resultado - resta;
}
// AM.7000 – Plataforma metálica 320×1090 mm - C
function calcularPlataforma320x1090C({
   longitud, // F5
   ancho, // F6
   tipoPlataforma, // F15
   tipoServicio, // F9
   alturaAndamio, // F7
}) {
   const b78 = 1090;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === b78 && tipoPlataforma === "CHI") {
      const factorBase =
         tipoPlataforma === "ESP"
            ? ancho === 732
               ? 2
               : ancho === 1020 || ancho === 1090
               ? 3
               : 0
            : tipoPlataforma === "CHI"
            ? ancho === 1090
               ? 3
               : ancho === 1020 || ancho === 732
               ? 2
               : 0
            : 0;
      const factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      return factorBase * factorServicio;
   }

   return 0;
}
// AM.7100 – Plataforma metálica 320×0732 mm - C
function calcularPlataforma320x0732C({
   longitud, // F5
   ancho, // F6
   tipoPlataforma, // F15
   tipoServicio, // F9
   alturaAndamio, // F7
}) {
   const b79 = 732;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === b79 && tipoPlataforma === "CHI") {
      const factorBase =
         tipoPlataforma === "ESP"
            ? ancho === 732
               ? 2
               : ancho === 1020 || ancho === 1090
               ? 3
               : 0
            : tipoPlataforma === "CHI"
            ? ancho === 1090
               ? 3
               : ancho === 1020 || ancho === 732
               ? 2
               : 0
            : 0;
      const factorServicio =
         tipoServicio === "NORMAL"
            ? esPar(alturaAndamio)
               ? 0.5 * alturaAndamio
               : 0.5 * alturaAndamio + 0.5
            : esPar(alturaAndamio)
            ? 0.5 * alturaAndamio + 1
            : "NA/NE";
      if (typeof factorServicio !== "number") return factorServicio;
      return factorBase * factorServicio;
   }

   return 0;
}

// AM.7200 – Plataforma metálica 190×3072 mm - C
function calcularPlataforma190x3072C({
   longitud, // F5
   ancho, // F6
   tipoPlataforma, // F15
   tipoServicio, // F9
   alturaAndamio, // F7
}) {
   const b80 = 3072;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === b80 && ancho === 1020 && tipoPlataforma === "CHI") {
      return tipoServicio === "NORMAL"
         ? esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5
         : esPar(alturaAndamio)
         ? 0.5 * alturaAndamio + 1
         : "NA/NE";
   }

   return 0;
}
// AM.7300 – Plataforma metálica de 190×2572 mm - C
function calcularPlataforma190x2572C({
   longitud, // F5
   ancho, // F6
   tipoPlataforma, // F15
   tipoServicio, // F9
   alturaAndamio, // F7
}) {
   const b81 = 2572;
   const esPar = (x) => x % 2 === 0;

   // Error si combinación inválida longitud/tipoPlataforma
   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   // Solo cuando longitud = 2572, ancho = 1020 y tipoPlataforma = CHI
   if (longitud === b81 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }

   return 0;
}
// AM.7400 – Plataforma metálica de 190×2072 mm - C
function calcularPlataforma190x2072C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   alturaAndamio,
}) {
   const b82 = 2072;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }
   if (longitud === b82 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}
//// AM.7410 – Plataforma metálica de 190×1572 mm - C
function calcularPlataformaAM7410({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   alturaAndamio,
}) {
   const b83 = 1572;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }
   if (longitud === b83 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

// AM.7420 – Plataforma metálica de 190×1090 mm - C
function calcularPlataforma190x1090C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   alturaAndamio,
}) {
   const b84 = 1090;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }
   if (longitud === b84 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

// AM.7430 – Plataforma metálica de 190×1020 mm - C
function calcularPlataforma190x1020C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   alturaAndamio,
}) {
   const b85 = 1020;
   const esPar = (x) => x % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }
   if (longitud === b85 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }
   return 0;
}

// AM.7440 – Plataforma metálica de 190×0732 mm - C: según longitud, ancho, tipo de plataforma, servicio y altura
function calcularPlataforma190x0732C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   alturaAndamio,
}) {
   const b86 = 732; // B86
   const esPar = (x) => x % 2 === 0;

   // ERROR si combinación inválida longitud/tipoPlataforma
   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   // Solo cuando longitud = 732, ancho = 1020 y tipoPlataforma = CHI
   if (longitud === b86 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar(alturaAndamio)
            ? 0.5 * alturaAndamio
            : 0.5 * alturaAndamio + 0.5;
      }
      return esPar(alturaAndamio) ? 0.5 * alturaAndamio + 1 : "NA/NE";
   }

   return 0;
}

function calcularPlataformaAcceso3072({
   plataformaAcceso,
   longitud,
   alturaAndamio,
}) {
   const b87 = 3072; // B87
   const esPar = (x) => x % 2 === 0;

   // ERROR si hay acceso pero longitud no coincide con b87
   if (plataformaAcceso && [1090, 1020, 732].includes(longitud)) {
      return "ERROR";
   }
   // Solo cuando hay acceso y longitud = 3072
   if (plataformaAcceso && longitud === b87) {
      return esPar(alturaAndamio)
         ? 0.5 * alturaAndamio
         : 0.5 * alturaAndamio - 0.5;
   }

   return 0;
}

// AM.7451 – Plataforma de aluminio c/acceso 2572 mm (inc. escalera)

function calcularPlataformaAcceso2572({
   plataformaAcceso,
   longitud,
   alturaAndamio,
}) {
   const b88 = 2572; // B88
   const esPar = (x) => x % 2 === 0;

   if (plataformaAcceso && [1090, 1020, 732].includes(longitud)) {
      return "ERROR";
   }
   if (plataformaAcceso && longitud === b88) {
      return esPar(alturaAndamio)
         ? 0.5 * alturaAndamio
         : 0.5 * alturaAndamio - 0.5;
   }

   return 0;
}

// AM.7452 – Plataforma de aluminio c/acceso 2072 mm (inc. escalera)
function calcularPlataformaAcceso2072({
   plataformaAcceso,
   longitud,
   alturaAndamio,
}) {
   const b89 = 2072; // B89
   const esPar = (x) => x % 2 === 0;

   if (plataformaAcceso && [1090, 1020, 732].includes(longitud)) {
      return "ERROR";
   }
   if (plataformaAcceso && longitud === b89) {
      return esPar(alturaAndamio)
         ? 0.5 * alturaAndamio
         : 0.5 * alturaAndamio - 0.5;
   }

   return 0;
}
// AM.7453 – Plataforma de aluminio c/acceso 1572 mm (inc. escalera)
function calcularPlataformaAcceso1572({
   plataformaAcceso,
   longitud,
   alturaAndamio,
}) {
   const b90 = 1572; // B90
   const esPar = (x) => x % 2 === 0;

   if (plataformaAcceso && [1090, 1020, 732].includes(longitud)) {
      return "ERROR";
   }
   if (plataformaAcceso && longitud === b90) {
      return esPar(alturaAndamio)
         ? 0.5 * alturaAndamio
         : 0.5 * alturaAndamio - 0.5;
   }

   return 0;
}
// AM.7900 – Plataforma mixta con acceso de 3072 mm: sin fórmula, retorna siempre 0
function calcularPlataformaMixtaAcceso3072() {
   return 0;
}

// AM.8000 – Plataforma mixta con acceso de 2572 mm: sin fórmula, retorna siempre 0
function calcularPlataformaMixtaAcceso2572() {
   return 0;
}

// AM.8500 – Tubo con gancho 1.00 m: calcula según tipo de tubo, longitud, cantidad de andamios, altura de andamio y altura de entrepiso
function calcularTuboGancho1m({
   tuboAmarre,
   longitud,
   alturaAndamio,
   alturaEntrepiso,
   cantidadAndamios,
}) {
   const b93 = 1; // B93
   if (tuboAmarre !== b93) {
      return 0;
   }
   if (longitud > 0 && cantidadAndamios === 0) {
      return 2 * Math.ceil(alturaAndamio / (2 * alturaEntrepiso));
   }
   if (longitud > 0 && cantidadAndamios > 0) {
      return Math.ceil(alturaAndamio / (2 * alturaEntrepiso));
   }
   return 0;
}

function calcularTuboGancho05m({
   tuboAmarre,
   longitud,
   alturaAndamio,
   alturaEntrepiso,
   cantidadAndamios,
}) {
   const b94 = 0.5; // B94
   if (tuboAmarre !== b94) {
      return 0;
   }
   if (longitud > 0 && cantidadAndamios === 0) {
      return 2 * Math.ceil(alturaAndamio / (2 * alturaEntrepiso));
   }
   if (longitud > 0 && cantidadAndamios > 0) {
      return Math.ceil(alturaAndamio / (2 * alturaEntrepiso));
   }
   return 0;
}

function calcularBridaGiratoria(tubo1, tubo2) {
   return tubo1 + tubo2;
}

function calcularBridaFija() {
   return 0;
}

function calcularAcopladorMulti() {
   return 0;
}

function calcularConectorSuspension() {
   return 0;
}

function calcularPinGravedad12mm() {
   return 0;
}

function calcularPinGravedad8mm() {
   return 0;
}
// CO.0010 – Pernos de expansión c/ argolla - M12 x 80: suma los valores de F93 y F94
function calcularPernosExpansionM12x80(tubo1m, tubo05m) {
   return tubo1m + tubo05m;
}
// PU.0300 – Puntal 3.00m: si la altura de entrepiso está entre 1.65 m y B102, retorna F23*4; de lo contrario 0
function calcularPuntal3m({ alturaEntrepiso }, f23) {
   const b102 = 3;
   if (alturaEntrepiso >= 1.65 && alturaEntrepiso <= b102) {
      return f23 * 4;
   }
   return 0;
}

function calcularPinPresion11mm({ total }) {
   return total;
}

function calcularArgolla4840mm({ total }) {
   return total;
}

module.exports = {
   calcularHusilloNivelacion,
   calcularPiezaInicio,
   calcularPerfilMetalicoUPN,
   calcularMarcoCombi200,
   calcularVertical200,
   calcularVertical150,
   calcularVertical100,
   calcularVertical050,
   calcularEspiga,
   calcularHorizontalMulti3072,
   calcularHorizontalMulti2572,
   calcularHorizontalMulti2072,
   calcularHorizontalMulti1572,
   calcularHorizontalMulti1090,
   calcularHorizontalMulti1020,
   calcularHorizontalMulti0732,
   calcularHorizontalMulti432MensulaN,
   calcularHorizontalMulti432MensulaE,
   calcularBarandillasCombi3072,
   calcularBarandillasCombi2072,
   calcularBarandillasCombi0732,
   calcularMensula1090,
   calcularMensula700,
   calcularMensula300,
   calcularRodapie3072E,
   calcularRodapie2572E,
   calcularRodapie2072E,
   calcularRodapie1020E,
   calcularRodapie0732E,
   calcularRodapie3072C,
   calcularRodapie2572C,
   calcularRodapie2072C,
   calcularRodapie1572C,
   calcularRodapie1090C,
   calcularRodapie0732C,
   calcularRodapie3072N,
   calcularRodapie2572N,
   calcularRodapie2072N,
   calcularRodapie1572N,
   calcularRodapie1090N,
   calcularRodapie0732N,
   calcularDiagonal3072,
   calcularDiagonal2572,
   calcularDiagonal2072,
   calcularDiagonal1572,
   calcularDiagonal1090,
   calcularDiagonal1020,
   calcularPlataforma3072E,
   calcularPlataforma2572E,
   calcularPlataforma2072E,
   calcularPlataforma290x1572E,
   calcularPlataforma290x1020E,
   calcularPlataforma290x0732E,
   calcularPlataforma320x3072C,
   calcularPlataforma320x2572C,
   calcularPlataforma320x2072C,
   calcularPlataforma320x1572C,
   calcularPlataforma320x1090C,
   calcularPlataforma320x0732C,
   calcularPlataforma190x3072C,
   calcularPlataforma190x2572C,
   calcularPlataforma190x2072C,
   calcularPlataformaAM7410,
   calcularPlataforma190x1090C,
   calcularPlataforma190x1020C,
   calcularPlataforma190x0732C,
   calcularPlataformaAcceso3072,
   calcularPlataformaAcceso2572,
   calcularPlataformaAcceso2072,
   calcularPlataformaAcceso1572,
   calcularPlataformaMixtaAcceso3072,
   calcularPlataformaMixtaAcceso2572,
   calcularTuboGancho1m,
   calcularTuboGancho05m,
   calcularBridaGiratoria,
   calcularBridaFija,
   calcularAcopladorMulti,
   calcularConectorSuspension,
   calcularPinGravedad12mm,
   calcularPinGravedad8mm,
   calcularPernosExpansionM12x80,
   calcularPuntal3m,
   calcularPinPresion11mm,
   calcularArgolla4840mm,
};
