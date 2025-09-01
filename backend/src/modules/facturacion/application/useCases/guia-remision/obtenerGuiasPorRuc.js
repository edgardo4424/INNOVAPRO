module.exports = async (query, guiaRepository) => {
    try {
        const guias = await guiaRepository.relacionRemision(query);

        if (!guias || guias.length === 0) {
            return {
                codigo: 400,
                respuesta: {
                    message: "no se encontraron guias",
                    status: false,
                    count: 0,
                    data: [],
                },
            };
        }

        return {
            codigo: 200,
            respuesta: {
                message: "se encontraron guias",
                status: true,
                count: guias.length,
                data: guias,
            },
        };
    } catch (e) {
        return {
            codigo: 500,
            respuesta: {
                message: "Error al obtener las guias relacionadas.",
                status: false,
                count: 0,
                data: null,
            },
        };
    }
};
