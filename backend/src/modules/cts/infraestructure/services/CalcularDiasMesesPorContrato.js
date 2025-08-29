// ===== Utilidades de fecha (UTC) =====
const lastDayOfMonth = (year, m0 /* 0-11 */) =>
   new Date(Date.UTC(year, m0 + 1, 0)).getUTCDate();

const parseClampUTC = (yyyy_mm_dd) => {
   const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyy_mm_dd);
   if (!m) throw new Error(`Fecha inválida: ${yyyy_mm_dd}`);
   let [_, y, mm, dd] = m;
   const year = +y;
   const m0 = +mm - 1;
   let day = +dd;
   const ldom = lastDayOfMonth(year, m0);
   if (day > ldom) day = ldom; // corrige 2025-04-31 -> 2025-04-30
   return new Date(Date.UTC(year, m0, day));
};

const startOfMonthUTC = (d) =>
   new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
const endOfMonthUTC = (d) =>
   new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
const firstOfNextMonthUTC = (d) =>
   new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
const endOfPrevMonthUTC = (d) =>
   new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 0));

const isLastDayOfMonth = (d) =>
   d.getUTCDate() === lastDayOfMonth(d.getUTCFullYear(), d.getUTCMonth());

const daysInclusive = (a, b) => {
   const MS = 24 * 60 * 60 * 1000;
   return Math.floor((b - a) / MS) + 1;
};

const monthSpanInclusive = (aFirstOfMonth, bLastOfMonth) => {
   // ambos son límites de mes (1 y último día), cuenta meses "calendario" inclusive
   return (
      (bLastOfMonth.getUTCFullYear() - aFirstOfMonth.getUTCFullYear()) * 12 +
      (bLastOfMonth.getUTCMonth() - aFirstOfMonth.getUTCMonth()) +
      1
   );
};

// ==== helper reutilizable: meses/días para UN intervalo [ini, fin] ====
function mesesDiasEnIntervalo(ini, fin) {
   // Caso: todo dentro del mismo mes
   const mismoMes =
      ini.getUTCFullYear() === fin.getUTCFullYear() &&
      ini.getUTCMonth() === fin.getUTCMonth();

   if (mismoMes) {
      if (ini.getUTCDate() === 1 && isLastDayOfMonth(fin)) {
         return { meses: 1, dias: 0 };
      }
      return { meses: 0, dias: daysInclusive(ini, fin) };
   }

   // Días al principio
   const diasInicio =
      ini.getUTCDate() === 1
         ? 0
         : lastDayOfMonth(ini.getUTCFullYear(), ini.getUTCMonth()) -
           ini.getUTCDate() +
           1;

   // Días al final
   const diasFin = isLastDayOfMonth(fin) ? 0 : fin.getUTCDate();

   // Meses completos entre medias
   const mesesStart =
      ini.getUTCDate() === 1 ? startOfMonthUTC(ini) : firstOfNextMonthUTC(ini);
   const mesesEnd = isLastDayOfMonth(fin)
      ? endOfMonthUTC(fin)
      : endOfPrevMonthUTC(fin);
   const meses =
      mesesStart <= mesesEnd ? monthSpanInclusive(mesesStart, mesesEnd) : 0;

   return { meses, dias: diasInicio + diasFin };
}

// ==== util: une intervalos que se solapan o son contiguos (por 1 día) ====
function mergeIntervals(intervals) {
   const MS = 24 * 60 * 60 * 1000;
   if (!intervals.length) return [];
   intervals.sort((a, b) => a[0] - b[0]);
   const merged = [[intervals[0][0], intervals[0][1]]];
   for (let i = 1; i < intervals.length; i++) {
      const [s, e] = intervals[i];
      const last = merged[merged.length - 1];
      // junta si se solapan o si son adyacentes (s <= lastEnd + 1 día)
      if (s - last[1] <= MS) {
         if (e > last[1]) last[1] = e;
      } else {
         merged.push([s, e]);
      }
   }
   return merged;
}

// ===== Lógica principal =====
// agruparPorRegimen (opcional): si true, devuelve un item por régimen (unión de intervalos).
function calcularDiasMesesPorContrato(rangoInicioStr, rangoFinStr, contratos) {
   const rangoInicio = parseClampUTC(rangoInicioStr);
   const rangoFin = parseClampUTC(rangoFinStr);
   if (rangoFin < rangoInicio)
      throw new Error("El fin del rango es anterior al inicio.");

   // Solo cálculo individual por contrato
   return contratos.map((c, idx) => {
      const cIni = parseClampUTC(c.fecha_inicio);
      const cFin = parseClampUTC(c.fecha_fin);

      // Solapamiento contrato-rango
      const ini = cIni > rangoInicio ? cIni : rangoInicio;
      const fin = cFin < rangoFin ? cFin : rangoFin;

      if (fin < ini) {
         return {
            id: c.id,
            trabajador_id: c.trabajador_id,
            fecha_inicio: c.fecha_inicio,
            fecha_fin: c.fecha_fin,
            sueldo: c.sueldo,
            banco: c.banco,
            numero_cuenta: c.numero_cuenta,
            regimen: c.regimen,
            ids_agrupacion: c.ids_agrupacion,
            index: idx,
            meses: 0,
            dias: 0,
            solapa: false,
         };
      }

      const { meses, dias } = mesesDiasEnIntervalo(ini, fin);

      return {
         id: c.id,
         trabajador_id: c.trabajador_id,
         fecha_inicio: c.fecha_inicio,
         fecha_fin: c.fecha_fin,
         sueldo: c.sueldo,
         banco: c.banco,
         numero_cuenta: c.numero_cuenta,
         regimen: c.regimen,
         ids_agrupacion: c.ids_agrupacion,
         index: idx,
         meses,
         dias,
         solapa: true,
      };
   });
}

module.exports = calcularDiasMesesPorContrato;
