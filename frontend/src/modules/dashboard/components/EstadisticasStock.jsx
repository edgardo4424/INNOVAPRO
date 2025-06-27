import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import stockPiezasService from "@/modules/stockPiezas/services/stockPiezasService";
import {
   AlertTriangle,
   Boxes,
   CheckCircle,
   Clock,
   Handshake,
   Package,
   TrendingDown,
   TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const EstadisticasStock = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const result = await stockPiezasService.obtenerStockPiezas();
            setData(result.piezas);
         } catch (error) {
            console.error("Error al obtener el stock de piezas:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   console.log(data);

   const summaryStats = {
      totalItems: data.length,
      outOfStock: data.filter((item) => item.stock_disponible <= 0).length,
      lowStock: data.filter(
         (item) => item.stock_disponible > 0 && item.stock_disponible <= 100
      ).length,
      mediumStock: data.filter(
         (item) => item.stock_disponible > 100 && item.stock_disponible <= 200
      ).length,
      higtStock: data.filter((item) => item.stock_disponible > 200).length,
      totalQuoted: data.reduce(
         (sum, item) => sum + Number(item["Por aprobar"]),
         0
      ),
      totalStock: data.reduce((sum, item) => sum + item.stock_disponible, 0),
   };
   return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full ">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Tipos de Piezas
               </CardTitle>
               <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">
                  {summaryStats.totalItems}
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Sin Stock
               </CardTitle>
               <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-red-600">
                  {summaryStats.outOfStock}
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Inventario bajo
               </CardTitle>
               <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-orange-600">
                  {summaryStats.lowStock}
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                 Inventario medio
               </CardTitle>
               <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-yellow-600">
                  {summaryStats.mediumStock}
               </div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Inventario Alto</CardTitle>
               <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-green-600">
                  {summaryStats.higtStock}
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Piezas en almacen
               </CardTitle>
               <Boxes className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-green-600">
                  {summaryStats.totalStock.toLocaleString()}
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Cotizadas</CardTitle>
               <Handshake className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-blue-600">
                  {summaryStats.totalQuoted}
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
export default EstadisticasStock;
