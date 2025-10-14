import { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
   Command,
   CommandGroup,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

export function MultiSelect({
   className = "",
   options = [],
   placeholder = "Seleccione",
   value = [], // Valor inicial sincronizado con el formulario
   onChange,
}) {
   const inputRef = useRef(null);
   const [open, setOpen] = useState(false);
   const [inputValue, setInputValue] = useState("");

   const handleUnselect = useCallback(
      (option) => {
         onChange(value.filter((s) => s.value !== option.value)); // Actualiza el formulario
      },
      [onChange, value]
   );

   const handleKeyDown = useCallback(
      (e) => {
         const input = inputRef.current;
         if (input) {
            if (
               (e.key === "Delete" || e.key === "Backspace") &&
               input.value === ""
            ) {
               const newSelected = [...value];
               newSelected.pop();
               onChange(newSelected); // Actualiza el formulario
            }
            if (e.key === "Escape") {
               input.blur();
            }
         }
      },
      [onChange, value]
   );

   const selectables = options.filter(
      (option) => !value.some((selected) => selected.value === option.value)
   );

   return (
      <Command
         onKeyDown={handleKeyDown}
         className={`overflow-visible bg-transparent ${className}`}
      >
         <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="flex flex-wrap gap-1">
               {value.map((option) => {
                  return (
                     <Badge key={option.value} variant="ghost">
                        {option.label}
                        <button
                           className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 handleUnselect(option);
                              }
                           }}
                           onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                           }}
                           onClick={() => handleUnselect(option)}
                        >
                           <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                     </Badge>
                  );
               })}
               {/* Avoid having the "Search" Icon */}
               <CommandPrimitive.Input
                  ref={inputRef}
                  value={inputValue}
                  onValueChange={setInputValue}
                  onBlur={() => setOpen(false)}
                  onFocus={() => setOpen(true)}
                  placeholder={placeholder}
                  className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
               />
            </div>
         </div>
         <div className="relative">
            <CommandList>
               {open && selectables.length > 0 ? (
                  <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                     <CommandGroup className="h-full overflow-auto">
                        {selectables.map((option) => {
                           return (
                              <CommandItem
                                 key={option.value}
                                 onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                 }}
                                 onSelect={() => {
                                    setInputValue("");
                                    onChange([...value, option]); // Actualiza el formulario
                                 }}
                                 className={"cursor-pointer"}
                              >
                                 {option.label}
                              </CommandItem>
                           );
                        })}
                     </CommandGroup>
                  </div>
               ) : null}
            </CommandList>
         </div>
      </Command>
   );
}
