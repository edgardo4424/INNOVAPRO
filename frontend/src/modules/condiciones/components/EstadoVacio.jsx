export default function EstadoVacio({
  title = "Sin registros disponibles",
  description = "No se encontraron datos para mostrar en este módulo.",
  icon = "📭",
  action = null, 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 shadow-inner">
      <div className="text-5xl mb-3 opacity-80">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-500 mt-1 max-w-md">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
