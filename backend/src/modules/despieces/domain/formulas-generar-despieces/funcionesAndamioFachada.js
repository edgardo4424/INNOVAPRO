function calcularHusilloNivelacion({ tipoServicio, longitud, ancho }) {
   if (tipoServicio === "VOLADO") return 0;
   if (longitud > 0 && ancho === 0) return 4;
   if (longitud > 0 && ancho > 0) return 2;
   return 0;
}

function calcularPiezaInicio(valorHusilloNivelacion, valorPerfilMetalico) {
   return valorHusilloNivelacion + valorPerfilMetalico * 2;
}

function calcularPerfilMetalicoUPN({ tipoServicio, longitud, ancho }) {
   if (tipoServicio !== "VOLADO") return 0;
   if (longitud > 0 && ancho === 0) return 2;
   if (longitud > 0 && ancho > 0) return 1;
   return 0;
}

function calcularMarcoCombi200(
   { ancho, tipoVertical, altura, valor1 },
   valorPiezaInicio
) {
   const anchoInvalido = ancho === 1020 || ancho === 1090;

   if (anchoInvalido && tipoVertical === "COMBI") return "ERROR";

   if (tipoVertical !== "COMBI") return 0;

   if (altura % 2 === 0) {
      return valor1 * altura * 0.25;
   } else {
      return valor1 * (altura - 1) * 0.25;
   }
}

function calcularVertical200({ tipoVertical, longitud, ancho, altura }) {
   if (tipoVertical !== "MULTI") return 0;

   if (longitud > 0 && ancho === 0) {
      return altura % 2 === 0 ? altura * 2 : (altura + 1) * 2;
   }

   if (longitud > 0 && ancho > 0) {
      return altura;
   }

   return 0;
}

function calcularVertical150() {
   return 0;
}

function calcularVertical100({ altura, longitud, ancho, tipoVertical }) {
   if (altura === undefined || altura === null) return 0;

   if (longitud > 0 && ancho === 0) {
      return altura % 2 === 0
         ? 4
         : tipoVertical === "COMBI" && altura % 2 === 1
         ? 8
         : 0;
   }

   if (longitud > 0 && ancho > 0) {
      if (tipoVertical === "MULTI") return 1;
      return altura % 2 === 1 ? 3 : 1;
   }

   return 0;
}

function calcularVertical050() {
   return 0;
}

function calcularEspiga({
   valor1,
   valor2,
   valor3,
   valor4,
   valor5,
   valor6,
   valor7,
   valor8,
   valor9,
}) {
   return (
      valor1 * 2 +
      valor2 +
      valor3 +
      valor4 +
      valor5 +
      valor6 +
      valor7 +
      valor8 +
      valor9
   );
}

function calcularHorizontalMulti3072({
   longitud,
   barandillaSI,
   ubicacion,
   tipoServicio,
   altura,
}) {
   const valor1 = 3072;
   const invalidos = [2572, 1572, 1090, 1020, 732];
   const esPar = altura % 2 === 0;

   if (invalidos.includes(longitud) && barandillaSI === "SI") {
      return "ERROR";
   }

   if (longitud === valor1) {
      if (ubicacion === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : altura + 3;
            } else {
               return esPar ? 1.5 * altura + 3 : 1.5 * altura + 3.5;
            }
         } else {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : "NE/NA1";
            } else {
               return esPar ? 1.5 * altura + 4 : "NE/NA2";
            }
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : altura + 3;
            } else {
               return 2 * altura + 2;
            }
         } else {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : "NE/NA3";
            } else {
               return esPar ? 2 * altura + 4 : "NE/NA4";
            }
         }
      }
   }

   return 0;
}

function calcularHorizontalMulti2572({
   longitud,
   barandillaSI,
   ubicacion,
   tipoServicio,
   altura,
}) {
   const valor1 = 2572;
   const conflictivos = [2572, 1572, 1090, 1020, 732];
   const esPar = altura % 2 === 0;

   if (conflictivos.includes(longitud) && barandillaSI === "SI") return "ERROR";

   if (longitud === valor1) {
      if (ubicacion === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : altura + 3;
            } else {
               return esPar ? 1.5 * altura + 3 : 1.5 * altura + 3.5;
            }
         } else {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : "NE/NA1";
            } else {
               return esPar ? 1.5 * altura + 4 : "NE/NA2";
            }
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : altura + 3;
            } else {
               return 2 * altura + 2;
            }
         } else {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : "NE/NA3";
            } else {
               return esPar ? 2 * altura + 4 : "NE/NA4";
            }
         }
      }
   }

   return 0;
}

function calcularHorizontalMulti2072({
   longitud,
   barandillaSI,
   ubicacion,
   tipoServicio,
   altura,
}) {
   const valor1 = 2072;
   const conflictivos = [2572, 1572, 1090, 1020, 732];
   const esPar = altura % 2 === 0;

   if (conflictivos.includes(longitud) && barandillaSI === "SI") return "ERROR";

   if (longitud === valor1) {
      if (ubicacion === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : altura + 3;
            } else {
               return esPar ? 1.5 * altura + 3 : 1.5 * altura + 3.5;
            }
         } else {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : "NE/NA1";
            } else {
               return esPar ? 1.5 * altura + 4 : "NE/NA2";
            }
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : altura + 3;
            } else {
               return 2 * altura + 2;
            }
         } else {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : "NE/NA3";
            } else {
               return esPar ? 2 * altura + 4 : "NE/NA4";
            }
         }
      }
   }

   return 0;
}

function calcularHorizontalMulti1572({
   longitud,
   barandillaSI,
   ubicacion,
   tipoServicio,
   altura,
}) {
   const valor1 = 1572;
   const conflictivos = [2572, 1572, 1090, 1020, 732];
   const esPar = altura % 2 === 0;

   if (conflictivos.includes(longitud) && barandillaSI === "SI") return "ERROR";

   if (longitud === valor1) {
      if (ubicacion === "LIMA") {
         if (tipoServicio === "NORMAL") {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : altura + 3;
            } else {
               return esPar ? 1.5 * altura + 3 : 1.5 * altura + 3.5;
            }
         } else {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : "NE/NA1";
            } else {
               return esPar ? 1.5 * altura + 4 : "NE/NA2";
            }
         }
      } else {
         if (tipoServicio === "NORMAL") {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : altura + 3;
            } else {
               return 2 * altura + 2;
            }
         } else {
            if (barandillaSI === "SI") {
               return esPar ? altura + 2 : "NE/NA3";
            } else {
               return esPar ? 2 * altura + 4 : "NE/NA4";
            }
         }
      }
   }

   return 0;
}

function calcularHorizontalMulti1090({
   longitud,
   ancho,
   tipoVertical,
   tipoServicio,
   barandillaSI,
   ubicacion,
   altura,
}) {
   const valor1 = 1090;
   const conflictivos = [2572, 1572, 1090, 1020, 732];
   const esPar = altura % 2 === 0;

   if (conflictivos.includes(longitud) && barandillaSI === "SI") return "ERROR";

   let resultado = 0;

   if (longitud === valor1) {
      if (ubicacion === "LIMA") {
         if (tipoServicio === "NORMAL") {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : altura + 3
                  : esPar
                  ? 1.5 * altura + 3
                  : 1.5 * altura + 3.5;
         } else {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : "NE/NA1"
                  : esPar
                  ? 1.5 * altura + 4
                  : "NE/NA2";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : altura + 3
                  : 2 * altura + 2;
         } else {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : "NE/NA3"
                  : esPar
                  ? 2 * altura + 4
                  : "NE/NA4";
         }
      }
   }

   // Validación adicional
   const errorCondicion =
      [1090, 1020].includes(ancho) &&
      (tipoServicio === "VOLADO" || tipoVertical === "COMBI");

   if (errorCondicion) return "ERROR";

   if (valor1 === ancho) {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoVertical === "MULTI") {
         if (tipoServicio === "NORMAL") {
            return largoYAncho
               ? esPar
                  ? 0.5 * altura + 1
                  : 0.5 * altura + 1.5
               : esPar
               ? 3 * altura + 2
               : 3 * altura + 3;
         } else {
            return largoYAncho
               ? esPar
                  ? 0.5 * altura + 1
                  : "NE/NA"
               : esPar
               ? 3 * altura + 6
               : "NE/NA";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            return largoYAncho
               ? esPar
                  ? 1
                  : 2
               : esPar
               ? 2 * altura + 2
               : 4 * altura - 4;
         } else {
            return largoYAncho
               ? esPar
                  ? 1
                  : "NE/NA"
               : esPar
               ? 2 * altura + 6
               : "NE/NA";
         }
      }
   }

   return resultado;
}

function calcularHorizontalMulti1020({
   longitud,
   ancho,
   tipoVertical,
   tipoServicio,
   barandillaSI,
   ubicacion,
   altura,
}) {
   const valor1 = 1020;
   const conflictivos = [2572, 1572, 1090, 1020, 732];
   const esPar = altura % 2 === 0;

   if (conflictivos.includes(longitud) && barandillaSI === "SI") return "ERROR";

   let resultado = 0;

   if (longitud === valor1) {
      if (ubicacion === "LIMA") {
         if (tipoServicio === "NORMAL") {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : altura + 3
                  : esPar
                  ? 1.5 * altura + 3
                  : 1.5 * altura + 3.5;
         } else {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : "NE/NA1"
                  : esPar
                  ? 1.5 * altura + 4
                  : "NE/NA2";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : altura + 3
                  : 2 * altura + 2;
         } else {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : "NE/NA3"
                  : esPar
                  ? 2 * altura + 4
                  : "NE/NA4";
         }
      }
   }

   const errorCondicion =
      [1090, 1020].includes(ancho) &&
      (tipoServicio === "VOLADO" || tipoVertical === "COMBI");

   if (errorCondicion) return "ERROR";

   if (valor1 === ancho) {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoVertical === "MULTI") {
         if (tipoServicio === "NORMAL") {
            return largoYAncho
               ? esPar
                  ? 0.5 * altura + 1
                  : 0.5 * altura + 1.5
               : esPar
               ? 3 * altura + 2
               : 3 * altura + 3;
         } else {
            return largoYAncho
               ? esPar
                  ? 0.5 * altura + 1
                  : "NE/NA"
               : esPar
               ? 3 * altura + 6
               : "NE/NA";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            return largoYAncho
               ? esPar
                  ? 1
                  : 2
               : esPar
               ? 2 * altura + 2
               : 4 * altura - 4;
         } else {
            return largoYAncho
               ? esPar
                  ? 1
                  : "NE/NA"
               : esPar
               ? 2 * altura + 6
               : "NE/NA";
         }
      }
   }

   return resultado;
}

function calcularHorizontalMulti0732(
   {
      longitud,
      ancho,
      tipoVertical,
      tipoServicio,
      barandillaSI,
      ubicacion,
      altura,
   },
   valor2
) {
   const valor1 = 732;
   const conflictivos = [2572, 1572, 1090, 1020, 732];
   const esPar = altura % 2 === 0;

   if (conflictivos.includes(longitud) && barandillaSI === "SI") return "ERROR";

   let resultado = 0;

   if (longitud === valor1) {
      if (ubicacion === "LIMA") {
         if (tipoServicio === "NORMAL") {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : altura + 3
                  : esPar
                  ? 1.5 * altura + 3
                  : 1.5 * altura + 3.5;
         } else {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : "NE/NA1"
                  : esPar
                  ? 1.5 * altura + 4
                  : "NE/NA2";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : altura + 3
                  : 2 * altura + 2;
         } else {
            resultado =
               barandillaSI === "SI"
                  ? esPar
                     ? altura + 2
                     : "NE/NA3"
                  : esPar
                  ? 2 * altura + 4
                  : "NE/NA4";
         }
      }
   }

   const errorCondicion =
      ([1090, 1020].includes(ancho) && tipoServicio === "VOLADO") ||
      ([1090, 1020].includes(ancho) && tipoVertical === "COMBI");

   if (errorCondicion) return "ERROR";

   if (valor1 === ancho) {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoVertical === "MULTI") {
         if (tipoServicio === "NORMAL") {
            resultado += largoYAncho
               ? esPar
                  ? 0.5 * altura + 1
                  : 0.5 * altura + 1.5
               : esPar
               ? 3 * altura + 2
               : 3 * altura + 3;
         } else {
            resultado += largoYAncho
               ? esPar
                  ? 0.5 * altura + 1
                  : "NE/NA"
               : esPar
               ? 3 * altura + 6
               : "NE/NA";
         }
      } else {
         if (tipoServicio === "NORMAL") {
            resultado += largoYAncho
               ? esPar
                  ? 1
                  : 2
               : esPar
               ? 2 * altura + 2
               : 2 * altura + 4;
         } else {
            resultado += largoYAncho
               ? esPar
                  ? 1
                  : "NE/NA"
               : esPar
               ? 2 * altura + 6
               : "NE/NA";
         }
      }
   }

   if (typeof resultado === "number") {
      return resultado - 2 * valor2;
   }

   return resultado;
}

function calcularHorizontalMulti432MensulaE() {
   return 0;
}

function calcularHorizontalMulti432MensulaE() {
   return 0;
}

function calcularBarandillasCombi3072({
   barandillaSI,
   longitud,
   tipoServicio,
   altura,
}) {
   const valor1 = 3072;
   const conflictivos = [2572, 1572, 1500, 1090, 1020];
   const esPar = altura % 2 === 0;

   if (barandillaSI === "SI" && conflictivos.includes(longitud)) return "ERROR";

   if (longitud === valor1 && barandillaSI === "SI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura - 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularBarandillasCombi2072({
   barandillaSI,
   longitud,
   tipoServicio,
   altura,
}) {
   const valor1 = 2072;
   const conflictivos = [2572, 1572, 1500, 1090, 1020];
   const esPar = altura % 2 === 0;

   if (barandillaSI === "SI" && conflictivos.includes(longitud)) return "ERROR";

   if (longitud === valor1 && barandillaSI === "SI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura - 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularBarandillasCombi0732({
   barandilla732SI,
   ancho,
   tipoServicio,
   longitud,
   altura,
}) {
   const esPar = altura % 2 === 0;

   if (barandilla732SI === "SI" && (ancho === 1090 || ancho === 1020)) {
      return "ERROR";
   }

   if (ancho === 732 && barandilla732SI === "SI") {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoServicio === "NORMAL") {
         if (!largoYAncho) {
            return esPar ? altura : altura - 1;
         }
      } else {
         if (!largoYAncho) {
            return esPar ? altura + 2 : "NA/NE";
         }
      }
   }

   return 0;
}

function calcularMensula1090() {
   return 0;
}

function calcularMensula700() {
   return 0;
}

function calcularMensula300() {
   return 0;
}

// aqui 5:13 pm
function calcularRodapie3072E({ longitud, tipoRodapie, tipoServicio, altura }) {
   const valor1 = 3072;
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie2572E({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B46
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie2072E({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B47
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie1020E({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B48
}) {
   const esPar = altura % 2 === 0;

   const error1 =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   const error2 =
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && tipoRodapie === "CHI") ||
      (ancho === 1020 && tipoRodapie === "NEO");

   if (error1 || error2) return "ERROR";

   let resultado = 0;

   if (longitud === valor1 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         resultado = esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         resultado = esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   if (ancho === valor1 && tipoRodapie === "ESP") {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoServicio === "NORMAL") {
         if (!largoYAncho) {
            resultado += esPar ? altura : altura - 1;
         }
      } else {
         if (!largoYAncho) {
            resultado += esPar ? altura + 2 : "NA/NE";
         }
      }
   }

   return resultado;
}

function calcularRodapie0732E({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B49
}) {
   const esPar = altura % 2 === 0;

   const error1 =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   const error2 =
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && tipoRodapie === "CHI") ||
      (ancho === 1020 && tipoRodapie === "NEO");

   if (error1 || error2) return "ERROR";

   let resultado = 0;

   if (longitud === valor1 && tipoRodapie === "ESP") {
      if (tipoServicio === "NORMAL") {
         resultado = esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         resultado = esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   if (ancho === valor1 && tipoRodapie === "ESP") {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoServicio === "NORMAL") {
         if (!largoYAncho) {
            resultado += esPar ? altura : altura - 1;
         }
      } else {
         if (!largoYAncho) {
            resultado += esPar ? altura + 2 : "NA/NE";
         }
      }
   }

   return resultado;
}

function calcularRodapie3072C({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B50
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie2572C({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B51
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie2072C({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B52
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie1572C({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B53
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie1090C({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B54
}) {
   const esPar = altura % 2 === 0;

   const error1 =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   const error2 =
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && tipoRodapie === "CHI") ||
      (ancho === 1020 && tipoRodapie === "NEO");

   if (error1 || error2) return "ERROR";

   let resultado = 0;

   if (longitud === valor1 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         resultado = esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         resultado = esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   if (ancho === valor1 && tipoRodapie === "CHI") {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoServicio === "NORMAL") {
         if (!largoYAncho) {
            resultado += esPar ? altura : altura - 1;
         }
      } else {
         if (!largoYAncho) {
            resultado += esPar ? altura + 2 : "NA/NE";
         }
      }
   }

   return resultado;
}

function calcularRodapie0732C({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B55
}) {
   const esPar = altura % 2 === 0;

   const error1 =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   const error2 =
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && tipoRodapie === "CHI") ||
      (ancho === 1020 && tipoRodapie === "NEO");

   if (error1 || error2) return "ERROR";

   let resultado = 0;

   if (longitud === valor1 && tipoRodapie === "CHI") {
      if (tipoServicio === "NORMAL") {
         resultado = esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         resultado = esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   if (ancho === valor1 && tipoRodapie === "CHI") {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoServicio === "NORMAL") {
         if (!largoYAncho) {
            resultado += esPar ? altura : altura - 1;
         }
      } else {
         if (!largoYAncho) {
            resultado += esPar ? altura + 2 : "NA/NE";
         }
      }
   }

   return resultado;
}

function calcularRodapie3072N({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B56
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie2572N({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B57
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie2072N({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B58
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie1572N({
   longitud,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B59
}) {
   const esPar = altura % 2 === 0;

   const esError =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   if (esError) return "ERROR";

   if (longitud === valor1 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularRodapie1090N({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B60
}) {
   const esPar = altura % 2 === 0;

   const error1 =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   const error2 =
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && tipoRodapie === "CHI") ||
      (ancho === 1020 && tipoRodapie === "NEO");

   if (error1 || error2) return "ERROR";

   let resultado = 0;

   if (longitud === valor1 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         resultado = esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         resultado = esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   if (ancho === valor1 && tipoRodapie === "NEO") {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoServicio === "NORMAL") {
         if (!largoYAncho) {
            resultado += esPar ? altura : altura - 1;
         }
      } else {
         if (!largoYAncho) {
            resultado += esPar ? altura + 2 : "NA/NE";
         }
      }
   }

   return resultado;
}

function calcularRodapie0732N({
   longitud,
   ancho,
   tipoRodapie,
   tipoServicio,
   altura,
   valor1, // B61
}) {
   const esPar = altura % 2 === 0;

   const error1 =
      (longitud === 1090 && tipoRodapie === "ESP") ||
      (longitud === 1020 && tipoRodapie === "CHI") ||
      (longitud === 1020 && tipoRodapie === "NEO");

   const error2 =
      (ancho === 1090 && tipoRodapie === "ESP") ||
      (ancho === 1020 && tipoRodapie === "CHI") ||
      (ancho === 1020 && tipoRodapie === "NEO");

   if (error1 || error2) return "ERROR";

   let resultado = 0;

   if (longitud === valor1 && tipoRodapie === "NEO") {
      if (tipoServicio === "NORMAL") {
         resultado = esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         resultado = esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   if (ancho === valor1 && tipoRodapie === "NEO") {
      const largoYAncho = longitud > 0 && ancho > 0;

      if (tipoServicio === "NORMAL") {
         if (!largoYAncho) {
            resultado += esPar ? altura : altura - 1;
         }
      } else {
         if (!largoYAncho) {
            resultado += esPar ? altura + 2 : "NA/NE";
         }
      }
   }

   return resultado;
}

function calcularDiagonal3072({
   diagonalesSI,
   valor1, // B62
   longitud,
   tipoServicio,
   altura,
}) {
   const esPar = altura % 2 === 0;

   if (diagonalesSI === "SI" && valor1 === longitud) {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura : "NA/NE";
      }
   }

   return 0;
}

function calcularDiagonal2572({
   diagonalesSI,
   valor1, // B63
   longitud,
   tipoServicio,
   altura,
}) {
   const esPar = altura % 2 === 0;

   if (diagonalesSI === "SI" && valor1 === longitud) {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura : "NA/NE";
      }
   }

   return 0;
}

function calcularDiagonal2072({
   diagonalesSI,
   valor1, // B64
   longitud,
   tipoServicio,
   altura,
}) {
   const esPar = altura % 2 === 0;

   if (diagonalesSI === "SI" && valor1 === longitud) {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura : "NA/NE";
      }
   }

   return 0;
}

function calcularDiagonal1572({
   diagonalesSI,
   valor1, // B65
   longitud,
   tipoServicio,
   altura,
}) {
   const esPar = altura % 2 === 0;

   if (diagonalesSI === "SI" && valor1 === longitud) {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura : "NA/NE";
      }
   }

   return 0;
}

function calcularDiagonal1090({
   diagonalesSI,
   valor1, // B66
   longitud,
   tipoServicio,
   altura,
}) {
   const esPar = altura % 2 === 0;

   if (diagonalesSI === "SI" && valor1 === longitud) {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura : "NA/NE";
      }
   }

   return 0;
}

function calcularDiagonal1020({
   diagonalesSI,
   valor1, // B67
   longitud,
   tipoServicio,
   altura,
}) {
   const esPar = altura % 2 === 0;

   if (diagonalesSI === "SI" && valor1 === longitud) {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura : "NA/NE";
      }
   }

   return 0;
}

function calcularPlataforma3072E({
   longitud,
   ancho,
   tipoPlataforma,
   plataformaAccesoSI,
   tipoServicio,
   altura,
   valor1, // B68
   valor2, // F87
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let cantidad = 0;

   if (longitud === valor1 && tipoPlataforma === "ESP") {
      const base =
         tipoPlataforma === "ESP"
            ? ancho === 732
               ? 2
               : [1020, 1090].includes(ancho)
               ? 3
               : 0
            : tipoPlataforma === "CHI"
            ? ancho === 1090
               ? 3
               : [1020, 732].includes(ancho)
               ? 2
               : 0
            : 0;

      const factor =
         tipoServicio === "NORMAL"
            ? esPar
               ? 0.5 * altura
               : 0.5 * altura + 0.5
            : esPar
            ? 0.5 * altura + 1
            : "NA/NE";

      cantidad = base * factor;
   }

   if (
      tipoPlataforma === "ESP" &&
      plataformaAccesoSI === "SI" &&
      valor1 === longitud
   ) {
      const resta =
         tipoServicio === "NORMAL"
            ? esPar
               ? 2 * valor2 - 2
               : 2 * valor2
            : tipoServicio === "VOLADO"
            ? 2 * valor2
            : 0;

      cantidad = typeof cantidad === "number" ? cantidad - resta : cantidad;
   }

   return cantidad;
}

function calcularPlataforma2572E({
   longitud,
   ancho,
   tipoPlataforma,
   plataformaAccesoSI,
   tipoServicio,
   altura,
   valor1, // B69
   valor2, // F88
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let cantidad = 0;

   if (longitud === valor1 && tipoPlataforma === "ESP") {
      const base =
         tipoPlataforma === "ESP"
            ? ancho === 732
               ? 2
               : [1020, 1090].includes(ancho)
               ? 3
               : 0
            : tipoPlataforma === "CHI"
            ? ancho === 1090
               ? 3
               : [1020, 732].includes(ancho)
               ? 2
               : 0
            : 0;

      const factor =
         tipoServicio === "NORMAL"
            ? esPar
               ? 0.5 * altura
               : 0.5 * altura + 0.5
            : esPar
            ? 0.5 * altura + 1
            : "NA/NE";

      cantidad = base * factor;
   }

   if (
      tipoPlataforma === "ESP" &&
      plataformaAccesoSI === "SI" &&
      valor1 === longitud
   ) {
      const resta =
         tipoServicio === "NORMAL"
            ? esPar
               ? 2 * valor2 - 2
               : 2 * valor2
            : tipoServicio === "VOLADO"
            ? 2 * valor2
            : 0;

      cantidad = typeof cantidad === "number" ? cantidad - resta : cantidad;
   }

   return cantidad;
}

function calcularPlataforma2072E({
   longitud,
   ancho,
   tipoPlataforma,
   plataformaAccesoSI,
   tipoServicio,
   altura,
   valor1, // B70
   valor2, // F89
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let cantidad = 0;

   if (longitud === valor1 && tipoPlataforma === "ESP") {
      const base =
         tipoPlataforma === "ESP"
            ? ancho === 732
               ? 2
               : [1020, 1090].includes(ancho)
               ? 3
               : 0
            : tipoPlataforma === "CHI"
            ? ancho === 1090
               ? 3
               : [1020, 732].includes(ancho)
               ? 2
               : 0
            : 0;

      const factor =
         tipoServicio === "NORMAL"
            ? esPar
               ? 0.5 * altura
               : 0.5 * altura + 0.5
            : esPar
            ? 0.5 * altura + 1
            : "NA/NE";

      cantidad = base * factor;
   }

   if (
      tipoPlataforma === "ESP" &&
      plataformaAccesoSI === "SI" &&
      valor1 === longitud
   ) {
      const resta =
         tipoServicio === "NORMAL"
            ? esPar
               ? 2 * valor2 - 2
               : 2 * valor2
            : tipoServicio === "VOLADO"
            ? 2 * valor2
            : 0;

      cantidad = typeof cantidad === "number" ? cantidad - resta : cantidad;
   }

   return cantidad;
}

function calcularPlataforma290x1572E({
   longitud,
   ancho,
   tipoPlataforma,
   plataformaAccesoSI,
   tipoServicio,
   altura,
   valor1, // B71
   valor2, // F90
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   )
      return "ERROR";

   let base = 0;

   if (tipoPlataforma === "ESP") {
      if (ancho === 732) base = 2;
      else if ([1020, 1090].includes(ancho)) base = 3;
   }

   if (tipoPlataforma === "CHI") {
      if (ancho === 1090) base = 3;
      else if ([1020, 732].includes(ancho)) base = 2;
   }

   let factor =
      tipoServicio === "NORMAL"
         ? esPar
            ? 0.5 * altura
            : 0.5 * altura + 0.5
         : esPar
         ? 0.5 * altura + 1
         : "NA/NE";

   let cantidad =
      longitud === valor1 && tipoPlataforma === "ESP" ? base * factor : 0;

   if (
      tipoPlataforma === "ESP" &&
      plataformaAccesoSI === "SI" &&
      valor1 === longitud
   ) {
      const resta =
         tipoServicio === "NORMAL"
            ? esPar
               ? 2 * valor2 - 2
               : 2 * valor2
            : tipoServicio === "VOLADO"
            ? 2 * valor2
            : 0;
      cantidad = typeof cantidad === "number" ? cantidad - resta : cantidad;
   }

   return cantidad;
}

function calcularPlataforma290x1020E({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1, // B72
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   )
      return "ERROR";

   let base = 0;

   if (tipoPlataforma === "ESP") {
      if (ancho === 732) base = 2;
      else if ([1020, 1090].includes(ancho)) base = 3;
   }

   if (tipoPlataforma === "CHI") {
      if (ancho === 1090) base = 3;
      else if ([1020, 732].includes(ancho)) base = 2;
   }

   const factor =
      tipoServicio === "NORMAL"
         ? esPar
            ? 0.5 * altura
            : 0.5 * altura + 0.5
         : esPar
         ? 0.5 * altura + 1
         : "NA/NE";

   return longitud === valor1 && tipoPlataforma === "ESP" ? base * factor : 0;
}

function calcularPlataforma290x0732E({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1, // B73
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   )
      return "ERROR";

   let base = 0;

   if (tipoPlataforma === "ESP") {
      if (ancho === 732) base = 2;
      else if ([1020, 1090].includes(ancho)) base = 3;
   }

   if (tipoPlataforma === "CHI") {
      if (ancho === 1090) base = 3;
      else if ([1020, 732].includes(ancho)) base = 2;
   }

   const factor =
      tipoServicio === "NORMAL"
         ? esPar
            ? 0.5 * altura
            : 0.5 * altura + 0.5
         : esPar
         ? 0.5 * altura + 1
         : "NA/NE";

   return longitud === valor1 && tipoPlataforma === "ESP" ? base * factor : 0;
}

function calcularPlataforma320x3072C({
   longitud,
   ancho,
   tipoPlataforma,
   plataformaAccesoSI,
   tipoServicio,
   altura,
   valor1, // B74
   valor2, // F87
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   )
      return "ERROR";

   let base = 0;

   if (tipoPlataforma === "ESP") {
      if (ancho === 732) base = 2;
      else if ([1020, 1090].includes(ancho)) base = 3;
   }

   if (tipoPlataforma === "CHI") {
      if (ancho === 1090) base = 3;
      else if ([1020, 732].includes(ancho)) base = 2;
   }

   let factor =
      tipoServicio === "NORMAL"
         ? esPar
            ? 0.5 * altura
            : 0.5 * altura + 0.5
         : esPar
         ? 0.5 * altura + 1
         : "NA/NE";

   let cantidad =
      longitud === valor1 && tipoPlataforma === "CHI" ? base * factor : 0;

   if (
      tipoPlataforma === "CHI" &&
      plataformaAccesoSI === "SI" &&
      valor1 === longitud
   ) {
      const resta =
         tipoServicio === "NORMAL"
            ? esPar
               ? 2 * valor2 - 2
               : 2 * valor2
            : tipoServicio === "VOLADO"
            ? 2 * valor2
            : 0;
      cantidad = typeof cantidad === "number" ? cantidad - resta : cantidad;
   }

   return cantidad;
}

function calcularPlataforma320x2572C({
   longitud,
   ancho,
   tipoPlataforma,
   plataformaAccesoSI,
   tipoServicio,
   altura,
   valor1, // B75
   valor2, // F88
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   )
      return "ERROR";

   let base = 0;

   if (tipoPlataforma === "ESP") {
      if (ancho === 732) base = 2;
      else if ([1020, 1090].includes(ancho)) base = 3;
   }

   if (tipoPlataforma === "CHI") {
      if (ancho === 1090) base = 3;
      else if ([1020, 732].includes(ancho)) base = 2;
   }

   let factor =
      tipoServicio === "NORMAL"
         ? esPar
            ? 0.5 * altura
            : 0.5 * altura + 0.5
         : esPar
         ? 0.5 * altura + 1
         : "NA/NE";

   let cantidad =
      longitud === valor1 && tipoPlataforma === "CHI" ? base * factor : 0;

   if (
      tipoPlataforma === "CHI" &&
      plataformaAccesoSI === "SI" &&
      valor1 === longitud
   ) {
      const resta =
         tipoServicio === "NORMAL"
            ? esPar
               ? 2 * valor2 - 2
               : 2 * valor2
            : tipoServicio === "VOLADO"
            ? 2 * valor2
            : 0;
      cantidad = typeof cantidad === "number" ? cantidad - resta : cantidad;
   }

   return cantidad;
}

function calcularPlataforma320x2072C({
   longitud,
   ancho,
   tipoPlataforma,
   plataformaAccesoSI,
   tipoServicio,
   altura,
   valor1, // B76
   valor2, // F89
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let base = 0;
   if (tipoPlataforma === "ESP") {
      base = ancho === 732 ? 2 : [1020, 1090].includes(ancho) ? 3 : 0;
   } else if (tipoPlataforma === "CHI") {
      base = ancho === 1090 ? 3 : [1020, 732].includes(ancho) ? 2 : 0;
   }

   let factor;
   if (tipoServicio === "NORMAL") {
      factor = esPar ? 0.5 * altura : 0.5 * altura + 0.5;
   } else {
      factor = esPar ? 0.5 * altura + 1 : "NA/NE";
   }

   let cantidad =
      longitud === valor1 && tipoPlataforma === "CHI" ? base * factor : 0;

   if (
      tipoPlataforma === "CHI" &&
      plataformaAccesoSI === "SI" &&
      longitud === valor1
   ) {
      const resta =
         tipoServicio === "NORMAL"
            ? esPar
               ? 2 * valor2 - 2
               : 2 * valor2
            : tipoServicio === "VOLADO"
            ? 2 * valor2
            : 0;
      cantidad = typeof cantidad === "number" ? cantidad - resta : cantidad;
   }

   return cantidad;
}

function calcularPlataforma320x1572C({
   longitud,
   ancho,
   tipoPlataforma,
   plataformaAccesoSI,
   tipoServicio,
   altura,
   valor1, // B77
   valor2, // F90
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let base = 0;
   if (tipoPlataforma === "ESP") {
      base = ancho === 732 ? 2 : [1020, 1090].includes(ancho) ? 3 : 0;
   } else if (tipoPlataforma === "CHI") {
      base = ancho === 1090 ? 3 : [1020, 732].includes(ancho) ? 2 : 0;
   }

   let factor;
   if (tipoServicio === "NORMAL") {
      factor = esPar ? 0.5 * altura : 0.5 * altura + 0.5;
   } else {
      factor = esPar ? 0.5 * altura + 1 : "NA/NE";
   }

   let cantidad =
      longitud === valor1 && tipoPlataforma === "CHI" ? base * factor : 0;

   if (
      tipoPlataforma === "CHI" &&
      plataformaAccesoSI === "SI" &&
      longitud === valor1
   ) {
      const resta =
         tipoServicio === "NORMAL"
            ? esPar
               ? 2 * valor2 - 2
               : 2 * valor2
            : tipoServicio === "VOLADO"
            ? 2 * valor2
            : 0;
      cantidad = typeof cantidad === "number" ? cantidad - resta : cantidad;
   }

   return cantidad;
}

function calcularPlataforma320x1090C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1, // B78
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let base = 0;
   if (tipoPlataforma === "ESP") {
      base = ancho === 732 ? 2 : [1020, 1090].includes(ancho) ? 3 : 0;
   } else if (tipoPlataforma === "CHI") {
      base = ancho === 1090 ? 3 : [1020, 732].includes(ancho) ? 2 : 0;
   }

   const factor =
      tipoServicio === "NORMAL"
         ? esPar
            ? 0.5 * altura
            : 0.5 * altura + 0.5
         : esPar
         ? 0.5 * altura + 1
         : "NA/NE";

   return longitud === valor1 && tipoPlataforma === "CHI" ? base * factor : 0;
}

function calcularPlataforma320x0732C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1, // B79
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   let base = 0;
   if (tipoPlataforma === "ESP") {
      base = ancho === 732 ? 2 : [1020, 1090].includes(ancho) ? 3 : 0;
   } else if (tipoPlataforma === "CHI") {
      base = ancho === 1090 ? 3 : [1020, 732].includes(ancho) ? 2 : 0;
   }

   const factor =
      tipoServicio === "NORMAL"
         ? esPar
            ? 0.5 * altura
            : 0.5 * altura + 0.5
         : esPar
         ? 0.5 * altura + 1
         : "NA/NE";

   return longitud === valor1 && tipoPlataforma === "CHI" ? base * factor : 0;
}

function calcularPlataforma190x3072C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1, // B80
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   const factor =
      tipoServicio === "NORMAL"
         ? esPar
            ? 0.5 * altura
            : 0.5 * altura + 0.5
         : esPar
         ? 0.5 * altura + 1
         : "NA/NE";

   return longitud === valor1 && ancho === 1020 && tipoPlataforma === "CHI"
      ? factor
      : 0;
}

function calcularPlataforma190x2572C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1,
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === valor1 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularPlataforma190x2072C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1,
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === valor1 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}
//
function calcularPlataformaAM7410({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1,
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === valor1 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularPlataforma190x1090C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1,
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === valor1 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularPlataforma190x1020C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1,
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === valor1 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularPlataforma190x0732C({
   longitud,
   ancho,
   tipoPlataforma,
   tipoServicio,
   altura,
   valor1,
}) {
   const esPar = altura % 2 === 0;

   if (
      (longitud === 1020 && tipoPlataforma === "CHI") ||
      (longitud === 1090 && tipoPlataforma === "ESP")
   ) {
      return "ERROR";
   }

   if (longitud === valor1 && ancho === 1020 && tipoPlataforma === "CHI") {
      if (tipoServicio === "NORMAL") {
         return esPar ? 0.5 * altura : 0.5 * altura + 0.5;
      } else {
         return esPar ? 0.5 * altura + 1 : "NA/NE";
      }
   }

   return 0;
}

function calcularPlataformaAcceso3072({ longitud, acceso, altura, valor1 }) {
   const esPar = altura % 2 === 0;

   if (
      acceso === "SI" &&
      (longitud === 1090 || longitud === 1020 || longitud === 732)
   ) {
      return "ERROR";
   }

   if (acceso === "SI" && longitud === valor1) {
      return esPar ? 0.5 * altura : 0.5 * altura - 0.5;
   }

   return 0;
}

function calcularPlataformaAcceso2572({ longitud, acceso, altura, valor1 }) {
   const esPar = altura % 2 === 0;

   if (
      acceso === "SI" &&
      (longitud === 1090 || longitud === 1020 || longitud === 732)
   ) {
      return "ERROR";
   }

   if (acceso === "SI" && longitud === valor1) {
      return esPar ? 0.5 * altura : 0.5 * altura - 0.5;
   }

   return 0;
}

function calcularPlataformaAcceso2072({ longitud, acceso, altura, valor1 }) {
   const esPar = altura % 2 === 0;

   if (
      acceso === "SI" &&
      (longitud === 1090 || longitud === 1020 || longitud === 732)
   ) {
      return "ERROR";
   }

   if (acceso === "SI" && longitud === valor1) {
      return esPar ? 0.5 * altura : 0.5 * altura - 0.5;
   }

   return 0;
}

function calcularPlataformaAcceso1572({ longitud, acceso, altura, valor1 }) {
   const esPar = altura % 2 === 0;

   if (
      acceso === "SI" &&
      (longitud === 1090 || longitud === 1020 || longitud === 732)
   ) {
      return "ERROR";
   }

   if (acceso === "SI" && longitud === valor1) {
      return esPar ? 0.5 * altura : 0.5 * altura - 0.5;
   }

   return 0;
}

function calcularPlataformaMixtaAcceso3072() {
   return 0;
}

function calcularPlataformaMixtaAcceso2572() {
   return 0;
}

function calcularTuboGancho1m({ tipoTubo, longitud, ancho, altura, valor1 }) {
   if (tipoTubo !== valor1) return 0;

   const ambosLaterales = longitud > 0 && ancho > 0;
   const unLateral = longitud > 0 && ancho === 0;

   if (unLateral) {
      return 2 * Math.ceil(altura / (2 * ancho));
   }

   if (ambosLaterales) {
      return Math.ceil(altura / (2 * ancho));
   }

   return 0;
}

function calcularTuboGancho05m({ tipoTubo, longitud, ancho, altura, valor1 }) {
   if (tipoTubo !== valor1) return 0;

   const ambosLaterales = longitud > 0 && ancho > 0;
   const unLateral = longitud > 0 && ancho === 0;

   if (unLateral) {
      return 2 * Math.ceil(altura / (2 * ancho));
   }

   if (ambosLaterales) {
      return Math.ceil(altura / (2 * ancho));
   }

   return 0;
}

function calcularBridaGiratoria({ tubo1, tubo2 }) {
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
function calcularPernosExpansionM12x80({ tubo1m, tubo05m }) {
   return tubo1m + tubo05m;
}

function calcularPuntal3mAzul({ altura, alturaMaxima, cantidad }) {
   if (altura >= 1.65 && altura <= alturaMaxima) {
      return cantidad * 4;
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
   calcularHorizontalMulti432MensulaE,
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
   calcularPuntal3mAzul,
   calcularPinPresion11mm,
   calcularArgolla4840mm,
};
