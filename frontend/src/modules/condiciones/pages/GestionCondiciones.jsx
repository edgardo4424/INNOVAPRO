import useGestionCondiciones from "../hooks/useGestionCondiciones";
import ResponderCondicionModal from "../components/ResponderCondicionModal";
import LoaderPerPage from "../../../shared/components/LoaderPerPage";

export default function GestionCondiciones() {
  const { condiciones, loading, guardarCondicion } = useGestionCondiciones();

  if (loading) return <LoaderPerPage texto="Cargando condiciones..." />;

  return (
    <div className="p-15 max-w-[90%] mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            📋 Solicitudes de Condiciones Pendientes
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 ">
            {condiciones.map((c) => {
                const cot = c.cotizacion || {};
                const cliente = cot.cliente || {};
                const obra = cot.obra || {};
                const usuario = cot.usuario || {};
                const usuarioNombre = usuario.trabajador.nombres + " " + usuario.trabajador.apellidos;
                const fecha = new Date(c.created_at).toLocaleDateString("es-PE", {
                    year: "numeric", month: "short", day: "numeric"
                });

                return (
                    <div
                        key={c.id}
                        className="bg-white border rounded-2xl shadow-sm p-5 flex flex-col gap-1 hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-start gap-3 flex-wrap">
                            <div className="text-sm leading-snug text-gray-700">
                                <p className="font-semibold text-base text-gray-900">
                                    Cotización: <span className="text-primary">{cot.codigo_documento || "—"}</span>
                                </p>
                                <p>Cliente: {cliente.razon_social || "—"}</p>
                                <p>RUC: {cliente.ruc || "—"}</p>
                                <p>Obra: {obra.nombre || "—"}</p>
                                <p>Dirección: {obra.direccion || "—"}</p>
                                <p>Solicitado por: {usuarioNombre || "—"}</p>
                                <p className="text-xs mt-1 text-gray-400">📅 {fecha}</p>
                            </div>

                            <ResponderCondicionModal
                                condicion={c}
                                onGuardar={guardarCondicion}
                            />
                        </div>

                        <div className="bg-gray-50 border rounded-md p-2 text-sm text-gray-800 whitespace-pre-wrap">
                            {c.comentario_solicitud}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}