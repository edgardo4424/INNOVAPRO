// La importación de la base de datos es la causa del error.
// La mayoría de los proyectos Sequelize exportan un objeto que contiene los modelos y la instancia de sequelize.
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos

const { NotasCreditoDebito } = require("../models/notas-credito-debito/notasCreditoDebitoModel");
const { LegendNotaCreditoDebito } = require("../models/notas-credito-debito/legendNotaCreditoDebitoModel");
const { DetalleNotaCreditoDebito } = require("../models/notas-credito-debito/detalleNotaCreditoDebitoModel");
const { SunatRespuesta } = require("../models/sunatRespuestaModel");
const { Factura } = require("../models/factura-boleta/facturaModel");


class SequelizeNotasCreditoDebitoRepository {
    async crear(data) {
        console.log("desde el repositorio", data);
        // Inicia una transacción usando la instancia correcta de sequelize.
        const transaction = await db.sequelize.transaction();
        let createdNota = {};

        try {
            //* 1. Crear la Nota de Crédito/Débito principal
            const nota = await NotasCreditoDebito.create(data.nota, { transaction });
            if (!nota) {
                throw new Error("No se pudo crear la nota de crédito/débito principal.");
            }
            createdNota.nota = nota;

            //* 2. Crear los Detalles de la Nota
            const createdDetalles = [];
            for (const detalleData of data.detalle) {
                const detalle = await DetalleNotaCreditoDebito.create(
                    {
                        nota_id: nota.id,
                        ...detalleData,
                    },
                    { transaction }
                );
                if (!detalle) {
                    throw new Error(
                        `No se pudo crear un detalle para el producto ${detalleData.cod_producto || "desconocido"}.`
                    );
                }
                createdDetalles.push(detalle);
            }
            createdNota.detalles = createdDetalles;

            //* 3. Crear las Leyendas de la Nota
            const createdLeyendas = [];
            for (const leyendaData of data.leyendas) {
                const leyenda = await LegendNotaCreditoDebito.create(
                    {
                        nota_id: nota.id,
                        ...leyendaData,
                    },
                    { transaction }
                );
                if (!leyenda) {
                    throw new Error("No se pudo crear una leyenda para la nota.");
                }
                createdLeyendas.push(leyenda);
            }
            createdNota.leyendas = createdLeyendas;

            // *4. Crear la Respuesta de SUNAT
            const sunat = await SunatRespuesta.create(
                {
                    nota_id: nota.id,
                    ...data.sunat_respuesta,
                },
                { transaction }
            );
            if (!sunat) {
                throw new Error("No se pudo crear la respuesta de SUNAT.");
            }
            createdNota.sunat_respuesta = sunat;

            //* 5. Anular la factura asociada (MOVIDO DENTRO DE LA TRANSACCIÓN)
            const { id_factura } = data;
            const factura = await Factura.findByPk(id_factura);
            if (!factura) {
                throw new Error("No se encontró la factura para anular.");
            }
            // Se cambia el valor "ANULADO" a "A" para evitar el error de truncamiento de datos
            await factura.update({ estado: "ANULADA" }, { transaction });

            //* Si todas las operaciones fueron exitosas, confirma la transacción.
            await transaction.commit();

            return {
                success: true,
                message: "Nota de crédito/débito y sus componentes creados con éxito.",
                data: createdNota,
            };
        } catch (error) {
            //! Si ocurre algún error, revierte la transacción para no guardar datos incompletos.
            await transaction.rollback();
            console.error(
                "Error en SequelizeNotasCreditoDebitoRepository.crear:",
                error.message,
                error.stack
            );
            return {
                success: false,
                message: error.message || "Ocurrió un error inesperado al crear la nota.",
                data: null,
            };
        }
    }
}

module.exports = SequelizeNotasCreditoDebitoRepository;
