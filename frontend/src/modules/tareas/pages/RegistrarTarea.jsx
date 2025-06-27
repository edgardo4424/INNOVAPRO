import { useState } from "react";
import useRegistrarTarea from "../hooks/useRegistrarTarea";
import ModuloNavegacion from "@/shared/components/ModuloNavegacion"
import FormularioGeneral from "../components/FormularioGeneral";
import styles from "../components/FormularioGeneral.module.css"

// Componente principal para el registro de tareas.
// Gestiona el flujo de pasos del mini wizard y centraliza el estado vía useRegistrarTarea.
// Permite seleccionar contacto, cliente, obra, filial y tipo de tarea.
// Si la tarea requiere despiece, activa la carga dinámica de zonas y atributos al igual que en el registro de cotizaciones

export default function RegistrarTarea() {
  const {
    paso,
    setPaso,
    contactos,
    clientes,
    obras,
    empresas,
    clientesFiltrados,
    setClientesFiltrados,
    obrasFiltradas,
    setObrasFiltradas,
    obraSeleccionada,
    formData,
    setFormData,
    errores,
    onChangeCampo,
    onChangeDetalles,
    registrarTarea,
  } = useRegistrarTarea();

  const avanzar = () => setPaso((prev) => Math.min(prev +1 , 3));
  const retroceder = () => setPaso((prev) => Math.max(prev - 1, 1));

  return (
    <div className="registro-tarea-container">

      <ModuloNavegacion />
      
      <h2 className="registro-tarea-titulo">📌 Registrar Nueva Tarea</h2>

      <div className="registro-tarea-mensaje">
        <p>
          🛠️ <strong>Estimado compañero comercial</strong>, brinde toda la información
          necesaria para completar su tarea en los tiempos que lo necesite.
        </p>
      </div>

      <FormularioGeneral
        paso={paso}
        setPaso={setPaso}
        contactos={contactos}
        clientes={clientes}
        obras={obras}
        empresas={empresas}
        clientesFiltrados={clientesFiltrados}
        setClientesFiltrados={setClientesFiltrados}
        obrasFiltradas={obrasFiltradas}
        setObrasFiltradas={setObrasFiltradas}
        obraSeleccionada={obraSeleccionada}
        formData={formData}
        setFormData={setFormData}
        errores={errores}
        onChangeCampo={onChangeCampo}
        onChangeDetalles={onChangeDetalles}
        onSubmit={registrarTarea}
      />

      <div className={styles.wizardNav}>
      {paso > 1 && (
        <button type="button" onClick={retroceder}>
          ⬅️ Atrás
        </button>
      )}

      {paso < 3 && (
        <button type="button" onClick={avanzar}>
          Siguiente ➡️
        </button>
      )}
    </div>

    </div>
  );
}