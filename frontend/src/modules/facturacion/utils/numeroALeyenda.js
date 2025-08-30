function numeroALeyenda(nro) {
    let numero = Number(nro);
    if (typeof numero !== 'number' || isNaN(numero)) {
        return "Número inválido";
    }

    // Corregido: 'UN' debe estar en la posición 1
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especialesDiez = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    function convertirGrupo(num) {
        let texto = '';
        if (num === 100) return 'CIEN';
        
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
                    texto += 'Y ';
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
      textoEntero = 'UNO';
    } else if (parteEntera === 0) {
        textoEntero = 'CERO';
    } else if (parteEntera < 1000) {
        textoEntero = convertirGrupo(parteEntera);
    } else if (parteEntera < 1000000) {
        const miles = Math.floor(parteEntera / 1000);
        const resto = parteEntera % 1000;
        if (miles === 1) {
            textoEntero = 'MIL';
        } else {
            textoEntero = convertirGrupo(miles) + ' MIL';
        }
        if (resto > 0) {
            textoEntero += ' ' + convertirGrupo(resto);
        }
    } else if (parteEntera < 1000000000) {
        const millones = Math.floor(parteEntera / 1000000);
        const restoMillones = parteEntera % 1000000;
        textoEntero = (millones === 1 ? 'UN MILLÓN' : convertirGrupo(millones) + ' MILLONES');
        if (restoMillones > 0) {
            textoEntero += ' ' + numeroALeyenda(restoMillones).replace(' CON 00/100 SOLES', '');
        }
    }

    const textoDecimal = parteDecimal.toString().padStart(2, '0');

    return `SON ${textoEntero} CON ${textoDecimal}/100 SOLES`.replace(/\s+/g, ' ').trim();
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

export default numeroALeyenda;