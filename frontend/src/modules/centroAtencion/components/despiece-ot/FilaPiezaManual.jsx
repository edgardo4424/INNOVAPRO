// INNOVA PRO+ v1.3.4
import React from "react";

export default function FilaPiezaManual({ pieza, actualizarPieza, eliminarPieza }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    actualizarPieza(pieza.id, name, value);
  };

  return (
    <div className="grid grid-cols-5 gap-2 items-center">
      <input
        name="nombre"
        className="p-2 border rounded col-span-2"
        value={pieza.nombre || ""}
        placeholder="Nombre pieza"
        onChange={handleChange}
      />
      <input
        name="cantidad"
        className="p-2 border rounded"
        value={pieza.cantidad || ""}
        placeholder="Cantidad"
        onChange={handleChange}
      />
      <input
        name="peso_kg"
        className="p-2 border rounded"
        value={pieza.peso_kg || ""}
        placeholder="Peso (kg)"
        onChange={handleChange}
      />
      <button
        onClick={() => eliminarPieza(pieza.id)}
        className="text-red-500 hover:underline text-sm"
      >
        Eliminar
      </button>
    </div>
  );
}