import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { Label } from "@/components/ui/label";

import { MoreVertical, Pencil, Eye } from "lucide-react";
import dataMantenimientoService from "../services/dataMantenimientoService";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";


const GestionDataMantenimiento = () => {
  const [dataMantenimiento, setDataMantenimiento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [infoMsg, setInfoMsg] = useState(null);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("crear"); // "crear" | "editar" | "ver"
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    valor: "",
  });

  const fetchDataMantenimiento = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
     
      const res = await dataMantenimientoService.getDataMantenimiento();
      console.log('res', res);
      setDataMantenimiento(res?.data || []);
    } catch (e) {
      console.log('error', e);
      setErrorMsg(e?.message ?? "No se pudo cargar la lista de mantenimiento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataMantenimiento();
  }, []);


  const [filtered, setFiltered] = useState([]);

  const filteredData = useMemo(() => {
    return dataMantenimiento.filter((item) => {
      return Object.values(item).some((value) => String(value).toLowerCase().includes(search.toLowerCase()));
    });
  }, [dataMantenimiento, search]);

  useEffect(() => {
    setFiltered(filteredData);
  }, [filteredData]);


  const openView = (data) => {
    setViewMode("ver");
    setEditing(data);
    setForm({
      nombre: data.nombre ?? "",
      descripcion: data.descripcion ?? "",
      valor: data.valor ?? "",
    });
    setDialogOpen(true);
  };

  const openEdit = (data) => {
    setViewMode("editar");
    setEditing(data);
    setForm({
       nombre: data.nombre ?? "",
      descripcion: data.descripcion ?? "",
      valor: data.valor ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setErrorMsg(null);
      const payload = {
        nombre: form.nombre ?? "",
      descripcion: form.descripcion ?? "",
      valor: form.valor ?? "",
      };
      if (viewMode === "crear") {
        //
      } else if (viewMode === "editar" && editing) {
        await dataMantenimientoService.editDataMantenimiento(editing.id, payload);
        setInfoMsg("Data de mantenimiento actualizado correctamente");
      }
      setDialogOpen(false);
      await fetchDataMantenimiento();
    } catch (e) {
      setErrorMsg("No se pudo guardar la data de mantenimiento");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de datos de mantenimiento</h1>
            <p className="text-gray-600 mt-1">Administra los datos de mantenimiento</p>
          </div>
          
        </div>

        {/* Filtros */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por nombre"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Alertas simples */}
        {(errorMsg || infoMsg) && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              errorMsg ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <div className="flex items-start justify-between">
              <p>{errorMsg || infoMsg}</p>
              <button onClick={() => (errorMsg ? setErrorMsg(null) : setInfoMsg(null))} className="ml-4 text-xs underline">
                cerrar
              </button>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Descripcion</th>
                  <th className="px-4 py-3 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading && (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                      Cargando...
                    </td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-500" colSpan={7}>
                      No se encontraron datos del mantenimiento
                    </td>
                  </tr>
                )}

                {!loading &&
                  filtered.map((item) => {
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">{item.nombre}</td>
                        <td className="px-4 py-3">{item.descripcion}</td>
                        <td className="px-4 py-3">{item.valor}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openView(item)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(item)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                               
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dialogo Crear / Editar / Ver */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogContent className="sm:max-w-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {viewMode === "editar" && "Editar dato de mantenimiento"}
                {viewMode === "ver" && "Detalle del dato de mantenimiento"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {viewMode === "ver"
                  ? "Consulta la información del dato de mantenimiento."
                  : "Completa los campos y guarda los cambios."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4">

              {/* Nombre */}
              <div className="grid gap-2">
                <Label>Nombre</Label>
                <Input
                  type="text"
                  placeholder="Ej: Trabajador de oficina"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  disabled={viewMode === "ver"}
                />
              </div>

              

              {/* Descripcion */}
              <div className="grid gap-2">
                <Label>Descripción</Label>
                <Input
                  type="text"
                  placeholder="Ej: Descripción del dato de mantenimiento"
                  value={form.descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  disabled={viewMode === "ver"}
                />
              </div>

              {/* Valor */}
              <div className="grid gap-2">
                <Label>Valor</Label>
                <Input
                  type="text"
                  placeholder="Ej: 1"
                  value={form.valor}
                  onChange={(e) => setForm((f) => ({ ...f, valor: e.target.value }))}
                  disabled={viewMode === "ver"}
                />
              </div>

            </div>

            <AlertDialogFooter className="mt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cerrar
              </Button>
              {viewMode !== "ver" && (
                <Button onClick={handleSave}>
                  {viewMode === "crear" ? "Crear" : "Guardar cambios"}
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default GestionDataMantenimiento;
