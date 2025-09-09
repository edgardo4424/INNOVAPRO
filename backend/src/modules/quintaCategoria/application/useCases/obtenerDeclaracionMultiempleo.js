module.exports = class ObtenerDeclaracionMultiempleo {
    constructor({ repo }) { this.repo = repo }
    async execute({ dni, anio }) {
        if (!dni || !Number.isInteger(Number(anio))) {
            const error = new Error("Parámetros inválidos (dni, anio)");
            error.status = 400;
            throw error;
        }
        const fila = await this.repo.obtenerPorDniAnio({ dni, anio: Number(anio )});
        if (!fila) return { found: false };
        const filaData = fila.dataValues ? fila.dataValues : fila;
        const detalles = await this.repo.obtenerDetalles({ multiempleoId: filaData.id });

        return {
            found: true,
            id: filaData.id,
            aplica_desde_mes: filaData.aplica_desde_mes || null,
            filial_principal_id: filaData.filial_principal_id || null,
            somos_secundario_no_retiene: !!filaData.somos_secundario_no_retiene,
            renta_bruta_otros_anual: Number(filaData.renta_bruta_otros_anual || 0),
            retenciones_previas_otros: Number(filaData.retenciones_previas_otros || 0),
            detalle_json: filaData.detalle_json || null,
            archivo_url: filaData.archivo_url || null,
            updateAt: filaData.update_at || filaData.updateAt,
            detalles: detalles.map(detalle => detalle.toJSON())
        };
    }
}