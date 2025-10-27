import useGestionCondiciones from "../hooks/useGestionCondiciones";
import { useNavigate } from "react-router-dom";
import ResponderCondicionModal from "../components/ResponderCondicionModal";
import LoaderPerPage from "../../../shared/components/LoaderPerPage";
import EstadoVacio from "../components/EstadoVacio";

export default function GestionCondiciones() {
  const { condiciones, loading, guardarCondicion } = useGestionCondiciones();
  const navigate = useNavigate();
  if (loading) return <LoaderPerPage texto="Cargando condiciones..." />;

  return (
    <div className="p-15 max-w-[90%] mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Solicitudes de Condiciones de Alquiler
        </h2>
        
        {condiciones.length === 0 && (
            <EstadoVacio
                title="No hay solicitudes de condiciones pendientes"
                description="Actualmente no existe solicitudes de condiciones de alquiler. Cuando un comercial registre una solicitud aparecerá aquí."
                icon="📁"
                action={
                    <button
                        onClick={() => navigate("/contratos")}
                        className="mt-4 px-5 py-2 bg-innova-blue text-white rounded-xl hover:bg-innova-blue/90 transition"
                        >
                        Ir a Contratos
                    </button>
                }   
            />
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 ">
            {condiciones.map((c) => {
                const cot = c.contrato_relacionado || {};
                const cliente = cot.cliente || {};
                const obra = cot.obra || {};
                const usuario = cot.usuario?.trabajador || {};
                const usuarioNombre = usuario.nombres + " " + usuario.apellidos;
                const fecha = new Date(c.created_at).toLocaleDateString("es-PE", {
                    year: "numeric", month: "short", day: "numeric"
                });

                return (
                    <div
                        key={c.id}
                        className="bg-white w-125 border rounded-2xl shadow-sm p-5 flex flex-col gap-1 hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-start gap-3 flex-wrap">
                            <div className="text-sm leading-snug text-gray-700">
                                <p className="font-semibold text-base text-gray-900">
                                    Cotización: <span className="text-primary">{cot.ref_contrato || "—"}</span>
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