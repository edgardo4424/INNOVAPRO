// 1. Pieza: AM.0100 - HUSILO DE NIVELACION
export function calcularHusilloDeNivelacion({ longitud, cantidadAndamios, tipoApoyo }) {
  if (tipoApoyo === "GARRUCHA") return 0;
  if (longitud > 0 && cantidadAndamios === 1 && tipoApoyo === "HUSILLOS") return 4;
  if (longitud > 0 && cantidadAndamios > 1) return tipoApoyo === "" ? 0 : 2;
  return 0;
}

// 2. Pieza: AM.0200 - GARRUCHA CON FRENO DE 8" - ROJO
export function calcularGarruchaConFreno({ longitud, cantidadAndamios, tipoApoyo }) {
  if (tipoApoyo === "HUSILLOS") return 0;
  if (longitud > 0 && cantidadAndamios === 1 && tipoApoyo === "GARRUCHA") return 4;
  if (longitud > 0 && cantidadAndamios > 1) return tipoApoyo === "" ? 0 : 2;
  return 0;
}

// 3. Pieza: AM.0300 - PIEZA DE INICIO
export function calcularPiezaInicio(valor1, valor2) {
    return valor1 + valor2;
  }

// 4. Pieza: AM.0600 - VERTICAL 3.00m
export function calcularVertical300() {
  return 0;
}

// 5. Pieza: AM.0700 - VERTICAL 2.00m
export function calcularVertical200({ longitud, cantidadAndamios, altura }) {
    const esPar = (x) => x % 2 === 0;

    if (longitud > 0 && cantidadAndamios === 1) {
      return esPar(altura) ? altura * 2 : (altura + 1) * 2;
    } else if (longitud > 0 && cantidadAndamios > 1) {
      return esPar(altura) ? altura : altura + 1;
    }
  
    return 0;
}

// 6. Pieza: AM.0900 - VERTICAL 1.50m
export function calcularVertical150() {
  return 0;
}

// 7. Pieza: AM.1000 - VERTICAL 1.00m
export function calcularVertical100({ longitud, cantidadAndamios, altura, ancho, cantPlataforma }) {
    const esPar = x => x % 2 === 0;
  
    if (altura === "" || altura === null || altura === undefined) return 0;
  
    let parte1 = 0;
    if (longitud > 0 && cantidadAndamios === 1) {
      parte1 = esPar(altura) ? 4 : 0;
    } else if (longitud > 0 && cantidadAndamios > 1) {
      parte1 = esPar(altura) ? 2 : 0;
    }
  
    let parte2 = 0;
    if (ancho !== 732 && cantPlataforma === "ARRIBA" && longitud > 0 && cantidadAndamios === 1) {
      parte2 = esPar(altura) ? altura - 2 : altura - 1;
    }
  
    return parte1 + parte2;
  }
  

// 8. Pieza: AM.1100 - VERTICAL 0.50m
export function calcularVertical050() {
    return 0;
}

// 9. Pieza: AM.1150 - ESPIGA

// { calcularVertical200, calcularVertical150, calcularVertical100, calcularVertical050, calcularMensula1090, calcularMensula700, calcularMensula300, calcularAcopladorMulti }

export function calcularEspiga(valorCalcularVertical200, valorCalcularVertical150, valorCalcularVertical100, valorCalcularVertical050, valorCalcularMensula1090, valorCalcularMensula700, valorCalcularMensula300, valorCalcularAcopladorMulti) {
    return valorCalcularVertical200 + valorCalcularVertical150 + valorCalcularVertical100 + valorCalcularVertical050 + valorCalcularMensula1090+ valorCalcularMensula700 + valorCalcularMensula300 + valorCalcularAcopladorMulti;
}

// 10. Pieza: AM.1300 - HORIZONTAL MULTI DE 3072mm
export function calcularHorizontalMulti3072({ datosHorizontalMulti3072=3072, longitud, ancho, altura, plataformaAcceso, cantPlataforma, cantidadAndamios }) {
    const esPar = x => x % 2 === 0;
    let total = 0;
  
    // Parte 1: Si la pieza coincide con la longitud
    if (datosHorizontalMulti3072 === longitud) {
      if (cantPlataforma === "TODO" || (cantPlataforma === "ARRIBA" && plataformaAcceso === "SI")) {
        total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 5;
      } else if (cantPlataforma === "ARRIBA" && plataformaAcceso === "NO") {
        total += esPar(altura) ? altura + 6 : altura + 7;
      }
    }
  
    // Parte 2: Si la pieza coincide con el ancho
    if (datosHorizontalMulti3072 === ancho) {
      if (cantPlataforma === "TODO") {
        if (longitud > 0 && cantidadAndamios === 1) {
          total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 7;
        } else if (longitud > 0 && cantidadAndamios > 1) {
          total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
        }
      } else if (cantPlataforma === "ARRIBA") {
        if (longitud > 0 && cantidadAndamios === 1) {
          total += esPar(altura) ? altura + 6 : altura + 9;
        } else if (longitud > 0 && cantidadAndamios > 1) {
          total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
        }
      }
    }
  
    return total;
  }
  

// 11. Pieza: AM.1400 - HORIZONTAL MULTI DE 2572mm
export function calcularHorizontalMulti2572({ datosHorizontalMulti2572=2572, longitud, ancho, altura, cantPlataforma, plataformaAcceso, cantidadAndamios }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (datosHorizontalMulti2572 === longitud) {
        if (cantPlataforma === "TODO" || (cantPlataforma === "ARRIBA" && plataformaAcceso === "SI")) {
            total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 5;
        } else if (cantPlataforma === "ARRIBA" && plataformaAcceso === "NO") {
            total += esPar(altura) ? altura + 6 : altura + 7;
        }
    }

    if (datosHorizontalMulti2572 === ancho) {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 7;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura + 6 : altura + 9;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
            }
        }
    }

    return total;
}
// !OJO
// 12. Pieza: AM.1500 - HORIZONTAL MULTI DE 2072mm

export function calcularHorizontalMulti2072({ datosHorizontalMulti2072=2072, longitud, ancho, altura, cantPlataforma, plataformaAcceso, cantidadAndamios }) {
    
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (datosHorizontalMulti2072 === longitud) {
        if (cantPlataforma === "TODO" || (cantPlataforma === "ARRIBA" && plataformaAcceso === "SI")) {
            total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 5;
        } else if (cantPlataforma === "ARRIBA" && plataformaAcceso === "NO") {
            total += esPar(altura) ? altura + 6 : altura + 7;
        }
    }

    if (datosHorizontalMulti2072 === ancho) {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 7;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura + 6 : altura + 9;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
            }
        }
    }

    return total;
}

// 13. Pieza: AM.1600 - HORIZONTAL MULTI DE 1572mm
export function calcularHorizontalMulti1572({ datosHorizontalMulti1572=1572, longitud, ancho, altura, cantPlataforma, plataformaAcceso, cantidadAndamios }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (datosHorizontalMulti1572 === longitud) {
        if (cantPlataforma === "TODO" || (cantPlataforma === "ARRIBA" && plataformaAcceso === "SI")) {
            total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 5;
        } else if (cantPlataforma === "ARRIBA" && plataformaAcceso === "NO") {
            total += esPar(altura) ? altura + 6 : altura + 7;
        }
    }

    if (datosHorizontalMulti1572 === ancho) {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 7;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura + 6 : altura + 9;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
            }
        }
    }

    return total;
}

// 14. Pieza: AM.1800 - HORIZONTAL MULTI DE 1090mm
export function calcularHorizontalMulti1090({ datosHorizontalMulti1090=1090, longitud, ancho, altura, cantPlataforma, plataformaAcceso, cantidadAndamios }) {
    const esPar = x => x % 2 === 0;
  let total = 0;

  // Parte 1: pieza == longitud
  if (datosHorizontalMulti1090 === longitud) {
    if (cantPlataforma === "TODO" || (cantPlataforma === "ARRIBA" && plataformaAcceso === "SI")) {
      total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 5;
    } else if (cantPlataforma === "ARRIBA" && plataformaAcceso === "NO") {
      total += esPar(altura) ? altura + 6 : altura + 7;
    }
  }

  // Parte 2: pieza == ancho
  if (datosHorizontalMulti1090 === ancho) {
    if (cantPlataforma === "TODO") {
      if (longitud > 0 && cantidadAndamios === 1) {
        total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 7;
      } else if (longitud > 0 && cantidadAndamios > 1) {
        total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
      }
    } else if (cantPlataforma === "ARRIBA") {
      if (longitud > 0 && cantidadAndamios === 1) {
        total += esPar(altura) ? altura + 6 : altura + 9;
      } else if (longitud > 0 && cantidadAndamios > 1) {
        total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
      }
    }
  }

  return total;
}

// 15. Pieza: AM.1900 - HORIZONTAL MULTI DE 1020mm
export function calcularHorizontalMulti1020() { return 0; }

// 16. Pieza: AM.2000 - HORIZONTAL MULTI DE 0732mm
export function calcularHorizontalMulti0732({ datosHorizontalMulti0732=732, longitud, ancho, altura, cantPlataforma, plataformaAcceso, cantidadAndamios }) {
    const esPar = x => x % 2 === 0;
    let total = 0;
  
    // Bloque 1
    if (datosHorizontalMulti0732 === longitud) {
      if (cantPlataforma === "TODO" || (cantPlataforma === "ARRIBA" && plataformaAcceso === "SI")) {
        total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 5;
      } else if (cantPlataforma === "ARRIBA" && plataformaAcceso === "NO") {
        total += esPar(altura) ? altura + 6 : altura + 7;
      }
    }
  
    // Bloque 2
    if (datosHorizontalMulti0732 === ancho) {
      if (cantPlataforma === "TODO") {
        if (longitud > 0 && cantidadAndamios === 1) {
          total += esPar(altura) ? 3 * altura + 2 : 3 * altura + 7;
        } else if (longitud > 0 && cantidadAndamios > 1) {
          total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
        }
      } else if (cantPlataforma === "ARRIBA") {
        if (longitud > 0 && cantidadAndamios === 1) {
          total += esPar(altura) ? altura + 6 : altura + 9;
        } else if (longitud > 0 && cantidadAndamios > 1) {
          total += esPar(altura) ? 0.5 * altura + 1 : 0.5 * altura + 1.5;
        }
      }
    }
  
    // Bloque 3
    if (plataformaAcceso === "SI" && cantPlataforma === "ARRIBA") {
      if (longitud > 0 && cantidadAndamios === 1) {
        total += esPar(altura) ? 2 * altura - 4 : 2 * altura - 2;
      } else if (longitud > 0 && cantidadAndamios > 1) {
        total += esPar(altura) ? altura - 2 : altura - 1;
      }
    }
  
    return total;
}

// 17. Pieza: AM.2020 - HORIZONTAL MULTI DE 0432mm PARA MENSULA - N
export function calcularHorizontalMulti0432MensulaN() { return 0; }

// 18. Pieza: AM.2050 - HORIZONTAL MULTI DE 0432mm PARA MENSULA - E
export function calcularHorizontalMulti0432MensulaE() { return 0; }

// 19. Pieza: AM.2800 - BARANDILLAS COMBI 3072mm
export function calcularBarandillaCombi3072() { return 0; }

// 20. Pieza: AM.2900 - BARANDILLAS COMBI 2072mm
export function calcularBarandillaCombi2072() { return 0; }

// 21. Pieza: AM.3000 - BARANDILLAS COMBI 0732mm 
export function calcularBarandillaCombi0732() { return 0; }

// 22. Pieza: AM.3100 - MENSULA 1090mm
export function calcularMensula1090() { return 0; }

// 23. Pieza: AM.3200 - MENSULA 700mm
export function calcularMensula700() { return 0; }

// 24. Pieza: AM.3300 - MENSULA 300mm
export function calcularMensula300() { return 0; }

// 25. Pieza: AM.3400 - RODAPIE 3072mm - E
export function calcularRodapie3072E() { return 0; }

// 26. Pieza: AM.3500 - RODAPIE 2572mm - E
export function calcularRodapie2572E() { return 0; }

// 27. Pieza: AM.3600 - RODAPIE 2072mm - E
export function calcularRodapie2072E() { return 0; }

// 28. Pieza: AM.3700 - RODAPIE 1020mm - E
export function calcularRodapie1020E() { return 0; }

// 29. Pieza: AM.3800 - RODAPIE 0732mm - E
export function calcularRodapie0732E() { return 0; }

// 30. Pieza: AM.3900 - RODAPIE 3072mm - C
export function calcularRodapie3072C({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie3072C=3072 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie3072C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie3072C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 31. Pieza: AM.4000 - RODAPIE 2572mm - C
export function calcularRodapie2572C({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie2572C=2572 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie2572C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie2572C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 32. Pieza: AM.4100 - RODAPIE 2072mm - C
export function calcularRodapie2072C({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie2072C=2072 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie2072C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie2072C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 33. Pieza: AM.4200 - RODAPIE 1572mm - C
export function calcularRodapie1572C({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie1572C=1572 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie1572C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie1572C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 34. Pieza: AM.4300 - RODAPIE 1090mm - C
export function calcularRodapie1090C({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie1090C=1090 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie1090C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie1090C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 35. Pieza: AM.4400 - RODAPIE 0732mm - C
export function calcularRodapie0732C({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie0732C=732 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie0732C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie0732C && tipoRodapie === "CHI") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 36. Pieza: AM.4500 - RODAPIE 3072mm - N
export function calcularRodapie3072N({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie3072N=3072 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie3072N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie3072N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 37. Pieza: AM.4600 - RODAPIE 2572mm - N
export function calcularRodapie2572N({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie2572N=2572 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie2572N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie2572N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 38. Pieza: AM.4700 - RODAPIE 2072mm - N
export function calcularRodapie2072N({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie2072N=2072 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie2072N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie2072N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 39. Pieza: AM.4800 - RODAPIE 1572mm - N
export function calcularRodapie1572N({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie1572N=1572 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie1572N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie1572N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 40. Pieza: AM.4900 - RODAPIE 1090mm - N
export function calcularRodapie1090N({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie1090N=1090 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie1090N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie1090N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 41. Pieza: AM.5000 - RODAPIE 0732mm - N
export function calcularRodapie0732N({ longitud, ancho, altura, cantPlataforma, tipoRodapie, cantidadAndamios, datosRodapie0732N=732 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosRodapie0732N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            total += esPar(altura) ? altura : altura + 1;
        } else if (cantPlataforma === "ARRIBA") {
            total += 2;
        }
    }

    if (ancho === datosRodapie0732N && tipoRodapie === "NEO") {
        if (cantPlataforma === "TODO") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            }
        } else if (cantPlataforma === "ARRIBA") {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += 2;
            }
        }
    }

    return total;
}

// 42. Pieza: AM.5100 - DIAGONAL DE 3072mm
export function calcularDiagonal3072({ longitud, ancho, altura, cantidadAndamios, datosDiagonal3072=3072 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosDiagonal3072) {
        if (altura > 0) {
            total += esPar(altura) ? altura : altura + 1;
        }
    }

    if (ancho === datosDiagonal3072) {
        if (altura > 0) {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
            }
        }
    }

    return total;
}

// 43. Pieza: AM.5200 - DIAGONAL DE 2572mm
export function calcularDiagonal2572({ longitud, ancho, altura, cantidadAndamios, datosDiagonal2572=2572 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosDiagonal2572) {
        if (altura > 0) {
            total += esPar(altura) ? altura : altura + 1;
        }
    }

    if (ancho === datosDiagonal2572) {
        if (altura > 0) {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
            }
        }
    }

    return total;
}

// 44. Pieza: AM.5300 - DIAGONAL DE 2072mm
export function calcularDiagonal2072({ longitud, ancho, altura, cantidadAndamios, datosDiagonal2072=2072 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosDiagonal2072) {
        if (altura > 0) {
            total += esPar(altura) ? altura : altura + 1;
        }
    }

    if (ancho === datosDiagonal2072) {
        if (altura > 0) {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
            }
        }
    }

    return total;
}

// 45. Pieza: AM.5400 - DIAGONAL DE 1572mm
export function calcularDiagonal1572({ longitud, ancho, altura, cantidadAndamios, datosDiagonal1572=1572 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosDiagonal1572) {
        if (altura > 0) {
            total += esPar(altura) ? altura : altura + 1;
        }
    }

    if (ancho === datosDiagonal1572) {
        if (altura > 0) {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
            }
        }
    }

    return total;
}

// 46. Pieza: AM.5500 - DIAGONAL DE 1090mm
export function calcularDiagonal1090({ longitud, ancho, altura, cantidadAndamios, datosDiagonal1090=1090 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosDiagonal1090) {
        if (altura > 0) {
            total += esPar(altura) ? altura : altura + 1;
        }
    }

    if (ancho === datosDiagonal1090) {
        if (altura > 0) {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
            }
        }
    }

    return total;
}

// 47. Pieza: AM.5600 - DIAGONAL DE 1020mm
export function calcularDiagonal1020({ longitud, ancho, altura, cantidadAndamios, datosDiagonal1020=1020 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosDiagonal1020) {
        if (altura > 0) {
            total += esPar(altura) ? altura : altura + 1;
        }
    }

    if (ancho === datosDiagonal1020) {
        if (altura > 0) {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? altura : altura + 1;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
            }
        }
    }

    return total;
}

// 48. Pieza: AM.6000 - PLATAFORMA METALICA DE 290x3072mm - E
export function calcularPlataformaMetalica290x3072E({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica290x3072E=3072 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica290x3072E || tipoPlataforma !== "ESP") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 3, 2072: 4, 2572: 6, 3072: 8 }
        : { 732: 2, 1090: 3, 1572: 5, 2072: 6, 2572: 8, 3072: 10 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 49. Pieza: AM.6100 - PLATAFORMA METALICA DE 290x2572mm - E
export function calcularPlataformaMetalica290x2572E({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica290x2572E=2572 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica290x2572E || tipoPlataforma !== "ESP") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 3, 2072: 4, 2572: 6, 3072: 8 }
        : { 732: 2, 1090: 3, 1572: 5, 2072: 6, 2572: 8, 3072: 10 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 50. Pieza: AM.6200 - PLATAFORMA METALICA DE 290x2072mm - E
export function calcularPlataformaMetalica290x2072E({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica290x2072E=2072 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica290x2072E || tipoPlataforma !== "ESP") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 3, 2072: 4, 2572: 6, 3072: 8 }
        : { 732: 2, 1090: 3, 1572: 5, 2072: 6, 2572: 8, 3072: 10 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 51. Pieza: AM.6300 - PLATAFORMA METALICA DE 290x1572mm - E
export function calcularPlataformaMetalica290x1572E({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica290x1572E=1572 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica290x1572E || tipoPlataforma !== "ESP") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 3, 2072: 4, 2572: 6, 3072: 8 }
        : { 732: 2, 1090: 3, 1572: 5, 2072: 6, 2572: 8, 3072: 10 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 52. Pieza: AM.6400 - PLATAFORMA METALICA DE 290x1020mm - E
export function calcularPlataformaMetalica290x1020E({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica290x1020E=1020 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica290x1020E || tipoPlataforma !== "ESP") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 3, 2072: 4, 2572: 6, 3072: 8 }
        : { 732: 2, 1090: 3, 1572: 5, 2072: 6, 2572: 8, 3072: 10 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 53. Pieza: AM.6500 - PLATAFORMA METALICA DE 290x0732mm - E
export function calcularPlataformaMetalica290x0732E({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica290x0732E=732 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica290x0732E || tipoPlataforma !== "ESP") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 3, 2072: 4, 2572: 6, 3072: 8 }
        : { 732: 2, 1090: 3, 1572: 5, 2072: 6, 2572: 8, 3072: 10 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 54. Pieza: AM.6600 - PLATAFORMA METALICA DE 320x3072mm - C
export function calcularPlataformaMetalica320x3072C({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica320x3072C=3072 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica320x3072C || tipoPlataforma !== "CHI") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 2, 2072: 4, 2572: 5, 3072: 7 }
        : { 732: 2, 1090: 3, 1572: 4, 2072: 6, 2572: 7, 3072: 9 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 55. Pieza: AM.6700 - PLATAFORMA METALICA DE 320x2572mm - C
export function calcularPlataformaMetalica320x2572C({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica320x2572C=2572 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica320x2572C || tipoPlataforma !== "CHI") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 2, 2072: 4, 2572: 5, 3072: 7 }
        : { 732: 2, 1090: 3, 1572: 4, 2072: 6, 2572: 7, 3072: 9 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 56. Pieza: AM.6800 - PLATAFORMA METALICA DE 320x2072mm - C
export function calcularPlataformaMetalica320x2072C({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica320x2072C=2072 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica320x2072C || tipoPlataforma !== "CHI") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 2, 2072: 4, 2572: 5, 3072: 7 }
        : { 732: 2, 1090: 3, 1572: 4, 2072: 6, 2572: 7, 3072: 9 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 57. Pieza: AM.6900 - PLATAFORMA METALICA DE 320x1572mm - C
export function calcularPlataformaMetalica320x1572C({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica320x1572C=1572 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica320x1572C || tipoPlataforma !== "CHI") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 2, 2072: 4, 2572: 5, 3072: 7 }
        : { 732: 2, 1090: 3, 1572: 4, 2072: 6, 2572: 7, 3072: 9 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 58. Pieza: AM.7000 - PLATAFORMA METALICA DE 320x1090mm - C
export function calcularPlataformaMetalica320x1090C({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica320x1090C=1090 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica320x1090C || tipoPlataforma !== "CHI") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 2, 2072: 4, 2572: 5, 3072: 7 }
        : { 732: 2, 1090: 3, 1572: 4, 2072: 6, 2572: 7, 3072: 9 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 59. Pieza: AM.7100 - PLATAFORMA METALICA DE 320x0732mm - C
export function calcularPlataformaMetalica320x0732C({ longitud, tipoPlataforma, plataformaAcceso, cantPlataforma, altura, ancho, datosPlataformaMetalica320x0732C=732 }) {
    const esPar = x => x % 2 === 0;
    if (longitud !== datosPlataformaMetalica320x0732C || tipoPlataforma !== "CHI") return 0;
    
    let acceso = plataformaAcceso === "SI" ? 2 : 0;
    let multiplicador = 0;

    if (cantPlataforma === "TODO") {
        multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
    } else if (cantPlataforma === "ARRIBA") {
        multiplicador = 1;
    }

    const lookup = plataformaAcceso === "SI" 
        ? { 732: 0, 1090: 1, 1572: 2, 2072: 4, 2572: 5, 3072: 7 }
        : { 732: 2, 1090: 3, 1572: 4, 2072: 6, 2572: 7, 3072: 9 };
    
    const factor = lookup[ancho] ?? 0;

    return acceso + multiplicador * factor;
}

// 60. Pieza: AM.7200 - PLATAFORMA METALICA DE 190x3072mm - C
export function calcularPlataformaMetalica190x3072C({ longitud, tipoPlataforma, cantPlataforma, altura, ancho, datosPlataformaMetalica190x3072C=3072 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosPlataformaMetalica190x3072C) {
        let multiplicador = 0;
        if (cantPlataforma === "TODO") {
            multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
        } else if (cantPlataforma === "ARRIBA") {
            multiplicador = 1;
        }

        if (tipoPlataforma === "CHI") {
            const lookupCHI = { 732: 0, 1090: 0, 1572: 1, 2072: 0, 2572: 1, 3072: 0 };
            total += multiplicador * (lookupCHI[ancho] ?? 0);
        }
        if (tipoPlataforma === "ESP") {
            const lookupESP = { 732: 0, 1090: 0, 1572: 0, 2072: 1, 2572: 0, 3072: 0 };
            total += multiplicador * (lookupESP[ancho] ?? 0);
        }
    }

    return total;
}

// 61. Pieza: AM.7300 - PLATAFORMA METALICA DE 190x2572mm - C
export function calcularPlataformaMetalica190x2572C({ longitud, tipoPlataforma, cantPlataforma, altura, ancho, datosPlataformaMetalica190x2572C=2572 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosPlataformaMetalica190x2572C) {
        let multiplicador = 0;
        if (cantPlataforma === "TODO") {
            multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
        } else if (cantPlataforma === "ARRIBA") {
            multiplicador = 1;
        }

        if (tipoPlataforma === "CHI") {
            const lookupCHI = { 732: 0, 1090: 0, 1572: 1, 2072: 0, 2572: 1, 3072: 0 };
            total += multiplicador * (lookupCHI[ancho] ?? 0);
        }
        if (tipoPlataforma === "ESP") {
            const lookupESP = { 732: 0, 1090: 0, 1572: 0, 2072: 1, 2572: 0, 3072: 0 };
            total += multiplicador * (lookupESP[ancho] ?? 0);
        }
    }

    return total;
}

// 62. Pieza: AM.7400 - PLATAFORMA METALICA DE 190x2072mm - C
export function calcularPlataformaMetalica190x2072C({ longitud, tipoPlataforma, cantPlataforma, altura, ancho, datosPlataformaMetalica190x2072C=2072 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosPlataformaMetalica190x2072C) {
        let multiplicador = 0;
        if (cantPlataforma === "TODO") {
            multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
        } else if (cantPlataforma === "ARRIBA") {
            multiplicador = 1;
        }

        if (tipoPlataforma === "CHI") {
            const lookupCHI = { 732: 0, 1090: 0, 1572: 1, 2072: 0, 2572: 1, 3072: 0 };
            total += multiplicador * (lookupCHI[ancho] ?? 0);
        }
        if (tipoPlataforma === "ESP") {
            const lookupESP = { 732: 0, 1090: 0, 1572: 0, 2072: 1, 2572: 0, 3072: 0 };
            total += multiplicador * (lookupESP[ancho] ?? 0);
        }
    }

    return total;
}

// 63. Pieza: AM.7410 - PLATAFORMA METALICA DE 190x1572mm - C
export function calcularPlataformaMetalica190x1572C({ longitud, tipoPlataforma, cantPlataforma, altura, ancho, datosPlataformaMetalica190x1572C=1572 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosPlataformaMetalica190x1572C) {
        let multiplicador = 0;
        if (cantPlataforma === "TODO") {
            multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
        } else if (cantPlataforma === "ARRIBA") {
            multiplicador = 1;
        }

        if (tipoPlataforma === "CHI") {
            const lookupCHI = { 732: 0, 1090: 0, 1572: 1, 2072: 0, 2572: 1, 3072: 0 };
            total += multiplicador * (lookupCHI[ancho] ?? 0);
        }
        if (tipoPlataforma === "ESP") {
            const lookupESP = { 732: 0, 1090: 0, 1572: 0, 2072: 1, 2572: 0, 3072: 0 };
            total += multiplicador * (lookupESP[ancho] ?? 0);
        }
    }

    return total;
}

// 64. Pieza: AM.7420 - PLATAFORMA METALICA DE 190x1090mm - C
export function calcularPlataformaMetalica190x1090C({ longitud, tipoPlataforma, cantPlataforma, altura, ancho, datosPlataformaMetalica190x1090C=1090 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosPlataformaMetalica190x1090C) {
        let multiplicador = 0;
        if (cantPlataforma === "TODO") {
            multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
        } else if (cantPlataforma === "ARRIBA") {
            multiplicador = 1;
        }

        if (tipoPlataforma === "CHI") {
            const lookupCHI = { 732: 0, 1090: 0, 1572: 1, 2072: 0, 2572: 1, 3072: 0 };
            total += multiplicador * (lookupCHI[ancho] ?? 0);
        }
        if (tipoPlataforma === "ESP") {
            const lookupESP = { 732: 0, 1090: 0, 1572: 0, 2072: 1, 2572: 0, 3072: 0 };
            total += multiplicador * (lookupESP[ancho] ?? 0);
        }
    }

    return total;
}

// 65. Pieza: AM.7430 - PLATAFORMA METALICA DE 190x1020mm - C
export function calcularPlataformaMetalica190x1020C({ longitud, tipoPlataforma, cantPlataforma, altura, ancho, datosPlataformaMetalica190x1020C=1020 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosPlataformaMetalica190x1020C) {
        let multiplicador = 0;
        if (cantPlataforma === "TODO") {
            multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
        } else if (cantPlataforma === "ARRIBA") {
            multiplicador = 1;
        }

        if (tipoPlataforma === "CHI") {
            const lookupCHI = { 732: 0, 1090: 0, 1572: 1, 2072: 0, 2572: 1, 3072: 0 };
            total += multiplicador * (lookupCHI[ancho] ?? 0);
        }
        if (tipoPlataforma === "ESP") {
            const lookupESP = { 732: 0, 1090: 0, 1572: 0, 2072: 1, 2572: 0, 3072: 0 };
            total += multiplicador * (lookupESP[ancho] ?? 0);
        }
    }

    return total;
}

// 66. Pieza: AM.7440 - PLATAFORMA METALICA DE 190x0732mm - C
export function calcularPlataformaMetalica190x0732C({ longitud, tipoPlataforma, cantPlataforma, altura, ancho, datosPlataformaMetalica190x0732C=732 }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (longitud === datosPlataformaMetalica190x0732C) {
        let multiplicador = 0;
        if (cantPlataforma === "TODO") {
            multiplicador = esPar(altura) ? 0.5 * altura : 0.5 * altura + 0.5;
        } else if (cantPlataforma === "ARRIBA") {
            multiplicador = 1;
        }

        if (tipoPlataforma === "CHI") {
            const lookupCHI = { 732: 0, 1090: 0, 1572: 1, 2072: 0, 2572: 1, 3072: 0 };
            total += multiplicador * (lookupCHI[ancho] ?? 0);
        }
        if (tipoPlataforma === "ESP") {
            const lookupESP = { 732: 0, 1090: 0, 1572: 0, 2072: 1, 2572: 0, 3072: 0 };
            total += multiplicador * (lookupESP[ancho] ?? 0);
        }
    }

    return total;
}

// 67. Pieza: AM.7450 - PLATAFORMA DE ALUMINIO C/ ACCESO DE 3072mm (INC. ESCALERA)
export function calcularPlataformaAluminioAcceso3072({ plataformaAcceso, longitud, altura, datosPlataformaAluminioAcceso3072=3072 }) {
    const esPar = x => x % 2 === 0;
    if (plataformaAcceso === "SI" && longitud === datosPlataformaAluminioAcceso3072) {
        return esPar(altura) ? 0.5 * altura : 0.5 * altura - 0.5;
    }
    return 0;
}

// 68. Pieza: AM.7451 - PLATAFORMA DE ALUMINIO C/ ACCESO DE 2572mm (INC. ESCALERA)
export function calcularPlataformaAluminioAcceso2572({ plataformaAcceso, longitud, altura, datosPlataformaAluminioAcceso2572=2572 }) {
    const esPar = x => x % 2 === 0;
    if (plataformaAcceso === "SI" && longitud === datosPlataformaAluminioAcceso2572) {
        return esPar(altura) ? 0.5 * altura : 0.5 * altura - 0.5;
    }
    return 0;
}

// 69. Pieza: AM.7452 - PLATAFORMA DE ALUMINIO C/ ACCESO DE 2072mm (INC. ESCALERA)
export function calcularPlataformaAluminioAcceso2072({ plataformaAcceso, longitud, altura, datosPlataformaAluminioAcceso2072=2072 }) {
    const esPar = x => x % 2 === 0;
    if (plataformaAcceso === "SI" && longitud === datosPlataformaAluminioAcceso2072) {
        return esPar(altura) ? 0.5 * altura : 0.5 * altura - 0.5;
    }
    return 0;
}

// 70. Pieza: AM.7453 - PLATAFORMA DE ALUMINIO C/ ACCESO DE 1572mm (INC. ESCALERA)
export function calcularPlataformaAluminioAcceso1572({ plataformaAcceso, longitud, altura, datosPlataformaAluminioAcceso1572=1572 }) {
    const esPar = x => x % 2 === 0;
    if (plataformaAcceso === "SI" && longitud === datosPlataformaAluminioAcceso1572) {
        return esPar(altura) ? 0.5 * altura : 0.5 * altura - 0.5;
    }
    return 0;
}

// 71. Pieza: AM.7900 - PLATAFORMA MIXTA CON ACCESO DE 3072mm 
export function calcularPlataformaMixtaAcceso3072() { return 0; }

// 72. Pieza: AM.8000 - PLATAFORMA MIXTA CON ACCESO DE 2572mm
export function calcularPlataformaMixtaAcceso2572() { return 0; }

// 73. Pieza: AM.8500 - TUBO CON GANCHO 1.00m
export function calcularTuboGancho100({ tuboAmarre, longitud, cantidadAndamios, altura, datosTuboGancho100=1.0 }) {
    if (datosTuboGancho100 !== tuboAmarre) return 0;
    const ceil = x => Math.ceil(x);
    if (longitud > 0 && cantidadAndamios === 1) {
        return 2 * ceil(altura / 3);
    } else if (longitud > 0 && cantidadAndamios > 1) {
        return ceil(altura / 3);
    }
    return 0;
}
// 74. Pieza: AM.8600 - TUBO CON GANCHO 0.50m
export function calcularTuboGancho050({ tuboAmarre, longitud, cantidadAndamios, altura, datosTuboGancho050=0.5 }) {
    if (datosTuboGancho050 !== tuboAmarre) return 0;
    const ceil = x => Math.ceil(x);
    if (longitud > 0 && cantidadAndamios === 1) {
        return 2 * ceil(altura / 3);
    } else if (longitud > 0 && cantidadAndamios > 1) {
        return ceil(altura / 3);
    }
    return 0;
}

// 75. Pieza: AM.8800 - BRIDA GIRATORIA
export function calcularBridaGiratoria(valorCalcularTuboGancho100, valorCalcularTuboGancho050) {
    return valorCalcularTuboGancho100 + valorCalcularTuboGancho050;
}

// 76. Pieza: AM.8900 - BRIDA FIJA
export function calcularBridaFija() {
    return 0;
}

// 77. Pieza: AM.9000 - ACOPLADOR MULTI
export function calcularAcopladorMulti({ ancho, cantPlataforma, longitud, cantidadAndamios, altura }) {
    const esPar = x => x % 2 === 0;
    if (ancho === 732 || cantPlataforma === "TODO") return 0;
    if (cantPlataforma === "ARRIBA" && longitud > 0 && cantidadAndamios === 1) {
        return esPar(altura) ? altura - 2 : altura - 1;
    }
    return 0;
}

// 78. Pieza: AM.9100 - CONECTOR PARA SUSPENSION
export function calcularConectorSuspension() {
    return 0;
}

// 79. Pieza: AM.9200 - PIN GRAVEDAD 12mm 
export function calcularPinGravedad12mm() { return 0; }

// 80. Pieza: AM.9300 - PIN GRAVEDAD 9mm 
export function calcularPinGravedad9mm({ paraIzaje, altura, longitud, cantidadAndamios, ancho, cantPlataforma }) {
    const esPar = x => x % 2 === 0;
    let total = 0;

    if (paraIzaje === "SI") {
        if (altura > 0) {
            if (longitud > 0 && cantidadAndamios === 1) {
                total += esPar(altura) ? 2 * altura : 2 * altura - 2;
            } else if (longitud > 0 && cantidadAndamios > 1) {
                total += esPar(altura) ? altura : altura - 1;
            }
        }
    }

    if (ancho !== 732 && cantPlataforma === "ARRIBA") {
        if (longitud > 0 && cantidadAndamios === 1) {
            total += esPar(altura) ? altura - 2 : altura - 1;
        }
    }

    return total;
}

// 81. Pieza: CON.0100 - PERNOS DE EXPANSION C/ ARGOLLA - M12 x 80
export function calcularPernosExpansionArgolla(cantidadAndamios, valorCalcularTuboGancho100, valorCalcularTuboGancho050) {
    if(cantidadAndamios == 1){
        return valorCalcularTuboGancho100 + valorCalcularTuboGancho050;
    }else{
        return valorCalcularTuboGancho050
    }
   
}
// 82. Pieza: CON.0200 - PERNOS DE EXPANSION - M16 x 145
export function calcularPernosExpansion() { return 0; }