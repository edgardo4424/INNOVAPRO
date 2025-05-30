// 1. PU.0100 - PUNTAL 3.00m - VERDE CLARO
function calcularPU0100({ tipoPuntal, cantidad }) {
  return tipoPuntal === "3.00 m" ? cantidad : 0;
}

// 5. PU.0400 - PUNTAL 4.00m - VERDE
function calcularPU0400({ tipoPuntal, cantidad }) {
  return tipoPuntal === "4.00 m" ? cantidad : 0;
}
// 7. PU.0600 - PUNTAL 5.00m
function calcularPU0600({ tipoPuntal, cantidad }) {
  return tipoPuntal === "5.00 m" ? cantidad : 0;
}

// 8. PU.0700 - PIN PRESION - 11mm
function calcularPU0700(valorCalcularPU0100, valorCalcularPU0400 ) {
  return valorCalcularPU0100 + valorCalcularPU0400 ;
}

// 9. PU.0800 - PIN PRESION - 12mm
function calcularPU0800(valorCalcularPU0600) {
  return valorCalcularPU0600;
}

// 10. PU.0900 - ARGOLLA - 48/40mm
function calcularPU0900(valorCalcularPU0100, valorCalcularPU0400 ) {
  return valorCalcularPU0100 + valorCalcularPU0400 ;
}

// 11. PU.1000 - ARGOLLA - 60/52mm
function calcularPU1000(valorCalcularPU0600) {
  return valorCalcularPU0600;
}

// 12. PU.1100 - TRIPODE
function calcularPU1100({ tripode, cantidad }) {
  return tripode === "SI" ? cantidad : 0;
}

module.exports = { 
 calcularPU0100,
 calcularPU0400,
 calcularPU0600,
 calcularPU0700,
 calcularPU0800,
 calcularPU0900,
 calcularPU1000,
 calcularPU1100
}