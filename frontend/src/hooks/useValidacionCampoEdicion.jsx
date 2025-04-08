import { useEffect, useState } from "react";

export default function useValidacionCampoEdicion(valorProp = "", validador, mensajeError) {
  const [valor, setValor] = useState(valorProp || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setValor(valorProp || "");
    setError(""); // Limpia errores antiguos al cambiar el valor externo
  }, [valorProp]);

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