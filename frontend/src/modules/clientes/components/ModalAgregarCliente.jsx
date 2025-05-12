import React, { useState } from "react";
import ClienteForm from "../forms/ClienteForm";
import clientesService from "../services/clientesService";
import { validarClienteJuridico, validarClienteNatural } from "../validaciones/validarCliente";
import { toast } from "react-toastify";
import { buscarDatosPorRUC } from "@/shared/services/api";
import { useAuth } from "../../../context/AuthContext";
import { parsearError } from "../../../utils/parsearError";

export default function ModalAgregarCliente({ onClose, agregarCliente }) {
  const { user } = useAuth();

  const [cliente, setCliente] = useState({
    tipo: "Persona Jurídica",
    tipo_documento: "DNI",
    razon_social: "",
    ruc: "",
    dni: "",
    telefono: "",
    email: "",
    domicilio_fiscal: "",
    representante_legal: "",
    dni_representante: "",
  });

  const [errores, setErrores] = useState({});

  const [rucNoEncontrado, setRucNoEncontrado] = useState(false);

  const handleBuscarRUC = async () => {
    const rucLimpio = cliente.ruc?.trim();
    if (!rucLimpio || rucLimpio.length !== 11) {
        setRucNoEncontrado(false);
        return;
    }
    
    try {
        const resultado = await buscarDatosPorRUC(rucLimpio);

        if (!resultado || !resultado.razon_social) {
            setRucNoEncontrado(true);
            setCliente((prev) => ({
            ...prev,
            razon_social: "",
            domicilio_fiscal: "",
            }));
        return;
      }

      setRucNoEncontrado(false);
      setCliente((prev) => ({
      ...prev,
      razon_social: resultado.razon_social,
      domicilio_fiscal: resultado.domicilio_fiscal,
    }));
    } catch (error) {
        console.error("Error buscando en SUNAT:", error);
        setRucNoEncontrado(true);
    }  
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clienteSeguro = { ...cliente };
    if (!clienteSeguro.tipo_documento) {
      clienteSeguro.tipo_documento = "DNI";
    }

    const erroresValidados =
      cliente.tipo === "Persona Jurídica"
        ? validarClienteJuridico(cliente)
        : validarClienteNatural(cliente);

    if (Object.keys(erroresValidados).length > 0) {
      setErrores(erroresValidados);
      toast.warning("Completa los campos correctamente");
      return;
    }

    try {
      const clienteLimpio = { ...cliente };
      Object.keys(clienteLimpio).forEach((key) => {
        if (clienteLimpio[key] === "") clienteLimpio[key] = null;
      });

      if (user && user.id) {
        clienteLimpio.creado_por = user.id;
      } else {
        console.error("⚠️ Usuario no encontrado en AuthContext");
        toast.error("Error de autenticación. Cierra sesión e ingresa de nuevo.");
        return; 
      }

      const res = await clientesService.crear(clienteLimpio);
      if (res.data && res.data.cliente) {
        agregarCliente(res.data.cliente);
        toast.success("Cliente agregado correctamente");
        onClose();
      } else {
        toast.error("Error al guardar el cliente");
      }
    } catch (error) {
      console.error("❌ Error al agregar cliente:", error);
      toast.error(parsearError(error));
    }
  };

  return (
    <div className="centro-modal">
      <div className="modal-content">
        <h3>Agregar Cliente</h3>
        <ClienteForm
          cliente={cliente}
          setCliente={setCliente}
          errores={errores}
          setErrores={setErrores}
          onCancel={onClose}
          onSubmit={handleSubmit}
          handleBuscarRUC={handleBuscarRUC}
          rucNoEncontrado={rucNoEncontrado}
        />
      </div>
    </div>
  );
}