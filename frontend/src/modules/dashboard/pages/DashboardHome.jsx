import { Clock, BarChart3, Users, Shield, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EstadisticasStock from "../components/EstadisticasStock";

  export default function DashboardHome() {
 
    return (
      <div className=" min-h-full flex-1  flex flex-col items-center p-4"> 
        <h2 className="self-start text-start mt-2 mb-6 text-3xl font-semibold text-neutral-800">Resumen del Stock de Piezas</h2>
        <EstadisticasStock/>
      </div>
    );
  }