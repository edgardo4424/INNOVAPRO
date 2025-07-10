// 1. Pieza: EC.0600 - PLATAFORMA DE DESCARGA - 1.5 TON
function calcularEC0600({ capacidad }) {
  console.log('capacidad', capacidad);
  console.log(capacidad === 1.5 ? 1 : 0);
  return capacidad === 1.5 ? 1 : 0;
}

// 2. Pieza: EC.0700 - PLATAFORMA DE DESCARGA - 2.0 TON
function calcularEC0700({ capacidad }) {
  return capacidad === 2 ? 1 : 0;
}

// 3. Pieza: EC.0710 - PUERTA ACCESO - 1.5 TON
function calcularEC0710({ capacidad, valorCalcularEC0600 }) {
  return capacidad === 1.5 ? valorCalcularEC0600 * 2 : 0;
}

// 4. Pieza: EC.0711 - PUERTA ACCESO INTERNA - 2 TON
function calcularEC0711({ capacidad, antiguedad, valorCalcularEC0700 }) {
  return capacidad === 2 && antiguedad === "NUEVA" ? valorCalcularEC0700 * 2 : 0;
}

// 5. Pieza: EC.0712 - PUERTA ACCESO EXTERNA - 2 TON
function calcularEC0712({ capacidad, antiguedad, valorCalcularEC0700 }) {
  console.log({capacidad, antiguedad, valorCalcularEC0700});
  return capacidad === 2 && antiguedad === "NUEVA" ? valorCalcularEC0700 * 2 : 0;
}

// 6. Pieza: EC.0713 - BARANDA LATERAL - 1.5 TON
function calcularEC0713({ capacidad, antiguedad }) {
  if (capacidad === 1.5 && antiguedad === "NUEVA") return "ERROR";
  if (capacidad === 1.5 && antiguedad === "ANTIGUA") return 2;
  return 0;
}

// 7. Pieza: EC.0714 - BARANDA LATERAL - 2 TON
function calcularEC0714({ capacidad, antiguedad }) {
  console.log({capacidad, antiguedad});
  if (capacidad === 2 && antiguedad === "NUEVA") return 2;
  if (capacidad === 2 && antiguedad === "ANTIGUA") return 0;
  return 0;
}

// 8. Pieza: EC.0720 - BARRA ACCIONADORA DE PUERTAS
function calcularEC0720({ capacidad, antiguedad, valorCalcularEC0700 }) {
  return capacidad === 2 && antiguedad === "NUEVA" ? valorCalcularEC0700 * 2 : 0;
}

// 9. Pieza: EC.0730 - PERNO HEXAGONAL G.6.8 - M10 x 30
function calcularEC0730({ capacidad, antiguedad, valorCalcularEC0700 }) {
  return capacidad === 2 && antiguedad === "NUEVA" ? valorCalcularEC0700 * 4 : 0;
}

// 10. Pieza: EC.0900 - TRASPALETA MANUAL
function calcularEC0900({ traspaleta }) {
  return traspaleta === "SI" ? 1 : 0;
}

module.exports = { 
    calcularEC0600,
    calcularEC0700,
    calcularEC0710,
    calcularEC0711,
    calcularEC0712,
    calcularEC0713,
    calcularEC0714,
    calcularEC0720,
    calcularEC0730,
    calcularEC0900
}
