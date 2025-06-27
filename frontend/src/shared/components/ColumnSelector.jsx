import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

export function ColumnSelector({
   visibleColumns,
   setVisibleColumns,
   columnOptions,
   className = "",
}) {
   const [open, setOpen] = useState(false);
   const [tempVisibleColumns, setTempVisibleColumns] = useState(visibleColumns);

   useEffect(() => {
      setTempVisibleColumns(visibleColumns);
   }, [visibleColumns]);

   const handleSave = () => {
      setVisibleColumns(tempVisibleColumns);
      setOpen(false);
   };

   const handleCancel = () => {
      setTempVisibleColumns(visibleColumns);
      setOpen(false);
   };

   const toggleColumn = (columnId) => {
      setTempVisibleColumns((prev) => ({
         ...prev,
         [columnId]: !prev[columnId],
      }));
   };

   const areAllSelected = columnOptions.every(
      (column) => tempVisibleColumns[column.id]
   );

   const toggleAll = () => {
      const newState = {};
      columnOptions.forEach((column) => {
         newState[column.id] = !areAllSelected;
      });
      setTempVisibleColumns(newState);
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="outline" size="sm" className={`mb-6 ${className}`}>
               <Settings className="h-4 w-4 mr-2 " />
               Columnas
            </Button>
         </DialogTrigger>
         <DialogContent className="!max-w-80">
            <DialogHeader>
               <DialogTitle>Seleccionar columnas visibles</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-2">
               <div className="flex items-center space-x-2 mb-2 border-b pb-2">
                  <Checkbox
                     id="all"
                     checked={areAllSelected}
                     onCheckedChange={toggleAll}
                  />
                  <Label
                     htmlFor="all"
                     className="text-sm font-medium leading-none !text-neutral-800"
                  >
                     Todas
                  </Label>
               </div>

               {columnOptions.map((column) => (
                  <div
                     key={column.id}
                     className="flex items-center space-x-2 mb-2"
                  >
                     <Checkbox
                        id={column.id}
                        checked={tempVisibleColumns[column.id]}
                        onCheckedChange={() => toggleColumn(column.id)}
                     />
                     <Label
                        htmlFor={column.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !text-neutral-600"
                     >
                        {column.label}
                     </Label>
                  </div>
               ))}
            </div>
            <div className="flex justify-end gap-2">
               <Button variant="outline" onClick={handleCancel}>
                  Cancelar
               </Button>
               <Button onClick={handleSave}>Guardar</Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
