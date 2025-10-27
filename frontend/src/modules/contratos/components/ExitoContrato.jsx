import { useNavigate } from "react-router-dom";

export default function ExitoContrato() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <h2 className="mt-4 text-2xl font-semibold tracking-tight">
        ¡Contrato creado con éxito!
      </h2>
      <p className="mt-1 text-sm text-gray-600 max-w-xl">
        Guardamos tu contrato correctamente. Puedes volver al panel principal o ir a la tabla de contratos.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition"
        >
          Volver al Dashboard
        </button>
        <button
          type="button"
          onClick={() => navigate("/contratos")}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:opacity-90 transition"
        >
          Ir a Contratos
        </button>
      </div>
    </div>
  );
}