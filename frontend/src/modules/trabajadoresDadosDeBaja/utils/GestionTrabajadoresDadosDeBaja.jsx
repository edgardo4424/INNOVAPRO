import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
   PlusCircle,
   MoreVertical,
   Pencil,
   Eye,
   Trash2,
   Power,
   RefreshCw,
   Filter,
} from "lucide-react";
//import beneficiosService from "../services/beneficiosService";
//import { formatoDinero } from "../utils/formatoDinero";
//import { formatoFechaBeneficios } from "../utils/formatoFechaBeneficios";
import { toast } from "sonner";

const GestionTrabajadoresDadosDeBaja = () => {
   const [bonos, setBonos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [trabajadores, setTrabajadores] = useState([]);

   const [errorMsg, setErrorMsg] = useState(null);
   const [infoMsg, setInfoMsg] = useState(null);

   const [search, setSearch] = useState("");

   const [dialogOpen, setDialogOpen] = useState(false);
   const [viewMode, setViewMode] = useState("crear"); // "crear" | "editar" | "ver"
   const [editing, setEditing] = useState(null);

   const [form, setForm] = useState({
      trabajador_id: "",
      fecha: "",
      monto: "",
      observacion: "",
      tipo: "",
   });

   const fetchBajas = async () => {
      try {
         setLoading(true);
         const res = await beneficiosService.getBonos();
         const trab = await beneficiosService.getTrabajadores();
         const raw = res?.data?.bonos ?? res?.data ?? [];
         const list = Array.isArray(raw) ? raw : [raw];
         setBonos(list);
         console.log(list);

         setTrabajadores(trab.data);
      } catch (e) {
         console.error(e?.message ?? "No se pudo cargar la lista de bonos");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchBajas();
   }, []);

   const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();
      return bonos
         .filter((bono) => {
            if (!term) return true;
            const t = bono.trabajadores || {};
            const full = `${t.nombres ?? ""} ${t.apellidos ?? ""} ${
               t.numero_documento ?? ""
            }`.toLowerCase();
            return full.includes(term);
         })
         .sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
         );
   }, [bonos, search]);

   const openCreate = () => {
      setViewMode("crear");
      setEditing(null);
      setForm({
         trabajador_id: "",
         fecha: new Date().toISOString().slice(0, 10),
         monto: "",
         observacion: "",
         tipo: "",
      });
      setDialogOpen(true);
   };

   const openView = (bono) => {
      setViewMode("ver");
      setEditing(bono);
      setForm({
         trabajador_id: bono.trabajador_id ?? "",
         fecha: bono.fecha ?? "",
         monto: String(bono.monto ?? ""),
         observacion: bono.observacion ?? "",
         tipo: bono.tipo ?? "",
      });
      setDialogOpen(true);
   };

   const openEdit = (bono) => {
      setViewMode("editar");
      setEditing(bono);
      setForm({
         trabajador_id: bono.trabajador_id ?? "",
         fecha: bono.fecha ?? "",
         monto: String(bono.monto ?? ""),
         observacion: bono.observacion ?? "",
         tipo: bono.tipo ?? "",
      });
      setDialogOpen(true);
   };

   const handleSave = async () => {
      try {
         setErrorMsg(null);
         const payload = {
            trabajador_id: form.trabajador_id
               ? Number(form.trabajador_id)
               : null,
            fecha: form.fecha,
            monto: Number(form.monto || 0),
            observacion: form.observacion,
            tipo: form.tipo,
         };
         if (viewMode === "crear") {
            await beneficiosService.crearBono(payload);
            toast.success("Bono creado correctamente");
         } else if (viewMode === "editar" && editing) {
            payload.id = editing.id;
            await beneficiosService.editarBono(payload);
            toast.success("Bono actualizado correctamente");
         }
         setDialogOpen(false);
         await fetchBonos();
      } catch (e) {
         toast.error(
            e?.response?.data?.message ??
               e?.message ??
               "No se pudo guardar el bono"
         );
      }
   };

   const handleDelete = async (bono) => {
      try {
         await beneficiosService.eliminarBono(bono.id);
         toast.success("Bono eliminado");
         await fetchBonos();
      } catch (e) {
         toast.error(e?.message ?? "No se pudo eliminar el bono");
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                     Trabajadores dados de Baja
                  </h1>
                  
               </div>
               <div className="flex gap-2">
                  <Button
                     onClick={openCreate}
                     className="bg-innova-blue hover:bg-innova-blue/90"
                  >
                     Dar de Baja <PlusCircle className="ml-2 h-5 w-5" />
                  </Button>
               </div>
            </div>

            {/* Filtros */}
            <div className="bg-white border rounded-xl p-4 shadow-sm">
               <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                  <div className="relative flex-1">
                     <Input
                        placeholder="Buscar por nombre, apellido, DNI u observación..."
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
                     errorMsg
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}
               >
                  <div className="flex items-start justify-between">
                     <p>{errorMsg || infoMsg}</p>
                     <button
                        onClick={() =>
                           errorMsg ? setErrorMsg(null) : setInfoMsg(null)
                        }
                        className="ml-4 text-xs underline"
                     >
                        Cerrar
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
                           <th className="px-4 py-3 font-medium">DNI</th>
                           <th className="px-4 py-3 font-medium">Trabajador</th>
                           <th className="px-4 py-3 font-medium">Fecha de Ingreso</th>
                           <th className="px-4 py-3 font-medium">Fecha de Baja</th>
                           <th className="px-4 py-3 font-medium">Motivo</th>
                           <th className="px-4 py-3 font-medium">
                              Estado liquidación
                           </th>
                           <th className="px-4 py-3 font-medium">
                              Neto a Liquidar
                           </th>
                           
                        </tr>
                     </thead>
                     <tbody className="divide-y">
                        {loading && (
                           <tr>
                              <td
                                 className="px-4 py-6 text-center text-gray-500"
                                 colSpan={7}
                              >
                                 Cargando...
                              </td>
                           </tr>
                        )}

                        {!loading && filtered.length === 0 && (
                           <tr>
                              <td
                                 className="px-4 py-6 text-center text-gray-500"
                                 colSpan={7}
                              >
                                 No se encontraron bonos
                              </td>
                           </tr>
                        )}

                        {!loading &&
                           filtered.map((b) => {
                              const t = b.trabajadores || {};
                              return (
                                 <tr key={b.id} className="hover:bg-gray-50/50">
                                    <td className="px-4 py-3">
                                       {`${t.nombres ?? ""} ${
                                          t.apellidos ?? ""
                                       }`.trim() || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                       {t.numero_documento ?? "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                       {b.fecha}
                                    </td>
                                    <td className="px-4 py-3">
                                       {formatoDinero(b.monto)}
                                    </td>
                                    <td className="px-4 py-3 " >
                                       {b.tipo ?? "-"}
                                    </td>
                                    <td
                                       className="px-4 py-3 max-w-[320px] truncate"
                                       title={b.observacion ?? ""}
                                    >
                                       {b.observacion ?? "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                       <div className="flex justify-end">
                                          <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                <Button
                                                   variant="ghost"
                                                   size="icon"
                                                >
                                                   <MoreVertical className="h-5 w-5" />
                                                </Button>
                                             </DropdownMenuTrigger>
                                             <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                   Acciones
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                   onClick={() => openView(b)}
                                                >
                                                   <Eye className="mr-2 h-4 w-4" />
                                                   Ver
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                   onClick={() => openEdit(b)}
                                                >
                                                   <Pencil className="mr-2 h-4 w-4" />
                                                   Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                   <AlertDialogTrigger asChild>
                                                      <DropdownMenuItem
                                                         className="text-red-600 focus:text-red-600"
                                                         onSelect={(e) =>
                                                            e.preventDefault()
                                                         }
                                                      >
                                                         <Trash2 className="mr-2 h-4 w-4" />
                                                         Eliminar
                                                      </DropdownMenuItem>
                                                   </AlertDialogTrigger>
                                                   <AlertDialogContent>
                                                      <AlertDialogHeader>
                                                         <AlertDialogTitle>
                                                            Eliminar bono
                                                         </AlertDialogTitle>
                                                         <AlertDialogDescription>
                                                            Esta acción no se
                                                            puede deshacer.
                                                            ¿Deseas eliminar el
                                                            bono de{" "}
                                                            <strong>
                                                               {`${
                                                                  t.nombres ??
                                                                  ""
                                                               } ${
                                                                  t.apellidos ??
                                                                  ""
                                                               }`.trim() ||
                                                                  "trabajador"}
                                                            </strong>
                                                            ?
                                                         </AlertDialogDescription>
                                                      </AlertDialogHeader>
                                                      <AlertDialogFooter>
                                                         <AlertDialogCancel>
                                                            Cancelar
                                                         </AlertDialogCancel>
                                                         <AlertDialogAction
                                                            className="bg-red-600 hover:bg-red-700"
                                                            onClick={() =>
                                                               handleDelete(b)
                                                            }
                                                         >
                                                            Eliminar
                                                         </AlertDialogAction>
                                                      </AlertDialogFooter>
                                                   </AlertDialogContent>
                                                </AlertDialog>
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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
               <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                     <DialogTitle>
                        {viewMode === "crear" && "Nuevo bono"}
                        {viewMode === "editar" && "Editar bono"}
                        {viewMode === "ver" && "Detalle de bono"}
                     </DialogTitle>
                     <DialogDescription>
                        {viewMode === "ver"
                           ? "Consulta la información del bono."
                           : "Completa los campos y guarda los cambios."}
                     </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2">
                     {/* Trabajador */}
                     <div className="grid gap-1">
                        <Label>Trabajador</Label>
                        <Select
                           value={form.trabajador_id}
                           onValueChange={(val) =>
                              setForm((prevForm) => ({
                                 ...prevForm,
                                 trabajador_id: val,
                              }))
                           }
                           disabled={
                              viewMode === "ver" || viewMode === "editar"
                           }
                        >
                           <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccione un trabajador" />
                           </SelectTrigger>
                           <SelectContent>
                              {trabajadores.map((t, i) => (
                                 <SelectItem key={i} value={t.id}>
                                    {t.nombres} {t.apellidos} -{" "}
                                    {t.numero_documento}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     {/* Tipo de bono */}
                     <div className="grid gap-1">
                        <Label>Tipo de bono</Label>
                        <Select
                           value={form.tipo}
                           onValueChange={(val) =>
                              setForm((prevForm) => ({
                                 ...prevForm,
                                 tipo: val,
                              }))
                           }
                        >
                           <SelectTrigger className={"w-full"}>
                              <SelectValue placeholder="Selecciona el tipo de bono" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value={"simple"}>Simple</SelectItem>
                              <SelectItem value={"bono_nocturno"}>
                                 Nocturno
                              </SelectItem>
                              <SelectItem value={"escolaridad"}>
                                 Escolaridad
                              </SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     {/* Fecha */}
                     <div className="grid gap-1">
                        <Label>Fecha</Label>
                        <Input
                           type="date"
                           value={form.fecha}
                           onChange={(e) =>
                              setForm((f) => ({ ...f, fecha: e.target.value }))
                           }
                           disabled={viewMode === "ver"}
                        />
                     </div>

                     {/* Monto */}
                     <div className="grid gap-1">
                        <Label>Monto (PEN)</Label>
                        <Input
                           type="number"
                           step="0.01"
                           placeholder="0.00"
                           value={form.monto}
                           onChange={(e) =>
                              setForm((f) => ({ ...f, monto: e.target.value }))
                           }
                           disabled={viewMode === "ver"}
                        />
                        {form.monto && (
                           <p className="text-xs text-gray-500">
                              Prevista: {formatoDinero(form.monto)}
                           </p>
                        )}
                     </div>

                     {/* Observación */}
                     <div className="grid gap-1">
                        <Label>Observación</Label>
                        <Textarea
                           placeholder="Motivo del bono..."
                           value={form.observacion}
                           onChange={(e) =>
                              setForm((f) => ({
                                 ...f,
                                 observacion: e.target.value,
                              }))
                           }
                           disabled={viewMode === "ver"}
                        />
                     </div>
                  </div>

                  <DialogFooter className="mt-2">
                     <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                     >
                        Cerrar
                     </Button>
                     {viewMode !== "ver" && (
                        <Button
                           onClick={handleSave}
                           className="bg-innova-blue hover:bg-innova-blue/90"
                        >
                           {viewMode === "crear" ? "Crear" : "Guardar cambios"}
                        </Button>
                     )}
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </div>
      </div>
   );
};

export default GestionTrabajadoresDadosDeBaja;
