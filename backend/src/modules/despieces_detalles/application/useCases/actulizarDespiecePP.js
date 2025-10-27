// src/modules/.../usecases/actualizarDespiece.js

// ? id: ID del despiece
// ? listaDePiezas: lista de piezas que reemplazarán las piezas anteriores
// ? repositoryDespiece: repositorio con método actualizarPiezas()
module.exports = async (id, listaDePiezas, repositoryDespiece) => {
    try {
        // ? Ejecuta el método del repositorio (ya maneja la transacción internamente)
        console.log("lo que llega", id, listaDePiezas);
        const { success, mensaje, data, error } =
            await repositoryDespiece.actulizarPiezas(id, listaDePiezas);

        if (!success) {
            // ? Si falló, lanzamos error para que pueda ser manejado por el controlador
            throw new Error(mensaje || "No se pudieron actualizar las piezas", {
                cause: error,
            });
        }

        // * ✅ Si todo salió bien, retornamos el resultado unificado
        return {
            status: 200,
            respuesta: {
                status: 200,
                success: true,
                message: "Despiece actualizado correctamente",
                data,
            }
        };
    } catch (err) {
        return {
            status: 500,
            respuesta: {
                status: 500,
                success: false,
                message: "Error al actualizar el despiece",
                error: err,
            }
        };
    }
};
