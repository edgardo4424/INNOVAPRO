function construirMensajeTiempo({ anios, meses, dias }) {
    const partes = [];

    if (anios > 0) partes.push(`${anios} ${anios === 1 ? "año" : "años"}`);
    if (meses > 0) partes.push(`${meses} ${meses === 1 ? "mes" : "meses"}`);
    if (dias > 0) partes.push(`${dias} ${dias === 1 ? "día" : "días"}`);

    return partes.length > 0 ? partes.join(", ") : "0 días";
  }

  module.exports = { construirMensajeTiempo };