"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      const estadosAsistencia = [
         "presente",
         "falto",
         "tardanza",
         "permiso",
         "licencia_con_goce",
         "licencia_sin_goce",
         "vacaciones",
         "falta-justificada",
      ];

      const nombres = [
         "Valentina","Mateo","Sofía","Sebastián","Camila","Santiago","Isabella",
         "Benjamín","Emma","Thiago","María","Emilia","Liam","Antonella","Gabriel",
         "Catalina","Lucas","Lucía","Diego","Mía","Martina","Alejandro","Daniela",
         "Bruno","Nicole","Samuel","Paula","Andrés","Renata","Julián",
      ];

      const apellidos = [
         "García","Rodríguez","López","Martínez","González","Pérez","Sánchez",
         "Ramírez","Torres","Flores","Rivera","Gómez","Díaz","Vargas","Castillo",
         "Ramos","Muñoz","Cruz","Morales","Reyes","Vega","Mendoza","Silva",
         "Ortega","Delgado","Rojas","Navarro","Herrera","Campos","Cabrera",
      ];

      function numeroAleatorio() {
         const r = Math.random();
         if (r < 0.6) return 0; 
         else if (r < 0.8) return 1; 
         else if (r < 0.9) return 2; 
         else return 3; 
      }

      function nombreYApellidosPorIndice(n) {
         const first = nombres[n % nombres.length];
         const last1 = apellidos[n % apellidos.length];
         const last2 = apellidos[(n * 7) % apellidos.length];
         return { nombres: first, apellidos: `${last1} ${last2}` };
      }

      const trabajadoresData = [];
      const baseDoc = 10000000;

      for (let filial = 1; filial <= 4; filial++) {
         for (let i = 0; i < 20; i++) {
            const globalIdx = (filial - 1) * 20 + i;
            const { nombres: NOMB, apellidos: APEL } =
               nombreYApellidosPorIndice(globalIdx);

            trabajadoresData.push({
               nombres: NOMB,
               apellidos: APEL,
               tipo_documento: globalIdx % 2 === 0 ? "DNI" : "CE",
               numero_documento: `DOCF${filial}-${baseDoc + i}`,
               sueldo_base: 1800 + (globalIdx % 10) * 1000,
               asignacion_familiar: globalIdx % 3 === 0 ? "2025-08-26" : null,
               sistema_pension: globalIdx % 2 === 0 ? "AFP" : "ONP",
               tipo_afp:
                  globalIdx % 2 === 0
                     ? ["HABITAT", "INTEGRA", "PRIMA", "PROFUTURO"][globalIdx % 4]
                     : null,
               estado: "activo",
               cargo_id: (globalIdx % 8) + 1,
               domiciliado: globalIdx % 2,
            });
         }
      }

      await queryInterface.bulkInsert("trabajadores", trabajadoresData);

      const [trabajadores] = await queryInterface.sequelize.query(
         `SELECT id, sueldo_base, numero_documento FROM trabajadores WHERE numero_documento LIKE 'DOCF%'`
      );

      const getFilialFromDoc = (doc) => {
         const m = /^DOCF(\d)-/.exec(doc);
         return m ? parseInt(m[1], 10) : 1;
      };

      const contratos = [];
      const asistencias = [];

      for (const t of trabajadores) {
         const filialId = getFilialFromDoc(t.numero_documento);
         const yearStart = 2022;

         for (let j = 0; j < 3; j++) {
            const year = yearStart + j;

            contratos.push({
               trabajador_id: t.id,
               fecha_inicio: `${year}-01-01`,
               fecha_fin: `${year}-12-31`,
               sueldo: t.sueldo_base ?? 0,
               regimen: (t.sueldo_base ?? 0) <= 2000 ? "MYPE" : "GENERAL",
               fecha_terminacion_anticipada: null,
               tipo_contrato: "PLANILLA",
               estado: 1,
               filial_id: filialId,
            });
         }

         for (let k = 1; k <= 10; k++) {
            const day = k.toString().padStart(2, "0");
            asistencias.push({
               trabajador_id: t.id,
               fecha: `2025-08-${day}`,
               horas_trabajadas: 8 - (k % 3),
               horas_extras: numeroAleatorio(),
               hora_inicio_refrigerio: "13:00:00",
               hora_fin_refrigerio: "14:00:00",
               estado_asistencia:
                  estadosAsistencia[Math.floor(Math.random() * estadosAsistencia.length)],
            });
         }
      }

      await queryInterface.bulkInsert("contratos_laborales", contratos);
      await queryInterface.bulkInsert("asistencias", asistencias);
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.sequelize.query(
         `DELETE FROM asistencias WHERE fecha BETWEEN '2025-08-01' AND '2025-08-15'`
      );
      await queryInterface.sequelize.query(
         `DELETE FROM contratos_laborales WHERE fecha_inicio >= '2022-01-01' AND fecha_fin <= '2026-12-31'`
      );
      await queryInterface.bulkDelete("trabajadores", {
         numero_documento: { [Sequelize.Op.like]: "DOCF%" },
      });
   },
};
