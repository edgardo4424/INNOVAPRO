module.exports = class RegistrarDeclaracionMultiempleo {
    constructor({ repo }) { this.repo = repo; }
    async execute(payload = {}) {
        const { dni, anio } = payload;
        if (!dni || !Number.isInteger(Number(anio))) {
            const error = new Error("Parámetros inválidos (dni, anio)");
            error.status = 400;
            throw error;
        }
    
        const entidad = {
            dni,
            anio: Number(anio),
            aplica_desde_mes: (payload.aplica_desde_mes === '' || payload.aplica_desde_mes == null)
                ? null : Number(payload.aplica_desde_mes),

            filial_principal_id: payload.filial_principal_id == null ? null : Number(payload.filial_principal_id),
            es_secundaria: !!payload.es_secundaria,

            principal_ruc: payload.principal_ruc || null,
            principal_razon_social: payload.principal_razon_social || null,

            renta_bruta_otros_anual: Number(payload.renta_bruta_otros_anual || 0),
            retenciones_previas_otros: Number(payload.retenciones_previas_otros || 0),

            detalle_json: payload.detalle_json || null,
            archivo_url: payload.archivo_url || null,
            observaciones: payload.observaciones || null,

            estado: payload.estado || 'VIGENTE',
            es_oficial: payload.es_oficial !== false,
        };

        const guardar = await this.repo.insertarPorDniAnio(entidad);
        return guardar.dataValues ? guardar.dataValues : guardar;
    }
}