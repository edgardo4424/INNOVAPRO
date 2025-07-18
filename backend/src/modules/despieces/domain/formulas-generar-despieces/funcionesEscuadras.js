// 1. AM.6000 - PLATAFORMA METALICA DE 290x3072mm - E
function calcularAM6000({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 3072 && tipoPlataforma === "ESP"
    ? escuadra === 1 ? 3 : escuadra === 3 ? 9 : 0
    : 0;
}

// 2. AM.6100 - PLATAFORMA METALICA DE 290x2572mm - E
function calcularAM6100({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 2572 && tipoPlataforma === "ESP"
    ? escuadra === 1 ? 3 : escuadra === 3 ? 9 : 0
    : 0;
}

// 3. AM.6200 - PLATAFORMA METALICA DE 290x2072mm - E
function calcularAM6200({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 2072 && tipoPlataforma === "ESP"
    ? escuadra === 1 ? 3 : escuadra === 3 ? 9 : 0
    : 0;
}

// 4. AM.6300 - PLATAFORMA METALICA DE 290x1572mm - E
function calcularAM6300({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 1572 && tipoPlataforma === "ESP"
    ? escuadra === 1 ? 3 : escuadra === 3 ? 9 : 0
    : 0;
}

// 5. AM.6400 - PLATAFORMA METALICA DE 290x1020mm - E
function calcularAM6400({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 1020 && tipoPlataforma === "ESP"
    ? escuadra === 1 ? 3 : escuadra === 3 ? 9 : 0
    : 0;
}

// 6. AM.6500 - PLATAFORMA METALICA DE 290x0732mm - E
function calcularAM6500({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 732 && tipoPlataforma === "ESP"
    ? escuadra === 1 ? 3 : escuadra === 3 ? 9 : 0
    : 0;
}

// 7. AM.6600 - PLATAFORMA METALICA DE 320x3072mm - C
function calcularAM6600({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 3072 && tipoPlataforma === "CHI"
    ? escuadra === 1 ? 2 : escuadra === 3 ? 9 : 0
    : 0;
}

// 8. AM.6700 - PLATAFORMA METALICA DE 320x2572mm - C
function calcularAM6700({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 2572 && tipoPlataforma === "CHI"
    ? escuadra === 1 ? 2 : escuadra === 3 ? 9 : 0
    : 0;
}

// 9. AM.6800 - PLATAFORMA METALICA DE 320x2072mm - C
function calcularAM6800({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 2072 && tipoPlataforma === "CHI"
    ? escuadra === 1 ? 2 : escuadra === 3 ? 9 : 0
    : 0;
}

// 10. AM.6900 - PLATAFORMA METALICA DE 320x1572mm - C
function calcularAM6900({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 1572 && tipoPlataforma === "CHI"
    ? escuadra === 1 ? 2 : escuadra === 3 ? 9 : 0
    : 0;
}

// 11. AM.7000 - PLATAFORMA METALICA DE 320x1090mm - C
function calcularAM7000({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 1090 && tipoPlataforma === "CHI"
    ? escuadra === 1 ? 2 : escuadra === 3 ? 9 : 0
    : 0;
}

// 12. AM.7100 - PLATAFORMA METALICA DE 320x0732mm - C
function calcularAM7100({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 732 && tipoPlataforma === "CHI"
    ? escuadra === 1 ? 2 : escuadra === 3 ? 9 : 0
    : 0;
}

// 13. AM.7200 - PLATAFORMA METALICA DE 190x3072mm - C
function calcularAM7200({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 3072 &&
    ((escuadra === 3 && tipoPlataforma === "ESP") || (escuadra === 1 && tipoPlataforma === "CHI"))
    ? 1 : 0;
}

// 14. AM.7300 - PLATAFORMA METALICA DE 190x2572mm - C
function calcularAM7300({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 2572 &&
    ((escuadra === 3 && tipoPlataforma === "ESP") || (escuadra === 1 && tipoPlataforma === "CHI"))
    ? 1 : 0;
}

// 15. AM.7400 - PLATAFORMA METALICA DE 190x2072mm - C
function calcularAM7400({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 2072 &&
    ((escuadra === 3 && tipoPlataforma === "ESP") || (escuadra === 1 && tipoPlataforma === "CHI"))
    ? 1 : 0;
}

// 16. AM.7410 - PLATAFORMA METALICA DE 190x1572mm - C
function calcularAM7410({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 1572 &&
    ((escuadra === 3 && tipoPlataforma === "ESP") || (escuadra === 1 && tipoPlataforma === "CHI"))
    ? 1 : 0;
}

// 17. AM.7420 - PLATAFORMA METALICA DE 190x1090mm - C
function calcularAM7420({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 1090 &&
    ((escuadra === 3 && tipoPlataforma === "ESP") || (escuadra === 1 && tipoPlataforma === "CHI"))
    ? 1 : 0;
}

// 18. AM.7430 - PLATAFORMA METALICA DE 190x1020mm - C
function calcularAM7430({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 1020 &&
    ((escuadra === 3 && tipoPlataforma === "ESP") || (escuadra === 1 && tipoPlataforma === "CHI"))
    ? 1 : 0;
}

// 19. AM.7440 - PLATAFORMA METALICA DE 190x0732mm - C
function calcularAM7440({ escuadra, tipoPlataforma, longTramo }) {
  return longTramo === 732 &&
    ((escuadra === 3 && tipoPlataforma === "ESP") || (escuadra === 1 && tipoPlataforma === "CHI"))
    ? 1 : 0;
}

// 20. EC.0100 - ESCUADRA DE 3.00 x 2.00m
function calcularEC0100({ escuadra, escuadraReferencia=3, cantidadEscuadrasTramo, sobrecarga, factorSeguridad, longTotal=0 }) {
  if (escuadra === escuadraReferencia && cantidadEscuadrasTramo > 0) {
    console.log('cantidadEscuadrasTramo', cantidadEscuadrasTramo);
    return cantidadEscuadrasTramo;
  }
  if (escuadra === escuadraReferencia && longTotal > 0) {
      console.log('cantidadEscuadrasTramo', cantidadEscuadrasTramo);
    return 1 + Math.ceil(longTotal / (180 / (sobrecarga * factorSeguridad)));
  }
  return 0;
}

// 21. EC.0300 - ESCUADRA DE 1.00 x 1.00m - PERFIL DOBLE
function calcularEC0300({ escuadra, escuadraReferencia=1, cantidadEscuadrasTramo, longTotal=0, sobrecarga }) {
  if (escuadra === escuadraReferencia) {
    if (cantidadEscuadrasTramo > 0) {
      return cantidadEscuadrasTramo;
    } else if (longTotal > 0) {
      return 1 + Math.ceil(longTotal / (250 / sobrecarga));
    }
  }
  return 0;
}

// 22. EC.0800 - BALAUSTRE DE 1.20m
function calcularEC0800(valorCalcularEC0100) {
  return valorCalcularEC0100;
}

// 23. CON.0200 - PERNOS DE EXPANSION - M16 x 145
function calcularCON0200({ escuadra, tipoAnclaje, valorCalcularEC0800, valorCalcularEC0300 }) {
  if (escuadra === 3 && tipoAnclaje === "ESPARRAGO") return "ERROR";
  let total = 0;
  if (escuadra === 3 && tipoAnclaje !== "ESPARRAGO") total += valorCalcularEC0800 * 6;
  if (escuadra === 1 && tipoAnclaje === "PERNO") total += valorCalcularEC0300 * 2;
  return total;
}

// 24. CON.0300 - PERNO HEXAGONAL PARA BALAUSTRE - M8 x 70 - G.5.8
function calcularCON0300(valorCalcularEC0800) {
  return valorCalcularEC0800;
}

// 25. EN.0310 - BARRA ROSCADA D=15 - 1.50m
function calcularEN0310({ escuadra, tipoAnclaje, valorCalcularEC0300 }) {
  
  if (escuadra === 1 && tipoAnclaje === "ESPARRAGO") {
    return valorCalcularEC0300 * 2;
  }
  return 0;
}

// 26. EN.0400 - TUERCA D=15mm
function calcularEN0400(valorCalcularEN0310) {
  return valorCalcularEN0310;
}

module.exports = { 
    calcularAM6000,
    calcularAM6100,
    calcularAM6200,
    calcularAM6300,
    calcularAM6400,
    calcularAM6500,
    calcularAM6600,
    calcularAM6700,
    calcularAM6800,
    calcularAM6900,
    calcularAM7000,
    calcularAM7100,
    calcularAM7200,
    calcularAM7300,
    calcularAM7400,
    calcularAM7410,
    calcularAM7420,
    calcularAM7430,
    calcularAM7440,
    calcularEC0100,
    calcularEC0300,
    calcularEC0800,
    calcularCON0200,
    calcularCON0300,
    calcularEN0310,
    calcularEN0400
}
