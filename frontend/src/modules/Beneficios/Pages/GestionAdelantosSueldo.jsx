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
import beneficiosService from "../services/beneficiosService";
import { toast } from "sonner";

// --------- helpers ----------
const formatMoney = (v) =>
   Number(v ?? 0).toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
   });

const formatDate = (iso) => {
   try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleDateString("es-PE", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
      });
   } catch {
      return iso;
   }
};

const GestionAdelantoSueldo = () => {
   const [adelantoSueldos, setAdelantoSueldos] = useState([]);
   const [loading, setLoading] = useState(true);
   const [trabajadores, setTrabajadores] = useState([]);
   const [search, setSearch] = useState("");

   const [dialogOpen, setDialogOpen] = useState(false);
   const [viewMode, setViewMode] = useState("crear"); // "crear" | "editar" | "ver"
   const [editing, setEditing] = useState(null);

   const [form, setForm] = useState({
      trabajador_id: "",
      fecha: "",
      monto: "",
      observacion: "",
      estado: true,
   });

   const fetchAdelantoSueldos = async () => {
      try {
         setLoading(true);
         const res = await beneficiosService.getAdelantos();
         const trab = await beneficiosService.getTrabajadores();
         setTrabajadores(trab.data);
         const raw = res?.data?.adelantos_sueldo ?? res?.data ?? [];
         const list = Array.isArray(raw) ? raw : [raw];
         console.log(list);

         setAdelantoSueldos(list);
      } catch (e) {
         console.log(e);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAdelantoSueldos();
   }, []);

   const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();
      return adelantoSueldos
         .filter((adelanto) => {
            if (!term) return true;
            const t = adelanto.trabajadores || {};
            const full = `${t.nombres ?? ""} ${t.apellidos ?? ""} ${
               t.numero_documento ?? ""
            } ${adelanto.observacion ?? ""}`.toLowerCase();
            return full.includes(term);
         })
         .sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
         );
   }, [adelantoSueldos, search]);

   const openCreate = () => {
      setViewMode("crear");
      setEditing(null);
      setForm({
         trabajador_id: "",
         fecha: new Date().toISOString().slice(0, 10),
         monto: "",
         observacion: "",
         estado: true,
      });
      setDialogOpen(true);
   };

   const openView = (adelanto) => {
      setViewMode("ver");
      setEditing(adelanto);
      setForm({
         trabajador_id: adelanto.trabajador_id ?? "",
         fecha: adelanto.fecha ?? "",
         monto: String(adelanto.monto ?? ""),
         observacion: adelanto.observacion ?? "",
         estado: Boolean(adelanto.estado),
      });
      setDialogOpen(true);
   };

   const openEdit = (adelanto) => {
      setViewMode("editar");
      setEditing(adelanto);
      setForm({
         trabajador_id: adelanto.trabajador_id ?? "",
         fecha: adelanto.fecha ?? "",
         monto: String(adelanto.monto ?? ""),
         observacion: adelanto.observacion ?? "",
         estado: Boolean(adelanto.estado),
      });
      setDialogOpen(true);
   };

   const handleSave = async () => {
      try {
         const payload = {
            trabajador_id: form.trabajador_id
               ? Number(form.trabajador_id)
               : null,
            fecha: form.fecha,
            monto: Number(form.monto || 0),
            observacion: form.observacion,
         };
         if (viewMode === "crear") {
            console.log(payload);
            
            await beneficiosService.crearAdelantoSaldo(payload);
            toast.success('Adelanto de sueldo agregado.')            
         } else if (viewMode === "editar" && editing) { 
            payload.id=editing.id;                       
           beneficiosService.editarAdelantoSueldo(payload);
           toast.success('Trabajador editado. ')
           
         }
         setDialogOpen(false);
         await fetchAdelantoSueldos();
      } catch (e) {
        console.log(e);
        
      }
   };

   const handleDelete = async (adelanto) => {
      try {
         await beneficiosService.eliminarAdelantoSueldo(adelanto.id);
         await fetchAdelantoSueldos();
         toast.success('Adelanto de sueldo eliminado.')
      } catch (e) {
        console.log(e);
        
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                     Gestión de adelantos de sueldo al trabajador
                  </h1>
                  <p className="text-gray-600 mt-1">
                     Administra los adelantos de sueldo de tus trabajadores
                  </p>
               </div>
               <div className="flex gap-2">
                  <Button onClick={openCreate} className="bg-innova-blue hover:bg-innova-blue/90">
                     Nuevo Adelanto <PlusCircle className="ml-2 h-5 w-5" />
                  </Button>
               </div>
            </div>
            {/* Filtros */}
            <div className="bg-white border rounded-xl p-4 shadow-sm">
               <div className="relative flex-1">
                  <Input
                     placeholder="Buscar por nombre, apellido, DNI u observación..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>

            {/* Tabla */}
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 text-gray-700 text-sm">
                        <tr>
                           <th className="px-4 py-3 font-medium">Trabajador</th>
                           <th className="px-4 py-3 font-medium">
                              Numero Doc.
                           </th>
                           <th className="px-4 py-3 font-medium">Fecha</th>
                           <th className="px-4 py-3 font-medium">Monto</th>
                           <th className="px-4 py-3 font-medium">
                              Observación
                           </th>
                           <th className="px-4 py-3 font-medium text-right">
                              Acciones
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
                                 No se encontraron adelantos de sueldo
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
                                       {formatDate(b.fecha)}
                                    </td>
                                    <td className="px-4 py-3">
                                       {formatMoney(b.monto)}
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
                                                            Eliminar Adelanto de
                                                            sueldo
                                                         </AlertDialogTitle>
                                                         <AlertDialogDescription>
                                                            Esta acción no se
                                                            puede deshacer.
                                                            ¿Deseas eliminar el
                                                            adelanto de sueldo
                                                            de{" "}
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
                        {viewMode === "crear" && "Nuevo Adelanto de sueldo"}
                        {viewMode === "editar" && "Editar adelanto de sueldo"}
                        {viewMode === "ver" && "Detalle del adelanto de sueldo"}
                     </DialogTitle>
                     <DialogDescription>
                        {viewMode === "ver"
                           ? "Consulta la información del adelanto de sueldo."
                           : "Completa los campos y guarda los cambios."}
                     </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                     {/* Trabajador */}
                     <div className="grid gap-2">
                        <Label>Trabajador</Label>
                        <Select
                           value={form.trabajador_id}
                           onValueChange={(val) =>
                              setForm((prevForm) => ({
                                 ...prevForm,
                                 trabajador_id: val,
                              }))
                           }
                           disabled={viewMode === "ver"}
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

                     {/* Fecha */}
                     <div className="grid gap-2">
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
                     <div className="grid gap-2">
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
                              Prevista: {formatMoney(form.monto)}
                           </p>
                        )}
                     </div>

                     {/* Observación */}
                     <div className="grid gap-2">
                        <Label>Observación</Label>
                        <Textarea
                           placeholder="Motivo del adelanto de sueldo..."
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
                        <Button onClick={handleSave}>
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

export default GestionAdelantoSueldo;
