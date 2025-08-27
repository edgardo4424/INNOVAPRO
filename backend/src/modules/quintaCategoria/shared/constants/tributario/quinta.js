module.exports = {
  TRAMOS: [ // Escala progresiva acumulativa (UIT)
    { desdeUIT: 0, hastaUIT: 5,  tasa: 0.08 }, // 0 – 5
    { desdeUIT: 5, hastaUIT: 20, tasa: 0.14 }, // 5 – 20
    { desdeUIT: 20, hastaUIT: 35, tasa: 0.17 }, // 20 – 35
    { desdeUIT: 35, hastaUIT: 45, tasa: 0.20 }, // 35 – 45
    { desdeUIT: 45, hastaUIT: Infinity, tasa: 0.30 }, // 45+
  ],
  FUENTE_PREVIOS: {
    AUTO: 'AUTO', // Proyección automática con contrato/bonos/grati
    CERTIFICADO: 'CERTIFICADO', // Datos declarados en certificado 5ta (empleador anterior)
    SIN_PREVIOS: 'SIN_PREVIOS' // Declaración jurada: no considerar ingresos previos
  }
};