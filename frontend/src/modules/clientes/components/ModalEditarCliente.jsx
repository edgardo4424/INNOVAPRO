import React, { useState } from "react";
import ClienteForm from "../forms/ClienteForm";
import clientesService from "../services/clientesService";
import { validarClienteJuridico, validarClienteNatural } from "../validaciones/validarCliente";
import { toast } from "react-toastify";
import { parsearError } from "../../../utils/parsearError";

export default function ModalEditarCliente({ cliente, onClose, actualizarCliente }) {
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

      const res = await clientesService.actualizar(clienteEditado.id, clienteLimpio);
      if (res.data && res.data.cliente) {
        actualizarCliente(res.data.cliente);
        toast.success("Cliente actualizado correctamente");
        onClose();
      } else {
        toast.error("Error al actualizar el cliente");

      }
    } catch (error) {
      console.error("❌ Error al actualizar cliente:", error);
      toast.error(parsearError(error));
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