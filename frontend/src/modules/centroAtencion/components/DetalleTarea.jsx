import React from "react";

export default function DetalleTarea({ tarea, onCerrar, user, handleTomarTarea, handleLiberarTarea, handleFinalizarTarea, handleDevolverTarea, handleCancelarTarea, handleCorregirTarea }) {
  const renderDetalles = () => {
    if (!tarea.detalles || Object.keys(tarea.detalles).length === 0) return null;
    const orden = [
      "apoyoTecnico", "apoyoAdministrativo", "tipoServicio", "estadoPasePedido",
      "numeroVersionContrato", "despacho", "tipoOperacion", "estadoHabilitacion",
      "obraNueva", "valorizacionAdelantada", "transporte", "fechaEntrega",
      "horaEntrega", "adaptarMotor", "tipoServicioColgante", "valorizacion",
      "envioCliente", "tipoModulacion", "tipoEquipo", "plataformado",
      "anclajes", "uso", "infoAdicional", "nota"
    ];

    return (
      <div className="tarea-detalles">
        <h4>Detalles Específicos</h4>
        <ul>
          {Object.entries(tarea.detalles)
            .sort(([a], [b]) => {
              const ia = orden.indexOf(a);
              const ib = orden.indexOf(b);
              if (ia === -1 && ib === -1) return a.localeCompare(b);
              if (ia === -1) return 1;
              if (ib === -1) return -1;
              return ia - ib;
            })
            .map(([key, value], idx) => (
              <li key={idx}><strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}</li>
            ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h3>Detalles de la Tarea</h3>
        <div className="detalles-tarea">
          <p><strong>Cliente:</strong> {tarea.cliente?.razon_social}</p>
          <p><strong>Obra:</strong> {tarea.obra?.nombre}</p>
          <p><strong>Ubicación:</strong> {tarea.ubicacion}</p>
          <p><strong>Comercial:</strong> {tarea.usuario_solicitante?.nombre || "Desconocido"}</p>
          <p><strong>Tarea:</strong> {tarea.tipoTarea}</p>
          <p><strong>Fecha Creación:</strong> {new Date(tarea.fecha_creacion).toLocaleString()}</p>
        </div>

        {renderDetalles()}

        {tarea.motivoDevolucion && (
          <div className="tarea-detalles">
            <h4>📌 Motivo de Devolución</h4>
            <p className="motivo-devuelto">{tarea.motivoDevolucion}</p>
          </div>
        )}

        {tarea.correccionComercial && (
          <div className="tarea-detalles">
            <h4>✏️ Corrección del Comercial</h4>
            <p className="correccion-comercial">{tarea.correccionComercial}</p>
          </div>
        )}

        {/* Botones según el rol y estado */}
        {user.rol === "Oficina Técnica" && (
          <>
            {tarea.estado === "Pendiente" && !tarea.asignadoA && (
              <div className="button-group">
                <button onClick={handleTomarTarea} className="button primary-button">Tomar Tarea</button>
              </div>
            )}
            {tarea.asignadoA === user.id && tarea.estado === "En proceso" && (
              <div className="button-group">
                <button onClick={handleLiberarTarea} className="button secondary-button">Liberar</button>
                <button onClick={handleFinalizarTarea} className="button primary-button">Finalizar</button>
                <button onClick={handleDevolverTarea} className="button warning-button">Devolver</button>
                <button onClick={handleCancelarTarea} className="button danger-button">Anular</button>
              </div>
            )}
          </>
        )}

        {user.rol === "Ventas" && tarea.estado === "Devuelta" && tarea.usuario_solicitante?.id === user.id && (
          <div className="button-group">
            <button onClick={handleCorregirTarea} className="button primary-button">Corregir Tarea</button>
          </div>
        )}

        <button onClick={onCerrar} className="close-button">×</button>
      </div>
    </div>
  );
}