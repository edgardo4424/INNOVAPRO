// 1. Pieza: EV.0100 - CABINA ELEVADOR 3300mm x 1500mm - DERECHA
function calcularEV0100({ etapaMontaje, orientacionCabina, orientacionReferencia="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === orientacionReferencia) return 1;
  return 0;
}

// 2. Pieza: EV.0300 - TABLERO DIGITAL CABINA - 3300mm
function calcularEV0300({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 3. Pieza: EV.0400 - PALANCA CORTA CORRIENTE
function calcularEV0400({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 4. Pieza: EV.0500 - FRENO PARACAIDA
function calcularEV0500({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 5. Pieza: EV.0600 - LUZ LED CABINA
function calcularEV0600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 6. Pieza: EV.0700 - LLAVE DE MANDO
function calcularEV0700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 7. Pieza: EV.0800 - LIMITADOR PUERTA
function calcularEV0800({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 8. Pieza: EV.0900 - LIMITADOR PARADA
function calcularEV0900({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 9. Pieza: EV.1000 - POLINES DE GUIA
function calcularEV1000({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 14;
  return 0;
}

// 10. Pieza: EV.1100 - ESCALERA METÁLICA 2270mm x 40mm
function calcularEV1100({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 11. Pieza: EV.1210 - TABLERO CONTROL MANDO P/ OPERACIÓN CABINA 2600mm
function calcularEV1210({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 12. Pieza: EV.1300 - PLATAFORMA DESCARGA 1000mm x 1400mm
function calcularEV1300({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 13. Pieza: EV.1400 - PASAMANOS PLATAFORMA
function calcularEV1400({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 14. Pieza: EV.1500 - PUERTA CARGA 2300mm x 1400mm
function calcularEV1500({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 15. Pieza: EV.1600 - PUERTA DESCARGA 1340mm x 1400mm
function calcularEV1600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 16. Pieza: EV.1700 - PLACA UNIÓN MOTOR-CABINA 230mm x 110mm
function calcularEV1700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 17. Pieza: EV.1800 - CABLE ACERO C/ GUARDACABO 13mm x 1320mm - CABINA
function calcularEV1800({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 3;
  return 0;
}

// 18. Pieza: EV.1900 - GRILLETES DE 5/8"
function calcularEV1900({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 3;
  return 0;
}

// 19. Pieza: EV.2000 - MOTOR (19.1KW) CABINA 3300mm
function calcularEV2000({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 20. Pieza: EV.2100 - MOTOR DE WINCHE 220V
function calcularEV2100({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 21. Pieza: EV.2200 - BASE MOTOR
function calcularEV2200({ etapaMontaje }) {
  if (etapaMontaje.toUpperCase() === "NUEVO") return 1;
  return 0;
}

// 22. Pieza: EV.2300 - COBERTOR MOTOR 1280mm x 400mm
function calcularEV2300({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 23. Pieza: EV.2400 - PALANCA FRENO MOTOR
function calcularEV2400({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 24. Pieza: EV.2510 - TABLERO CONTROL P/ ELEVADOR CABINA DE 2600mm
function calcularEV2510({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 25. Pieza: EV.2600 - TABLERO FUERZA
function calcularEV2600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 26. Pieza: EV.2700 - BASE TABLERO FUERZA 2500mm
function calcularEV2700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 27. Pieza: EV.2800 - MANDO TABLERO
function calcularEV2800({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 28. Pieza: EV.2900 - SENSOR TABLERO
function calcularEV2900({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 29. Pieza: EV.3100 - BASE WINCHA 2230mm x 200mm
function calcularEV3100({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 30. Pieza: EV.3200 - TOPE P/ RESORTE
function calcularEV3200({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 31. Pieza: EV.3300 - RESORTE MECÁNICO
function calcularEV3300({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 32. Pieza: EV.3400 - EXTENSIÓN P/ BASE - 1570mm
function calcularEV3400({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 33. Pieza: EV.3500 - BANCO DE RESISTENCIA
function calcularEV3500({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 34. Pieza: EV.3600 - BARANDA PARA TECHO DE CABINA C/ ABERTURA 1590mm x 1250mm
function calcularEV3600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 35. Pieza: EV.3700 - BARANDA PARA TECHO DE CABINA C/ ABERTURA (LADO DE MOTOR) 970mm x 1230mm
function calcularEV3700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 36. Pieza: EV.3800 - BARANDA PARA TECHO DE CABINA S/ ABERTURA 1590mm x 1250mm
function calcularEV3800({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 37. Pieza: EV.3900 - BARANDA PARA TECHO DE CABINA S/ ABERTURA (LADO DE MOTOR) 970mm x 1230mm
function calcularEV3900({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 38. Pieza: EV.4000 - BARANDA PARA TECHO DE CABINA (LADO DE PUERTAS) 1500mm x 1100mm
function calcularEV4000({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 39. Pieza: EV.4100 - REJA INTERMEDIA CONTORNO DE ELEVADOR 2000mm x 1200mm
function calcularEV4100({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 40. Pieza: EV.4300 - REJA COSTADO PUERTA PRINCIPAL 2000mm x 1740mm - DERECHA
function calcularEV4300({ etapaMontaje, orientacionCabina, referenciaOrientacion="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === referenciaOrientacion) return 1;
  return 0;
}

// 41. Pieza: EV.4400 - REJA COSTADO CONTORNO DE ELEVADOR 2000mm x 1150mm
function calcularEV4400({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 3;
  return 0;
}

// 42. Pieza: EV.4600 - REJA COSTADO PESAS CONTORNO ELEVADOR 2000mm x 1150mm - DERECHA
function calcularEV4600({ etapaMontaje, orientacionCabina, referenciaOrientacion="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === referenciaOrientacion) return 1;
  return 0;
}

// 43. Pieza: EV.4800 - PUERTA PRINCIPAL REJA 1830mm x 3140mm - DERECHA
function calcularEV4800({ etapaMontaje, orientacionCabina, referenciaOrientacion="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === referenciaOrientacion) return 1;
  return 0;
}

// 44. Pieza: EV.5000 - PUERTA INTERNA REJA 2000mm x 730mm - DERECHO
function calcularEV5000({ etapaMontaje, orientacionCabina, referenciaOrientacion="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === referenciaOrientacion) return 1;
  return 0;
}

// 45. Pieza: EV.5200 - REJA ESQUINERA (LADO TABLERO) 2000MM x 500 - DERECHA
function calcularEV5200({ etapaMontaje, orientacionCabina, referenciaOrientacion="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === referenciaOrientacion) return 1;
  return 0;
}

// 46. Pieza: EV.5400 - REJA ESQUINERA (LADO PUERTA) 2000MM x 500 - DERECHA
function calcularEV5400({ etapaMontaje, orientacionCabina, referenciaOrientacion="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === referenciaOrientacion) return 1;
  return 0;
}

// 47. Pieza: EV.5500 - SOPORTE REJA
function calcularEV5500({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 48. Pieza: EV.5600 - RIEL P/ PUERTA PRINCIPAL - LADO A
function calcularEV5600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 49. Pieza: EV.5700 - PESAS C/ POLEAS (PUERTA PRINCIPAL 3300mm) DE 465mm x 140mm
function calcularEV5700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 50. Pieza: EV.5900 - PLACA SUPERIOR (PUERTA PRINCIPAL DE REJA) - DERECHA
function calcularEV5900({ etapaMontaje, orientacionCabina, referenciaOrientacion="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === referenciaOrientacion) return 1;
  return 0;
}

// 51. Pieza: EV.6100 - PLACA SUPERIOR (PUERTA ELEVADOR) - DERECHA
function calcularEV6100({ etapaMontaje, orientacionCabina, referenciaOrientacion="DERECHA" }) {
  if (etapaMontaje === "NUEVO" && orientacionCabina === referenciaOrientacion) return 1;
  return 0;
}

// 52. Pieza: EV.6200 - PLACA UNION RIEL Y PUERTA PRINCIPAL
function calcularEV6200({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 53. Pieza: EV.6300 - PLACA P/ ARRIOSTRE 350 x 90mm
function calcularEV6300({ cantidadEV6600 }) {
  return cantidadEV6600 * 2;
}

// 54. Pieza: EV.6400 - PLACA P/ RESORTE MECANICO
function calcularEV6400({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 55. Pieza: EV.6500 - ESCUADRA WINCHA C/ POLEA 2780mm x 1410mm
function calcularEV6500({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 56. Pieza: EV.6600 - MASTIL INICIO 1500mm x 720mm
function calcularEV6600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 57. Pieza: EV.6700 - MASTIL DOBLE CREMALLERA 1500mm x 720mm
function calcularEV6700({
  etapaMontaje,
  nivelUltimaLlegada,
  nivelInicialLlegada,
  valorCalcularEV6600,
  valorCalcularEV6800
}) {
  const calcularCantidad = (nivel) =>
    Math.floor((nivel + 3.5 - 0.1) / 1.5);

  if (etapaMontaje === "NUEVO") {
    return calcularCantidad(nivelUltimaLlegada) + 2 - valorCalcularEV6600 - valorCalcularEV6800;
  }
  if (etapaMontaje === "RECRECIMIENTO") {
    return (
      calcularCantidad(nivelUltimaLlegada) -
      calcularCantidad(nivelInicialLlegada)
    );
  }
  return 0;
}

// 58. Pieza: EV.6800 - MASTIL SEGURIDAD PARADA S/ CREMALLERA
function calcularEV6800({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 59. Pieza: EV.6900 - ARRIOSTRE P/ MASTIL
function calcularEV6900({
  tipoArriostre,
  etapaMontaje,
  nivelUltimaLlegada,
  nivelInicialLlegada,
  alturaPisoUno,
  alturaEntrepiso
}) {
  const calcularCantidad = (nivel) => {
    const tramos = Math.ceil((nivel + 3.5 - 0.1) / 1.5) + 3;
    const alturaTotal = tramos * 1.5 - alturaPisoUno - alturaEntrepiso;
    return Math.ceil(Math.floor(alturaTotal / alturaEntrepiso) / 3);
  };

  if (tipoArriostre !== "ARRIOSTRE PARA MASTIL") return 0;

  if (etapaMontaje === "NUEVO") {
    return calcularCantidad(nivelUltimaLlegada);
  }
  if (etapaMontaje === "RECRECIMIENTO") {
    return (
      calcularCantidad(nivelUltimaLlegada) -
      calcularCantidad(nivelInicialLlegada)
    );
  }
  return 0;
}

// 60. Pieza: EV.7000 - TUBO P/ ARRIOSTRE MASTIL - 1300mm
function calcularEV7000({ valorCalcularEV6900 }) {
  return valorCalcularEV6900 * 2;
}

// 61. Pieza: EV.7100 - BRAZO PORTA CABLE ELECTRICO 700mm x 11mm / CABINA
function calcularEV7100({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 62. Pieza: EV.7120 - BRAZO PORTA CABLE ELECTRICO / MASTIL
function calcularEV7120({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 63. Pieza: EV.7400 - BRAZO P/ ARRIOSTRE MASTIL TIPO 1
function calcularEV7400({ valorCalcularEV6900 }) {
  return valorCalcularEV6900 * 2;
}

// 64. Pieza: EV.7500 - BRAZO P/ IZAJE MASTIL
function calcularEV7500({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 65. Pieza: EV.7600 - BARRA LIMITADORA - 1980mm
function calcularEV7600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 66. Pieza: EV.7700 - BARRA LIMITADORA - 1660mm
function calcularEV7700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 67. Pieza: EV.7800 - BARRA LIMITADORA - 1570mm
function calcularEV7800({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 68. Pieza: EV.8160 - CABLE ELECTRICO VULCANIZADO P/ ELEVADOR DE 70m
function calcularEV8160({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 69. Pieza: EV.8300 - CABLE ELECTRICO VULCANIZADO P/ ELEVADOR DE 5m
function calcularEV8300({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 70. Pieza: EV.8400 - CABLE ELECTRICO VULCANIZADO CON PROTECTOR P/ BANCO DE RESISTENCIA 3.20m
function calcularEV8400({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 71. Pieza: EV.8500 - TROLER DISTRIBUIDOR DE CABLE ELECTRICO
function calcularEV8500({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 72. Pieza: EV.8600 - MENNEKE ELEVADOR (24 PINES)
function calcularEV8600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 73. Pieza: EV.8700 - MENNEKE MOTOR (6 PINES)
function calcularEV8700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 74. Pieza: EV.8800 - MENNEKE BANCO (2 PINES)
function calcularEV8800({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 75. Pieza: EV.8900 - MANDO WINCHE
function calcularEV8900({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 1;
  return 0;
}

// 76. Pieza: EV.9100 - PERNO HEXAGONAL G.8.8 M24 x 170
function calcularEV9100({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 4;
  return 0;
}

// 77. Pieza: EV.9200 - PERNO HEXAGONAL G 8.8 M24 x 25
function calcularEV9200({ valorCalcularEV6700 }) {
  return valorCalcularEV6700 * 4;
}

// 78. Pieza: EV.9300 - PERNO HEXAGONAL G.8.8 M24 x 90
function calcularEV9300({ valorCalcularEV6900 }) {
  return valorCalcularEV6900 * 4;
}

// 79. Pieza: EV.9400 - PERNO HEXAGONAL G.8.8 M20 x 80
function calcularEV9400({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 8;
  return 0;
}

// 80. Pieza: EV.9500 - PERNO HEXAGONAL G.8.8 M16 x 90
function calcularEV9500({ valorCalcularEV6900 }) {
  return valorCalcularEV6900 * 4;
}

// 81. Pieza: EV.9600 - PERNO HEXAGONAL G.8.8 M12 x 40
function calcularEV9600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 4;
  return 0;
}

// 82. Pieza: EV.9700 - PERNO HEXAGONAL G.8.8 M12 x 30
function calcularEV9700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 4;
  return 0;
}

// 83. Pieza: EV.9900 - PERNO "J" G.8.8 M10 x 80
function calcularEV9900({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 12;
  return 0;
}

// 84. Pieza: EV.10000 - PERNO HEXAGONAL HILO CORRIDO G.8.8 M10 x 30
function calcularEV10000({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 6;
  return 0;
}

// 85. Pieza: EV.10100 - PERNO HEXAGONAL G.8.8 M8 x 70 (BARANDA C/ TUERCA DE NYLON)
function calcularEV10100({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 22;
  return 0;
}

// 86. Pieza: EV.10200 - PERNO HEXAGONAL HILO CORRIDO G.8.8 M8 x 35 (PLACA RIEL C/ TUERCA NYLON)
function calcularEV10200({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 4;
  return 0;
}

// 87. Pieza: EV.10300 - PERNO HEXAGONAL HILO CORRIDO G.8.8 M8 x 25 (RIEL C/ TUERCA NYLON)
function calcularEV10300({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 4;
  return 0;
}

// 88. Pieza: EV.10500 - ARANDELA CUADRADA 100mm x 100mm x 4.5mm P/ ESPÁRRAGO DE 1"
function calcularEV10500({ valorCalcularEV6900 }) {
  return valorCalcularEV6900 * 2;
}

// 89. Pieza: EV.10600 - PIN SENSOR MOTOR 90mm x 40 mm
function calcularEV10600({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 2;
  return 0;
}

// 90. Pieza: EV.10700 - PIN BASE WINCHE 86mm x 30mm
function calcularEV10700({ etapaMontaje }) {
  if (etapaMontaje === "NUEVO") return 4;
  return 0;
}

module.exports = { 
    calcularEV0100,
    calcularEV0300,
    calcularEV0400,
    calcularEV0500,
    calcularEV0600,
    calcularEV0700,
    calcularEV0800,
    calcularEV0900,
    calcularEV1000,

    calcularEV1100,
    calcularEV1210,
    calcularEV1300,
    calcularEV1400,
    calcularEV1500,
    calcularEV1600,
    calcularEV1700,
    calcularEV1800,
    calcularEV1900,
    calcularEV2000,

    calcularEV2100,
    calcularEV2200,
    calcularEV2300,
    calcularEV2400,
    calcularEV2510,
    calcularEV2600,
    calcularEV2700,
    calcularEV2800,
    calcularEV2900,

    calcularEV3100,
    calcularEV3200,
    calcularEV3300,
    calcularEV3400,
    calcularEV3500,
    calcularEV3600,
    calcularEV3700,
    calcularEV3800,
    calcularEV3900,
    calcularEV4000,

    calcularEV4100,
    calcularEV4300,
    calcularEV4400,
    calcularEV4600,
    calcularEV4800,
    calcularEV5000,

    calcularEV5200,
    calcularEV5400,
    calcularEV5500,
    calcularEV5600,
    calcularEV5700,
    calcularEV5900,

    calcularEV6100,
    calcularEV6200,
    calcularEV6300,
    calcularEV6400,
    calcularEV6500,
    calcularEV6600,
    calcularEV6700,
    calcularEV6800,
    calcularEV6900,
    calcularEV7000,

    calcularEV7100,
    calcularEV7120,
    calcularEV7400,
    calcularEV7500,
    calcularEV7600,
    calcularEV7700,
    calcularEV7800
}

