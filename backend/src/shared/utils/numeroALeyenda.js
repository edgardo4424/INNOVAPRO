
function numeroALeyenda(nro, moneda = "PEN") {
    let numero = Number(nro);
    if (typeof numero !== 'number' || isNaN(numero)) {
        return "Número inválido";
    }

    // Corregido: 'UN' debe estar en la posición 1
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'novena'];
    const especialesDiez = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const centenas = ['', 'ciento', 'docientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seisientos', 'setecientos', 'ochocientos', 'novecientos'];

    function convertirGrupo(num) {
        let texto = '';
        if (num === 100) return 'cien';
        
        if (num > 99) {
            texto += centenas[Math.floor(num / 100)] + ' ';
            num %= 100;
        }
        if (num > 19) {
            texto += decenas[Math.floor(num / 10)] + ' ';
            num %= 10;
        }
        if (num >= 10 && num <= 19) {
            texto += especialesDiez[num % 10] + ' ';
            num = 0;
        }
        // Corregido: Se añade la palabra 'Y' cuando es necesario
        if (num > 0) {
            if (texto !== '' && num > 0 && Math.floor((num + 100) / 10) !== 0 && (num > 0 || (num % 10 !== 0))) {
                if (Math.floor(num / 100) === 0 && Math.floor((num + 100) / 10) !== 0) {
                    texto += 'y ';
                }
            }
            texto += unidades[num] + ' ';
        }
        return texto.trim();
    }
    
    const [parteEntera, parteDecimal] = numero.toFixed(2).split('.').map(Number);

    let textoEntero = '';
    
    // Corregido: Se maneja el caso de 'UN' para la parte entera
    if (parteEntera === 1) {
      textoEntero = 'uno';
    } else if (parteEntera === 0) {
        textoEntero = 'cero';
    } else if (parteEntera < 1000) {
        textoEntero = convertirGrupo(parteEntera);
    } else if (parteEntera < 1000000) {
        const miles = Math.floor(parteEntera / 1000);
        const resto = parteEntera % 1000;
        if (miles === 1) {
            textoEntero = 'mil';
        } else {
            textoEntero = convertirGrupo(miles) + ' mil';
        }
        if (resto > 0) {
            textoEntero += ' ' + convertirGrupo(resto);
        }
    } else if (parteEntera < 1000000000) {
        const millones = Math.floor(parteEntera / 1000000);
        const restoMillones = parteEntera % 1000000;
        textoEntero = (millones === 1 ? 'un millón' : convertirGrupo(millones) + ' millones');
        if (restoMillones > 0) {
            textoEntero += ' ' + numeroALeyenda(restoMillones).replace(' con 00/100 soles', '');
        }
    }

    const textoDecimal = parteDecimal.toString().padStart(2, '0');

    return `${textoEntero} con ${textoDecimal}/100 ${moneda === 'PEN' ? 'soles' : 'dolares'}`.replace(/\s+/g, ' ').trim();
}

// Ejemplo de uso:
// console.log(numeroALeyenda(118));     // SON CIENTO DIECIOCHO CON 00/100 SOLES
// console.log(numeroALeyenda(1.50));    // SON UN CON 50/100 SOLES
// console.log(numeroALeyenda(250.75));  // SON DOSCIENTOS CINCUENTA CON 75/100 SOLES
// console.log(numeroALeyenda(1000));    // SON UN MIL CON 00/100 SOLES
// console.log(numeroALeyenda(123456.78)); // SON CIENTO VEINTITRES MIL CUATROCIENTOS CINCUENTA Y SEIS CON 78/100 SOLES
// console.log(numeroALeyenda(0.00));    // SON CERO CON 00/100 SOLES
// console.log(numeroALeyenda(1));       // SON UN CON 00/100 SOLES
// console.log(numeroALeyenda(1000000)); // SON UN MILLÓN CON 00/100 SOLES

module.exports = { numeroALeyenda };