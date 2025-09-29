const { Vehiculos } = require("../models/vehiculosModel");
const { Transportistas } = require("../models/transportistasModel");
const db = require("../../../../database/models");
const { Op, fn, col } = require('sequelize');

class SequelizeTransporteRepository {

    async crear(data) {
        const transacción = await db.sequelize.transaction();
        let createdTransportista = {};
        try {
            // ?? crear el transportista
            const transportista = await Transportistas.create(data.transportista, { transaction: transacción });
            if (!transportista) {
                throw new Error("No se pudo crear el transportista.");
            }
            createdTransportista.transportista = transportista;

            const createdVehiculos = [];
            // ?? crear el vehiculo
            for (const vehiculo of data.vehiculos) {
                const createdVehiculo = await Vehiculos.create(
                    {
                        id_transportista: transportista.id,
                        ...vehiculo
                    }, { transaction: transacción });
                if (!createdVehiculo) {
                    throw new Error("No se pudo crear el vehiculo.");
                }
                createdVehiculos.push(createdVehiculo);
            }
            createdTransportista.vehiculos = createdVehiculos;
            // ?  si todas las operaciones fueron exitosas
            await transacción.commit();

            return {
                success: true,
                message: "El transportista se creo correctamente.",
                data: createdTransportista
            };
        } catch (error) {
            // ! si alguna operación falló
            await transacción.rollback();
            console.error(
                "Error en SequelizeTransporteRepository.crear:",
                error.message,
                error.stack
            );
            return {
                success: false,
                message: "El transportista no se creo correctamente.",
                data: null
            };
        }
    }

    async actualizar(data) {
        const transacción = await db.sequelize.transaction();
        try {
            // ? 1. Buscar y actualizar transportista
            const { id, ...resto } = data.transportista;
            const transportista = await Transportistas.findByPk(id);

            if (!transportista) {
                throw new Error("Transportista no encontrado.");
            }

            await transportista.update(resto, { transaction: transacción });

            // ? 2. Recorrer vehículos y decidir si actualizar, crear o ignorar
            const vehiculosActualizados = [];

            for (const vehiculo of data.vehiculos) {
                if (vehiculo.id) {
                    // ? 2.1 Buscar vehículo existente por ID
                    const vehiculoExistente = await Vehiculos.findByPk(vehiculo.id);

                    if (vehiculoExistente) {
                        // ? 2.2 Si existe en DB → actualizar
                        await vehiculoExistente.update(
                            { ...vehiculo, id_transportista: transportista.id },
                            { transaction: transacción }
                        );
                        vehiculosActualizados.push(vehiculoExistente);
                    } else {
                        // ? 2.3 Si viene con id pero no existe en DB → crear nuevo
                        const nuevoVehiculo = await Vehiculos.create(
                            { ...vehiculo, id_transportista: transportista.id },
                            { transaction: transacción }
                        );
                        vehiculosActualizados.push(nuevoVehiculo);
                    }
                } else {
                    // ? 2.4 Si no tiene id → es un nuevo vehículo → crear
                    const nuevoVehiculo = await Vehiculos.create(
                        { ...vehiculo, id_transportista: transportista.id },
                        { transaction: transacción }
                    );
                    vehiculosActualizados.push(nuevoVehiculo);
                }
            }

            // ? 3. Eliminar vehículos que ya no vienen en el array
            // (solo mantenemos los IDs que realmente quedaron en DB)
            const idsVehiculosEnviados = vehiculosActualizados.map((v) => v.id);

            await Vehiculos.destroy({
                where: {
                    id_transportista: transportista.id,
                    id: { [db.Sequelize.Op.notIn]: idsVehiculosEnviados },
                },
                transaction: transacción,
            });

            // ? 4. Confirmar transacción
            await transacción.commit();

            return {
                success: true,
                message: "El transportista se actualizó correctamente.",
                data: {
                    transportista,
                    vehiculos: vehiculosActualizados,
                },
            };
        } catch (error) {
            // ? 5. Si algo falla → rollback
            await transacción.rollback();
            console.error("Error en SequelizeTransporteRepository.actualizar:", error);

            return {
                success: false,
                message: "El transportista no se actualizó.",
                data: null,
            };
        }
    }



    async listar() {
        const transportistas = await Transportistas.findAll({
            include: {
                model: Vehiculos,
            },
        });
        if (!transportistas) {
            return {
                success: false,
                message: "No se encontraron transportistas",
                data: null
            }
        }
        return {
            success: true,
            message: `${transportistas.length} transportistas encontrados`,
            data: transportistas
        }
    }

    async obtener(id) {
        const transportista = await Transportistas.findByPk(id, {
            include: {
                model: Vehiculos,
            },
        });
        return transportista;
    }

    async eliminar(id) {
        try {
            const deleted = await db.transportistas.destroy({ where: { id } });
            if (!deleted) {
                return {
                    success: false,
                    message: "El transportista no existe",
                    data: null
                };
            }
            return {
                success: true,
                message: "El transportista fue eliminado",
                data: null
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null,
            };
        }
    }
}

module.exports = SequelizeTransporteRepository;