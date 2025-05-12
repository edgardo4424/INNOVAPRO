import CheckboxGrupoPasePedido from "./checklists/CheckboxGrupoPasePedido";
import InfoPlataformado from "./pasePedido/InfoPlataformado";
import InfoEscaleras from "./pasePedido/InfoEscaleras";
import InfoAndamioElectrico from "./pasePedido/InfoAndamioElectrico";
import InfoOtros from "./pasePedido/InfoOtros";

export default function DetallesPasePedido({ detalles, onChange, obra }) {
    return (
      <div className="tarea-detalles">
        <h3>Detalles del Pase de Pedido</h3>
  
        {/* Estado del pedido */}
        <label>Estado del pedido:</label>
        <select
          value={detalles.estadoPasePedido || ""}
          onChange={(e) => onChange("estadoPasePedido", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Pre Confirmado">Pre Confirmado</option>
          <option value="Por Confirmar">Por Confirmar</option>
        </select>
  
        {/* Número y versión de contrato */}
        <label>Número y versión de contrato:</label>
        <input
          type="text"
          value={detalles.numeroVersionContrato || ""}
          onChange={(e) => onChange("numeroVersionContrato", e.target.value.toUpperCase())}
          onBlur={(e) => {
            const regex = /^\d{4}_\d{1,2}$/;
            if (!regex.test(e.target.value)) {
              alert("Formato incorrecto. Debe ser 0000_0 (Ejemplo: 0025_1)");
              onChange("numeroVersionContrato", "");
            }
          }}
          placeholder="Ejemplo: 0025_1"
          maxLength="7"
          className="input-contrato"
        />
        <small className="hint-text">Debe seguir el formato 0000_0 (Ejemplo: 0025_1)</small>
  
        {/* Tipo de operación */}
        <label>Tipo de operación:</label>
        <select
          value={detalles.tipoOperacion || ""}
          onChange={(e) => onChange("tipoOperacion", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Alquiler">Alquiler</option>
          <option value="Venta">Venta</option>
          <option value="Prestamo">Préstamo</option>
          <option value="Intercambio">Intercambio</option>
          <option value="Movimiento de Stock">Movimiento de Stock</option>
          <option value="Venta por reposición">Venta por reposición</option>
          <option value="Cambio de Razón Social">Cambio de Razón Social</option>
        </select>
  
        {/* Estado de habilitación */}
        <label>Estado de habilitación:</label>
        <small className="hint-text">URGENTE (sucio) - BÁSICO (limpio) - EXCELENTE (pintado)</small>
        <select
          value={detalles.estadoHabilitacion || ""}
          onChange={(e) => onChange("estadoHabilitacion", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Urgente">Urgente</option>
          <option value="Básico">Básico</option>
          <option value="Excelente">Excelente</option>
        </select>
  
        {/* Obra nueva */}
        <label>¿Obra nueva?</label>
        <select
          value={detalles.obraNueva || ""}
          onChange={(e) => onChange("obraNueva", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Si">Sí</option>
          <option value="No">No</option>
        </select>
  
        {/* Valorización adelantada */}
        <label>¿Requiere valorización adelantada?</label>
        <select
          value={detalles.valorizacionAdelantada || ""}
          onChange={(e) => onChange("valorizacionAdelantada", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Si">Sí</option>
          <option value="No">No</option>
        </select>
  
        {/* Transporte */}
        <label>Transporte:</label>
        <select
          value={detalles.transporte || ""}
          onChange={(e) => onChange("transporte", e.target.value)}
        >
          <option value="">Seleccione...</option>
          <option value="Ellos">Ellos</option>
          <option value="Nosotros">Nosotros</option>
        </select>
  
        {/* Fecha y Hora de Entrega */}
        <div className="entrega-container">
          <label>Fecha de entrega en obra:</label>
          <input
            type="date"
            value={detalles.fechaEntrega || ""}
            onChange={(e) => onChange("fechaEntrega", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
  
          <label>Hora de entrega en obra:</label>
          <input
            type="time"
            value={detalles.horaEntrega || ""}
            onChange={(e) => onChange("horaEntrega", e.target.value)}
            required
          />
        </div>

        <CheckboxGrupoPasePedido detalles={detalles} onChange={onChange} />
        <InfoPlataformado detalles={detalles} onChange={onChange} />
        <InfoEscaleras detalles={detalles} onChange={onChange} />
        <InfoAndamioElectrico detalles={detalles} onChange={onChange} />
        <InfoOtros detalles={detalles} onChange={onChange} />


        {/* Nota */}
        <label>📝 Nota:</label>
        <textarea
          className="nota-textarea"
          value={detalles.nota || ""}
          onChange={(e) => onChange("nota", e.target.value)}
          placeholder="Escribe aquí los detalles adicionales..."
        />
      </div>
    );
  }  