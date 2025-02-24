import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/cotizacionForm.css";

export default function CotizacionForm() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [obra, setObra] = useState("");
  const [contacto, setContacto] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [motivo, setMotivo] = useState("ALQUILER");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const clientesRes = await api.get("/clientes");
        console.log("📡 Clientes obtenidos:", clientesRes.data);
        setClientes(clientesRes.data || []);

        const empresasRes = await api.get("/empresas_proveedoras");
        setEmpresas(empresasRes.data || []);

        setLoading(false);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
        setClientes([]);
        setEmpresas([]);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!obra || !contacto || !empresa || !motivo || !descripcion) {
      alert("❌ Todos los campos son obligatorios.");
      return;
    }

    const clienteEncontrado = clientes.find(cliente =>
      cliente.obras.some(o => o.id === parseInt(obra))
    );

    const nuevaCotizacion = {
      empresa_proveedora_id: empresa,
      cliente_id: clienteEncontrado ? clienteEncontrado.id : null, 
      obra_id: obra,
      contacto_id: contacto,
      usuario_id: user.id,
      motivo: motivo || "ALQUILER",
      estado: "Borrador",
      observaciones: descripcion,
    };

    console.log("📤 Enviando cotización:", nuevaCotizacion);

    try {
      const response = await api.post("/cotizaciones", nuevaCotizacion);
      alert("✅ Cotización creada con éxito");
      console.log("🟢 Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("❌ Error al crear cotización:", error);
      alert("❌ Error al guardar la cotización.");
    }
  }

  return (
    <div className="cotizacion-container">
      <h2>Crear Cotización</h2>
      <form onSubmit={handleSubmit}>
        <select onChange={(e) => setObra(e.target.value)} required>
          <option value="">Selecciona una obra</option>
          {clientes.flatMap(cliente =>
            cliente.obras ? cliente.obras.map(obra => (
              <option key={obra.id} value={obra.id}>
                {obra.nombre}
              </option>
            )) : []
          )}
        </select>

        <select onChange={(e) => setContacto(e.target.value)} required>
          <option value="">Selecciona un contacto</option>
          {clientes.flatMap(cliente =>
            cliente.contactos ? cliente.contactos.map(contacto => (
              <option key={contacto.id} value={contacto.id}>
                {contacto.nombre}
              </option>
            )) : []
          )}
        </select>

        <select onChange={(e) => setEmpresa(e.target.value)} required>
          <option value="">Selecciona una empresa proveedora</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nombre}
            </option>
          ))}
        </select>

        <select value={motivo} onChange={(e) => setMotivo(e.target.value)} required>
          <option value="ALQUILER">ALQUILER</option>
          <option value="VENTA">VENTA</option>
        </select>

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        ></textarea>

        <button type="submit">Guardar Cotización</button>
      </form>
    </div>
  );
}