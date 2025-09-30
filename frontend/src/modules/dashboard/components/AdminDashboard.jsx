// INNOVA PRO+ v1.2.4 — AdminDashboard (Perú: Facturación + Planilla)
// Ruta: frontend/src/modules/dashboard/components/AdminDashboard.jsx

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Receipt, TrendingDown, TrendingUp, Users, CheckCircle, FileText, AlertTriangle, Shield,
  CalendarDays, ListChecks, BarChart3, Banknote
} from "lucide-react";

// KPI reutilizable
const KPI = ({ title, value, icon: Icon, hint, className = "" }) => (
  <Card className={`hover:shadow transition ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs font-medium text-neutral-600">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 opacity-70" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </CardContent>
  </Card>
);

export default function AdminDashboard({ rol }) {
  // Mocks (solo para UI). Reemplazar cuando existan servicios reales.
  const data = useMemo(() => ({
    facturadoMes: "S/. —",
    pendientesCobro: "S/. —",
    facturasVencidas: 0,
    costoPlanillaMes: "S/. —",
    quintaMes: "S/. —",
    trabajadoresActivos: 0,
  }), []);

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold text-neutral-800">Panel Administrativo</h2>
        <Badge variant="secondary">Perú — Facturación + Planilla</Badge>
        {rol && <Badge variant="outline" className="ml-2">{rol}</Badge>}
      </div>

      {/* KPIs (Perú) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPI title="Facturado del mes" value={data.facturadoMes} icon={Receipt} hint="ventas facturadas — mes actual" />
        <KPI title="Pendiente de cobro" value={data.pendientesCobro} icon={TrendingDown} hint="aging: 0–30 / 31–60 / +60" />
        <KPI title="Facturas vencidas" value={data.facturasVencidas} icon={AlertTriangle} hint="acciones inmediatas de cobranza" />
        <KPI title="Costo Planilla (mes)" value={data.costoPlanillaMes} icon={Users} hint="bruto + beneficios (grati/CTS)" />
        <KPI title="Retenciones 5ta (mes)" value={data.quintaMes} icon={TrendingUp} hint="según proyección y previos" />
        <KPI title="Trabajadores activos" value={data.trabajadoresActivos} icon={CheckCircle} hint="en planilla" />
      </div>

      {/* BLOQUES ÚTILES Y 100% RELEVANTES AL CONTEXTO (Perú) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Cobranza — táctico y sin inventos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <CardTitle>Cobranza — Acciones que sí mueven la aguja</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Prioriza cuentas <b>+60 días</b>: contacto hoy con compromiso y fecha.</li>
              <li>Envía <b>estado de cuenta</b> con sustento: factura + guía + conformidad de obra.</li>
              <li>Usa semáforo: Verde (0–30), Ámbar (31–60), Rojo (+60) para coordinar con Comercial/Operaciones.</li>
              <li>Negocia <b>parcialidades</b> y registra cronograma.</li>
              <li>Sin visto bueno, <b>no despachar</b> a clientes en rojo (coordinado con Almacén).</li>
              <li>Recordatorios por WhatsApp/mail antes de vencimiento (texto estándar + documento).</li>
              <li>Cuadra diferencias por <b>retenciones</b> y procesos tributarios SUNAT (evita notas de crédito tardías).</li>
            </ol>
          </CardContent>
        </Card>

        {/* Cierre de Planilla — basado en lo que ya trabajamos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              <CardTitle>Cierre de Planilla — Checklist operativo (Perú)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li>Validar <b>altas/bajas</b> y renovaciones de contratos.</li>
              <li>Cuadrar <b>asistencia</b>, <b>horas extra</b> y <b>licencias</b> con jefaturas.</li>
              <li><b>Quinta Categoría</b>: certificados, “sin previos”, multiempleo (principal/secundaria) y previos internos.</li>
              <li>Recalcular <b>gratificaciones/CTS</b> ante cambios salariales.</li>
              <li>Generar <b>pre–boleta</b> y validar outliers.</li>
              <li>Emitir boletas oficiales con <b>firma digital + hash + QR</b> (conservación 5+ años).</li>
              <li><b>PLAME/PDT</b> y pagos <b>ESSALUD</b> + <b>AFP/ONP</b> según cronograma SUNAT (por RUC).</li>
            </ul>
          </CardContent>
        </Card>

        {/* Quinta Categoría — Control que evita errores caros */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <CardTitle>Quinta Categoría — Control Operativo (Perú/SUNAT)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li>Certificados de quinta: <b>cargados y vigentes</b> por DNI.</li>
              <li>Declaración <b>“Sin Previos”</b> cuando aplique (jurada).</li>
              <li><b>Multiempleo</b>: definir principal/secundaria y <b>previos internos</b> vs externos.</li>
              <li>Usar previsualización y revisar <b>retención base del mes</b> por trabajador.</li>
            </ul>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recalcular al cambiar sueldo, gratificaciones proyectadas o previos.</li>
              <li>Exportar CSV para auditoría (<b>dni, base, retención, fuente previos</b>).</li>
              <li>Marcar casos con <b>retenciones previas atípicas</b> o <b>base cero</b>.</li>
              <li>Guardar evidencias y reportes con <b>hash + QR</b>.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Compliance Perú — lo crítico que ya exigimos en el proyecto */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <CardTitle>Compliance — Perú (SUNAT / SUNAFIL)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Trazabilidad total</b>: quién y cuándo generó/alteró planilla o facturas.</li>
              <li><b>Segregación de funciones</b>: emisión, aprobación y pago separados.</li>
              <li><b>Archivo 5+ años</b>: boletas, contratos y reportes (hash + QR para integridad).</li>
              <li><b>Backups diarios</b> y verificación de restauración.</li>
              <li>Bitácora de cambios en <b>liquidaciones</b>, <b>descuentos</b> y <b>adelantos</b>.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Políticas de pagos — aterrizado a nuestro flujo */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4" />
              <CardTitle>Pagos Prioritarios — Caja</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Priorizar: <b>planilla</b>, obligaciones <b>SUNAT</b> y <b>proveedores críticos</b>.</li>
              <li>Pagos calendarizados (corte semanal) para evitar pagos ad–hoc.</li>
              <li>Validar <b>OC</b>, <b>guía</b> y <b>conformidad</b> antes de pagar.</li>
              <li>Reglas de <b>adelantos de sueldo</b> con tope y aprobación documentada.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Reportes clave — lo que sí necesitamos mirar cada mes */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <CardTitle>Reportes Clave Mensuales</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Estado de Cuenta por Cliente</b> con aging y compromisos.</li>
              <li><b>Flujo Proyectado 30–60 días</b> (cobros vs egresos).</li>
              <li><b>Planilla por filial/área</b> (centro de costo).</li>
            </ul>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Quinta Categoría</b> (resumen y outliers por DNI).</li>
              <li><b>Beneficios Sociales</b>: grati, CTS, vacaciones pendientes.</li>
              <li><b>Morosidad</b> y <b>top deudores</b> con evolución.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Placeholders listos para enchufar gráficas reales cuando existan endpoints */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Flujo proyectado (30 días)</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Conecta aquí <code>facturacionService.getProyeccionFlujo()</code> (entradas vs salidas).
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Distribución de Planilla por Área</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Conecta aquí <code>planillaService.getDistribucionPorArea()</code>.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}