module.exports = class RegistrarDeclaracionMultiempleo {
    constructor({ repo }) { this.repo = repo; }
    async execute(payload) {
        const { dni, anio, filial_principal_id } = payload || {};
        if (!dni || !Number.isInteger(Number(anio))) {
            const error = new Error("Parámetros inválidos (dni, anio)");
            error.status = 400;
            throw error;
        }
    
        // filial puede ser null si aún no fue asignado
        const entidad = {
            dni,
            anio: Number(anio),
            aplica_desde_mes: payload?.aplica_desde_mes ? Number(payload.aplica_desde_mes) : null,
            filial_principal_id: filial_principal_id ?? null,
            renta_bruta_otros_anual: Number(payload?.renta_bruta_otros_anual || 0),
            retenciones_previas_otros: Number(payload?.retenciones_previas_otros || 0),
            detalle_json: payload?.detalle_json || null,
            archivo_url: payload?.archivo_url || null,
            estado: payload?.estado || "VIGENTE",
        };
        const guardar = await this.repo.insertarPorDniAnio(entidad);
        if (Array.isArray(payload.detalles)) {
            await this.repo.insertarDetalles(guardar.id, payload.detalles);
        }
        return guardar.dataValues ? guardar.dataValues : guardar;
    }
}