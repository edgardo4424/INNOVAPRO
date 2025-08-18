export const formatoFechaBeneficios = (iso) => {
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
