const { Factura } = require("../../../facturacion/infrastructure/models/factura-boleta/facturaModel");
const { GuiaRemision } = require("../../../facturacion/infrastructure/models/guia-remision/guiaRemisionModel");
const { NotasCreditoDebito } = require("../../../facturacion/infrastructure/models/notas-credito-debito/notasCreditoDebitoModel");
const { SunatRespuesta } = require("../../../facturacion/infrastructure/models/sunatRespuestaModel");
const db = require("../../../../database/models");

class SequelizFactilizaRepository {
    async actualizarEstado(documento, data) {
        let modelo;
        let where;
        let id_sunat;

        console.log("📄 Procesando:", documento);

        // 🔹 Detectar modelo y clave foránea
        if (documento.tipo_Doc === "01" || documento.tipo_Doc === "03") {
            modelo = Factura;
            id_sunat = "factura_id";
        } else if (documento.tipo_Doc === "07" || documento.tipo_Doc === "08") {
            modelo = NotasCreditoDebito;
            id_sunat = "nota_id";
        } else if (documento.tipo_Doc === "09") {
            modelo = GuiaRemision;
            id_sunat = "guia_id";
        } else {
            console.warn(`⚠️ Tipo de documento no reconocido: ${documento.tipo_Doc}`);
            return;
        }

        // 🔹 Cláusula WHERE unificada
        where = {
            empresa_ruc: documento.empresa_ruc,
            tipo_doc: documento.tipo_Doc,
            serie: documento.serie,
            correlativo: documento.correlativo,
        };

        // ⚙️ Solo procesar si estado_Envio === "0"
        if (String(data.estado_Envio) !== "0") {
            console.log(`⏩ Documento ${documento.tipo_Doc} ${documento.serie}-${documento.correlativo} sigue pendiente, no se actualiza.`);
            return;
        }

        const transaction = await db.sequelize.transaction();
        try {
            const doc = await modelo.findOne({ where, transaction });
            if (!doc) {
                console.warn(`⚠️ Documento no encontrado en ${modelo.name}: ${JSON.stringify(where)}`);
                await transaction.rollback();
                return;
            }

            // 🔹 Determinar nuevo estado del documento (factura/nota/guía)
            const { estado_Sunat, respuesta_Sunat, hash } = data;
            const nuevoEstado = String(estado_Sunat) === "0" ? "EMITIDA" : "RECHAZADA";

            // Guardar estado anterior antes de actualizar
            const estadoAnterior = doc.estado;

            // 🔹 Actualizar documento principal
            await doc.update({ estado: nuevoEstado }, { transaction });

            // 🔹 Registrar respuesta Sunat
            const sunatData = {
                hash: hash || null,
                cdr_zip: null,
                sunat_success: String(estado_Sunat) === "0",
                cdr_response_id: `${documento.serie}-${documento.correlativo}`,
                cdr_response_code: String(estado_Sunat),
                cdr_response_description: respuesta_Sunat || null,
                [id_sunat]: doc.id,
            };

            await SunatRespuesta.create(sunatData, { transaction });

            // ⚡️ SI ES NOTA (07 u 08) Y PASÓ DE PENDIENTE → EMITIDA, AFECTA LA FACTURA
            if (
                (documento.tipo_Doc === "07" || documento.tipo_Doc === "08") &&
                estadoAnterior === "PENDIENTE" &&
                nuevoEstado === "EMITIDA"
            ) {
                console.log(`🔄 Nota ${documento.serie}-${documento.correlativo} EMITIDA — actualizando factura asociada...`);

                // Buscar la factura asociada
                const facturaAsociada = await Factura.findByPk(doc.factura_id, { transaction });

                if (facturaAsociada) {
                    let valueEstado;

                    // 🧩 Usar la misma lógica de decisión que en crear()
                    if (doc.tipo_Doc === "07") {
                        if (doc.motivo_Cod === "01" || doc.motivo_Cod === "02") {
                            valueEstado = "ANULADA-NOTA";
                        } else {
                            valueEstado = "MODIFICADA-NOTA";
                        }
                    } else {
                        valueEstado = "MODIFICADA-NOTA";
                    }

                    await facturaAsociada.update({ estado: valueEstado }, { transaction });
                    console.log(`✅ Factura ${facturaAsociada.serie}-${facturaAsociada.correlativo} actualizada a estado ${valueEstado}`);
                } else {
                    console.warn(`⚠️ No se encontró factura asociada a la nota ${documento.serie}-${documento.correlativo}`);
                }
            }

            await transaction.commit();
            console.log(`✅ ${documento.tipo_Doc} ${documento.serie}-${documento.correlativo} actualizado => ${nuevoEstado}`);
        } catch (error) {
            await transaction.rollback();
            console.error("❌ Error al actualizar estado del documento:", error);
        }
    }
}

module.exports = SequelizFactilizaRepository;
