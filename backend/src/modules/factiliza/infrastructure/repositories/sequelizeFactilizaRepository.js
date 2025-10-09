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

        // 🔹 Cláusula WHERE unificada (en minúsculas)
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

            // 🔹 Determinar estado del documento
            const { estado_Sunat, respuesta_Sunat, hash } = data;
            const nuevoEstado = String(estado_Sunat) === "0" ? "EMITIDA" : "RECHAZADA";

            // 🔹 Actualizar campo correcto (estado)
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

            await transaction.commit();

            console.log(`✅ ${documento.tipo_Doc} ${documento.serie}-${documento.correlativo} actualizado => ${nuevoEstado}`);
        } catch (error) {
            await transaction.rollback();
            console.error("❌ Error al actualizar estado del documento:", error);
        }
    }
}

module.exports = SequelizFactilizaRepository;
