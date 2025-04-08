import { useState } from "react";

export default function useValidacionCampo(valorInicial = "", validador, mensajeError) {
  const [valor, setValor] = useState(valorInicial);
  const [error, setError] = useState("");

  const onChange = (e, validadorDinamico = validador) => {
    const value = e.target.value;
    setValor(value);

    if (!validadorDinamico(value)) {
      setError(mensajeError);
    } else {
      setError("");
    }
  };

  return {
    valor,
    onChange,
    error,
    setValor,
    setError
  };
}