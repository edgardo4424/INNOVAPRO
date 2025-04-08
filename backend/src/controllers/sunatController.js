const db = require("../models");

exports.buscarRUC = async (req, res) => {
  const { ruc } = req.params;
  try {
    const data = await db.contrisunat.findOne({ where: { ruc } });

    if (!data) return res.status(404).json({ mensaje: "RUC no encontrado" });

    // Obtener datos del ubigeo
    const ubigeo = await db.ubigeos.findOne({
        where: { codigo: data.ubigeo },
      });

    const geoInfo = ubigeo
      ? `- ${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`
      : "";
    
    // Función para validar si una parte es válida
    const limpiarCampo = (valor) =>
        valor && valor.trim() !== "" && valor.trim() !== "-" ? valor.trim() : "";

    const domicilio = [
        `${limpiarCampo(data.tipo_via)} ${limpiarCampo(data.nombre_via)}`.trim(),
        limpiarCampo(data.numero) ? `NRO. ${data.numero}` : "",
        limpiarCampo(data.interior) ? `INT. ${data.interior}` : "",
        limpiarCampo(data.codigo_zona) && limpiarCampo(data.tipo_zona)
          ? `${data.codigo_zona} ${data.tipo_zona}`
          : "",
        geoInfo,
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    res.json({
      razon_social: data.nombre_razon_social,
      domicilio_fiscal: domicilio,
    });
  } catch (error) {
    console.error("❌ Error buscando RUC:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};