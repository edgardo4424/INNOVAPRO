const geocodingClient = require('../../service/apigoogle');
const normalizeDepartmentName = require('../../utils/ubigeoDepartamentoHelper')
// Helpers locales (normalización Perú)
const strip = (s = '') => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const norm = (s = '') => strip(String(s).toUpperCase().trim());

module.exports = async (direccion, ubigeoRepo) => {
    try {
        if (!direccion) {
            return { codigo: 400, respuesta: { message: 'direccion requerida', ubigeo: null } };
        }

        const response = await geocodingClient.get('json', { params: { address: direccion } });
        const { status, results, error_message } = response.data;

        if (status === 'OK' && Array.isArray(results) && results.length > 0) {
            const { address_components } = results[0];

            console.log(results)
            // Google: locality=distrito, admin_area_2=provincia, admin_area_1=departamento
            const distritoRaw = address_components.find(c => c.types.includes('locality'))?.long_name;
            const provinciaRaw = address_components.find(c => c.types.includes('administrative_area_level_2'))?.long_name;
            let departamentoRaw = address_components.find(c => c.types.includes('administrative_area_level_1'))?.long_name;

            console.log(distritoRaw, provinciaRaw, departamentoRaw)

            if (!distritoRaw || !provinciaRaw || !departamentoRaw) {
                return { codigo: 404, respuesta: { message: 'no se encontró distrito/provincia/departamento', ubigeo: null } };
            }

            // Normalizaciones típicas: “Provincia de Lima” -> “Lima”, tildes, mayúsculas
            departamentoRaw = departamentoRaw.replace(/^PROVINCIA DE\s+/i, '');
            const distrito = norm(distritoRaw);
            const provincia = norm(provinciaRaw);
            const departamento = normalizeDepartmentName(departamentoRaw);

            console.log(distrito, provincia, departamento)
            // Consulta al repositorio (asegúrate de que tu repo busca por nombres normalizados)
            // Ej: SELECT codigo FROM ubigeos WHERE dep_norm=? AND prov_norm=? AND dist_norm=?  (o normaliza en la query)
            const ubigeo = await ubigeoRepo.obtenerUbigeo(distrito, provincia, departamento);

            if (!ubigeo) {
                return { codigo: 404, respuesta: { message: 'no se encontró ubigeo en catálogo', ubigeo: null } };
            }

            return {
                codigo: 200,
                respuesta: {
                    message: 'ok',
                    ubigeo: ubigeo.codigo || ubigeo, // por si tu repo devuelve { codigo } o solo el string
                    // info útil opcional:
                    distrito: distritoRaw.toUpperCase(),
                    provincia: provinciaRaw.toUpperCase(),
                    departamento: departamento.toUpperCase(),
                },
            };
        }

        if (status === 'ZERO_RESULTS') {
            return { codigo: 404, respuesta: { message: 'sin resultados', ubigeo: null , results} };
        }

        return { codigo: 400, respuesta: { message: `error (${status}) ${error_message || ''}`, ubigeo: null } };
    } catch (err) {
        console.error('useCase error:', err?.message);
        return { codigo: 500, respuesta: { message: 'error interno', detalle: err?.message } };
    }
};
