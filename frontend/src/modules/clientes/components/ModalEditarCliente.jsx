import React, { useState } from "react";
import ClienteForm from "../forms/ClienteForm";
import clientesService from "../services/clientesService";
import { validarClienteJuridico, validarClienteNatural } from "../validaciones/validarCliente";
import { toast } from "react-toastify";

export default function ModalEditarCliente({ cliente, onClose }) {
  const [clienteEditado, setClienteEditado] = useState({ ...cliente });
  const [errores, setErrores] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const erroresValidados =
      clienteEditado.tipo === "Persona Jurídica"
        ? validarClienteJuridico(clienteEditado)
        : validarClienteNatural(clienteEditado);

    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      toast.warning("Completa los campos correctamente");
      return;
    }

    try {
      const clienteLimpio = { ...clienteEditado };
      Object.keys(clienteLimpio).forEach((key) => {
        if (clienteLimpio[key] === "") clienteLimpio[key] = null;
      });

      await clientesService.actualizar(clienteEditado.id, clienteLimpio);
      toast.success("Cliente actualizado correctamente");
      onClose();
    } catch (error) {
      console.error("❌ Error al actualizar cliente:", error);
      toast.error("No se pudo actualizar el cliente");
    }
  };

  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h3>Editar Cliente</h3>
        <ClienteForm
          cliente={clienteEditado}
          setCliente={setClienteEditado}
          errores={errores}
          setErrores={setErrores}
          onCancel={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}