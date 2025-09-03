// La lista de departamentos para la normalización.
// La "Provincia Constitucional del Callao" es un caso especial.
const DEPARTAMENTOS_PERU = [
    'AMAZONAS', 'ÁNCASH', 'APURÍMAC', 'AREQUIPA', 'AYACUCHO', 'CAJAMARCA', 'CUSCO', 'HUANCAVELICA', 'HUÁNUCO',
    'ICA', 'JUNÍN', 'LA LIBERTAD', 'LAMBAYEQUE', 'LIMA', 'LORETO', 'MADRE DE DIOS', 'MOQUEGUA',
    'PASCO', 'PIURA', 'PUNO', 'SAN MARTÍN', 'TACNA', 'TUMBES', 'UCAYALI', 'PROVINCIA CONSTITUCIONAL DEL CALLAO'
].map(s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')); // Normaliza la lista una sola vez.

/**
 * Normaliza el nombre del departamento recibido de una fuente externa (ej. Google)
 * para que coincida con la lista estándar de departamentos de Perú.
 *
 * @param {string} rawDep El nombre de departamento sin procesar (ej. "GOBIERNO REGIONAL DE LIMA").
 * @returns {string | null} El nombre normalizado (ej. "LIMA") o null si no se encuentra.
 */
const normalizeDepartmentName = (rawDep) => {
    if (!rawDep) return null;

    // Normaliza el nombre de entrada (sin tildes, en mayúsculas).
    const depCleaned = rawDep.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

    // Busca si la cadena normalizada contiene alguna palabra clave de la lista.
    for (const dep of DEPARTAMENTOS_PERU) {
        if (depCleaned.includes(dep)) {
            // Maneja el caso especial del Callao.
            if (dep === 'PROVINCIA CONSTITUCIONAL DEL CALLAO') {
                return 'PROVINCIA CONSTITUCIONAL DEL CALLAO';
            }
            // Para el resto, el nombre es la palabra clave en sí (ej. "LIMA", "LAMBAYEQUE").
            return dep;
        }
    }

    // Si no encuentra ninguna coincidencia, devuelve null.
    return null;
};

module.exports = normalizeDepartmentName;