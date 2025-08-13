const redondearPersonalizado = (valor) => {
    const centavos = Math.round((valor - Math.floor(valor)) * 100);

    if (centavos === 0) return Math.floor(valor).toFixed(2); // ejemplo: 5.00
    if (centavos < 50) return Math.floor(valor).toFixed(2); // ejemplo: 1.49 -> 1.00
    return Math.ceil(valor).toFixed(2); // ejemplo: 1.50 -> 2.00
};

export default redondearPersonalizado