import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingDown, TrendingUp, CheckCircle, Boxes, Handshake } from "lucide-react";
import EstadisticasStock from "../components/EstadisticasStock";
import AdminDashboard from "./AdminDashboard"; // para componer en CEO

// KPI pequeño para CEO
const KPI = ({ title, value, icon: Icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs font-medium text-neutral-600">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 opacity-70" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export const StockDashboard = ({ areaCargo, rol }) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-2">
      <h2 className="text-2xl font-semibold text-neutral-800">Resumen del Stock de Piezas</h2>
      {areaCargo?.area_id && <Badge variant="secondary">Área #{areaCargo.area_id}</Badge>}
    </div>
    <EstadisticasStock />
  </div>
);

export const CEODashboard = ({ areaCargo, rol }) => (
  <div className="flex flex-col gap-8">
    <div className="flex items-center gap-2">
      <h2 className="text-2xl font-semibold text-neutral-800">Visión General (CEO)</h2>
      <Badge className="bg-[#1b274a]">CEO</Badge>
    </div>

    {/* KPIs ejecutivos rápidos */}
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <KPI title="Tipos de Piezas" value="550" icon={Package} />
      <KPI title="Inventario Bajo" value="258" icon={TrendingDown} />
      <KPI title="Inventario Medio" value="292" icon={TrendingUp} />
      <KPI title="Inventario Alto" value="0" icon={CheckCircle} />
      <KPI title="Piezas en Almacén" value="57,169" icon={Boxes} />
      <KPI title="Cotizadas" value="0" icon={Handshake} />
    </div>

    {/* Stock real */}
    {/* <StockDashboard areaCargo={areaCargo} rol={rol} /> */}

    {/* Resumen administrativo reutilizado */}
    <AdminDashboard areaCargo={areaCargo} rol={rol} />
  </div>
);