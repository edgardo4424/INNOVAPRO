const { QueryTypes } = require("sequelize");
const sequelize = require("../../../../database/sequelize");

class SequelizeParametrosTributariosRepository {
  async getParametrosTributarios() {
    const sql = `
      SELECT 
        MAX(CASE WHEN codigo = 'valor_uit' THEN valor END) AS uit,
        MAX(CASE WHEN codigo = 'deduccion_fija_uit' THEN valor END) AS deduccionFijaUit,
        MAX(CASE WHEN codigo = 'valor_hora_extra' THEN valor END) as valorHoraExtra,
        MAX(CASE WHEN codigo = 'valor_asignacion_familiar' THEN valor END) as valorAsignacionFamiliar
      FROM data_mantenimiento
      WHERE codigo IN ('valor_uit', 'deduccion_fija_uit', 'valor_hora_extra', 'valor_asignacion_familiar')
    `;

    const [row] = await sequelize.query(sql, { type: QueryTypes.SELECT });
    if (!row || !row.uit || !row.deduccionFijaUit) {
      throw new Error("No se encontraron parámetros tributarios en data_mantenimiento");
    }

    return {
      uit: Number(row.uit),
      deduccionFijaUit: Number(row.deduccionFijaUit),
      valorHoraExtra: Number(row.valorHoraExtra),
      valorAsignacionFamiliar: Number(row.valorAsignacionFamiliar),
      from: "db"
    };
  }
}

module.exports = SequelizeParametrosTributariosRepository;