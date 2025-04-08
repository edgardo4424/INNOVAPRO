const db = require("../models");
const { getIo } = require("../utils/websockets");

exports.obtenerNotificaciones = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const notificaciones = await db.notificaciones.findAll({
            where: { usuarioId },
            order: [["createdAt", "DESC"]],
            limit: 20,
        });

        res.json(notificaciones);
    } catch (error) {
        console.error("❌ Error al obtener notificaciones:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

exports.marcarComoLeida = async (req, res) => {
    try {
        const id = req.params.id;
        const notificacion = await db.notificaciones.findByPk(id);

        if (!notificacion) {
            return res.status(404).json({ mensaje: "Notificación no encontrada" });
        }

        notificacion.leida = true;
        await notificacion.save();

        getIo().emit(`notificacion_leida_${notificacion.usuarioId}`, {
            id: notificacion.id,
          });

          console.log(`✅ Notificación #${notificacion.id} marcada como leída por el usuario ${notificacion.usuarioId}`);
          
        res.json({ mensaje: "✅ Notificación marcada como leída" });
    } catch (error) {
        console.error("❌ Error al marcar notificación como leída:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};