"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Users, TrendingUp, Search, Plus } from "lucide-react";
import { VacationModal } from "../Components/VacationModal";
import { CalendarioVacaciones } from "../Components/CalendarioVacaciones";
import TableTrabajadoresVacaciones from "../Components/TableTrabajadoresVacaciones";
import beneficiosService from "../services/beneficiosService";

export default function GestionVacaciones() {
   const [employees, setEmployees] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [activeTab, setActiveTab] = useState("trabajadores");

   const fetchEmployees = async () => {
      setLoading(true);
      // Simula una llamada a API
      try {
         const res = await beneficiosService.getTrabajadoresVacaciones();
         console.log(res.data.trabajadoresXvacaciones);

         setEmployees(res.data.trabajadoresXvacaciones.reverse()); // mockData.json debe exportar el array
         setLoading(false);
      } catch (error) {
         console.log(error);
      }
   };
   useEffect(() => {
      fetchEmployees();
   }, []);

   const stats = useMemo(() => {
      const totalEmployees = employees.length;
      const activeVacations = employees.filter((emp) =>
         emp.vacaciones?.some((vac) => {
            const today = new Date();
            return (
               today >= new Date(vac.fecha_inicio) &&
               today <= new Date(vac.fecha_termino)
            );
         })
      ).length;

      const totalDays = employees.reduce(
         (sum, emp) =>
            sum +
            (emp.vacaciones?.reduce((acc, vac) => acc + vac.dias_tomados, 0) ||
               0),
         0
      );

      const avgDays =
         totalEmployees > 0 ? Math.round(totalDays / totalEmployees) : 0;

      return { totalEmployees, activeVacations, avgDays };
   }, [employees]);

   const filteredEmployees = useMemo(() => {
      return employees.filter(
         (emp) =>
            `${emp.nombres} ${emp.apellidos}`
               .toLowerCase()
               .includes(searchTerm.toLowerCase()) ||
            emp.cargo?.area?.nombre
               ?.toLowerCase()
               .includes(searchTerm.toLowerCase())
      );
   }, [searchTerm, employees]);

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                     Gestión de Vacaciones
                  </h1>
                  <p className="text-gray-600 mt-1">
                     Administra las vacaciones de tus trabajadores
                  </p>
               </div>
               {!loading && (
                  <VacationModal
                     empleados={employees}
                     fetchEmployees={fetchEmployees}
                  />
               )}
            </div>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {loading ? (
                  <p className="col-span-3 text-center text-sm text-gray-500">
                     Cargando datos...
                  </p>
               ) : (
                  <>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">
                              Total Trabajadores
                           </CardTitle>
                           <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">
                              {stats.totalEmployees}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Empleados activos
                           </p>
                        </CardContent>
                     </Card>

                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">
                              Vacaciones Activas
                           </CardTitle>
                           <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                           <div className="text-2xl font-bold">
                              {stats.activeVacations}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              En curso actualmente
                           </p>
                        </CardContent>
                     </Card>
                  </>
               )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
               <button
                  onClick={() => setActiveTab("trabajadores")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                     activeTab === "trabajadores"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                  }`}
               >
                  Trabajadores
               </button>
               <button
                  onClick={() => setActiveTab("calendario")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                     activeTab === "calendario"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                  }`}
               >
                  Calendario
               </button>
            </div>

            {/* Contenido */}
            {loading ? (
               <div className="text-center text-sm text-gray-500 py-10">
                  Cargando trabajadores...
               </div>
            ) : activeTab === "trabajadores" ? (
               <Card>
                  <CardHeader>
                     <CardTitle>Lista de Trabajadores</CardTitle>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                           placeholder="Buscar por nombre, razón social o área..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-10"
                        />
                     </div>
                  </CardHeader>
                  <CardContent>
                     <TableTrabajadoresVacaciones
                        filteredEmployees={filteredEmployees}
                     />
                  </CardContent>
               </Card>
            ) : (
               <CalendarioVacaciones empleados={employees} />
            )}
         </div>
      </div>
   );
}
