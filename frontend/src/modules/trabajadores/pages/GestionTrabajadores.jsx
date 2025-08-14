"use client"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, DollarSign, Building, Loader2, AlertCircle, Edit } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import trabajadoresService from "../services/trabajadoresService"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"





export default function CompGestionTrabajadoresonent() {
  const [trabajadores, setTrabajadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [areaFilter, setAreaFilter] = useState("all")
  const [pensionFilter, setPensionFilter] = useState("all");
  const navigate=useNavigate()

  // Función para cargar trabajadores
  const fetchTrabajadores = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await trabajadoresService.getTrabajadores()
      console.log("arreglo de datos:", response.data)
      setTrabajadores(response.data)
    } catch (error) {
      console.error("Error al cargar trabajadores", error)
      setError("Error al cargar los datos de trabajadores. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchTrabajadores()
  }, [])

  // Get unique areas for filter
  const uniqueAreas = useMemo(() => {
    const areas = trabajadores.map((emp) => emp.cargo.area.nombre)
    return [...new Set(areas)]
  }, [trabajadores])

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return trabajadores.filter((employee) => {
      const matchesSearch =
        employee.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.numero_documento.includes(searchTerm) ||
        employee.cargo.nombre.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesArea = areaFilter === "all" || employee.cargo.area.nombre === areaFilter
      const matchesPension = pensionFilter === "all" || employee.sistema_pension === pensionFilter

      return matchesSearch && matchesArea && matchesPension
    })
  }, [trabajadores, searchTerm, areaFilter, pensionFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEmployees = filteredEmployees.length
    const totalSalary = filteredEmployees.reduce((sum, emp) => sum + emp.sueldo_base, 0)
    const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0
    const afpCount = filteredEmployees.filter((emp) => emp.sistema_pension === "AFP").length

    return {
      totalEmployees,
      avgSalary,
      afpCount,
      onpCount: totalEmployees - afpCount,
    }
  }, [filteredEmployees])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando trabajadores...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <button
              onClick={fetchTrabajadores}
              className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
            >
              Reintentar
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Trabajadores</h1>
          <p className="text-muted-foreground">Administra y visualiza la información de tu personal</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sueldo Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.avgSalary)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AFP</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.afpCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ONP</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onpCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Filtra y busca empleados por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, documento o cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {uniqueAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={pensionFilter} onValueChange={setPensionFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sistema de pensión" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sistemas</SelectItem>
                <SelectItem value="AFP">AFP</SelectItem>
                <SelectItem value="ONP">ONP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
          <CardDescription>
            Mostrando {filteredEmployees.length} de {trabajadores.length} empleados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-300">
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Cargo / Área</TableHead>
                  <TableHead>Fecha Ingreso</TableHead>
                  <TableHead>Sueldo Base</TableHead>
                  <TableHead>Sistema Pensión</TableHead>
                  <TableHead>Beneficios</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {employee.nombres} {employee.apellidos}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {employee.id} | Filial: {employee.filial_id}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {employee.tipo_documento}
                        </Badge>
                        <div className="text-sm">{employee.numero_documento}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.cargo.nombre}</div>
                        <div className="text-sm text-muted-foreground">{employee.cargo.area.nombre}</div>
                      </div>
                    </TableCell>

                    <TableCell>{formatDate(employee.contrato_mas_antiguo?.fecha_inicio)}</TableCell>

                    <TableCell className="font-medium">{formatCurrency(employee.sueldo_base)}</TableCell>

                    <TableCell>
                      <Badge variant={employee.sistema_pension === "AFP" ? "default" : "secondary"}>
                        {employee.sistema_pension}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {employee.asignacion_familiar && (
                          <Badge variant="outline" className="text-xs">
                            Asig. Familiar
                          </Badge>
                        )}
                        {employee.quinta_categoria && (
                          <Badge variant="outline" className="text-xs">
                            5ta Categoría
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size={'icon'} className={"size-8"} variant={'outline'} 
                      onClick={()=>navigate(`/editar-trabajador?id=${employee.id}`)}>
                          <Edit/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEmployees.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              {trabajadores.length === 0
                ? "No hay empleados registrados."
                : "No se encontraron empleados que coincidan con los filtros aplicados."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
