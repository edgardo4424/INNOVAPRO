const { Trabajador } = require("../models/trabajadorModel");
const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const EmpresaProveedora = db.empresas_proveedoras;
const { Op, fn, col, where } = require("sequelize");
const filtrarContratosSinInterrupcion = require("../../../../services/filtrarContratosSinInterrupcion");
const moment = require("moment");
const { Area } = require("../models/areaModel");
class SequelizeTrabajadorRepository {
   async crear(trabajadorData, transaction = null) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
      const trabajador = await Trabajador.create(trabajadorData, options);
      return trabajador;
   }

   async editar(trabajadorData, transaction = null) {
      const options = { where: { id: trabajadorData.trabajador_id } };
      if (transaction) {
         options.transaction = transaction;
      }
      const trabajador = await Trabajador.update(trabajadorData, options);
      return trabajador;
   }

   async obtenerTrabajadorSimplePorId(id, transaction = null) {
      const options = {
         where: { id },
      };
      if (transaction) {
         options.transaction = transaction;
      }
      const trabajador = await Trabajador.findOne(options);
      return trabajador.get({plain:true});
   }
   async obtenerTrabajadorPorId(id, transaction = null) {
      const options = {
         where: { id },
         include: [
            {
               model: db.contratos_laborales,
               as: "contratos_laborales",
               where: { estado: 1 },
               required: false,
            },
         ],
      };

      if (transaction) {
         options.transaction = transaction;
      }

      const trabajador = await Trabajador.findOne(options);
      return trabajador.get({plain:true});
   }
   async obtenerAreas(){
      const areas= await Area.findAll();
      return areas;
   }

   async obtenerTrabajadoresPorArea(areaId, fecha) {
      const area=await Area.findByPk(areaId)
      if(!area){
         throw new Error("El area no existe")
      }
      
      const trabajadores = await Trabajador.findAll({
         include: [
            {
               model: db.asistencias,
               as: "asistencias",
               required: false,
               where: where(fn("DATE", col("asistencias.fecha")), fecha),
               include: [
                  { model: db.gastos, as: "gastos" },
                  {
                     model: db.jornadas,
                     as: "jornadas",
                     include: [
                        {
                           model: db.tipos_trabajo,
                           as: "tipo_trabajo",
                           required: false,
                        },
                     ],
                  },
               ],
            },
            {
               model: db.cargos,
               as: "cargo",
               required: true,
               where: {
                  area_id: areaId, // <--- filtro aquí por area_id
               },
            },
            {
               model: db.contratos_laborales,
               as: "contratos_laborales",
               include: [
                  { model: db.empresas_proveedoras, as: "empresa_proveedora" },
               ],
            },
         ],
      });

      // Convertir asistencia de arreglo a objeto único (si existe)
      const resultado = trabajadores.map((t) => {
         const data = t.toJSON();
         data.asistencia = data.asistencias?.[0] || null;
         delete data.asistencias;
         const hoy = new Date().toISOString().split("T")[0];

         const contrato_actual = data.contratos_laborales.find((c) => {
            return c.fecha_inicio <= hoy && c.fecha_fin >= hoy;
         });
         if (!contrato_actual) {
            throw new Error("El trabajador no cuenta con un contrato laboral.");
         }
         data.filial = contrato_actual.empresa_proveedora.razon_social;
         delete data.contratos_laborales;
         return data;
      });
      return {
         trabajadores:resultado,
          area_nombre:area.nombre
      };
   }
  async obtenerTrabajadoresPorAreaCargo(fecha, cargos_areas) {
     const { area_id, cargos_id } = cargos_areas;
     const area=await Area.findByPk(area_id)
     if(!area){
      throw new Error("El area no existe")
     }
     console.log(area.get({plain:true}));
     
     const includes = [
       {
         model: db.asistencias,
         as: "asistencias",
         required: false,
         where: where(fn("DATE", col("asistencias.fecha")), fecha),
         include: [
           { model: db.gastos, as: "gastos" },
           {
             model: db.jornadas,
             as: "jornadas",
             include: [
               {
                 model: db.tipos_trabajo,
                 as: "tipo_trabajo",
                 required: false,
               },
             ],
           },
         ],
       },
       {
         model: db.contratos_laborales,
         as: "contratos_laborales",
         include: [{ model: db.empresas_proveedoras, as: "empresa_proveedora" }],
       },
     ];

     // 🔹 Conjunto A: trabajadores del área
     const trabajadoresArea = await Trabajador.findAll({
       include: [
         ...includes,
         {
           model: db.cargos,
           as: "cargo",
           required: true,
           where: { area_id },
         },
       ],
     });

     // 🔹 Conjunto B: trabajadores filtrados por cargos_id (pueden ser de otras áreas)
     let trabajadoresCargos = [];
     if (cargos_id?.length) {
       trabajadoresCargos = await Trabajador.findAll({
         include: [
           ...includes,
           {
             model: db.cargos,
             as: "cargo",
             required: true,
             where: { id: { [Op.in]: cargos_id } },
           },
         ],
       });
     }

     // 🔹 Unión final
     const concatenado = [...trabajadoresArea, ...trabajadoresCargos];
     // Convertir asistencia de arreglo a objeto único (si existe)
     const resultado = concatenado.map((t) => {
       const data = t.toJSON();
       data.asistencia = data.asistencias?.[0] || null;
       delete data.asistencias;
       const hoy = new Date().toISOString().split("T")[0];

       const contrato_actual = data.contratos_laborales.find((c) => {
         return c.fecha_inicio <= hoy && c.fecha_fin >= hoy;
       });
       if (!contrato_actual) {
         throw new Error("El trabajador no cuenta con un contrato laboral.");
       }
       data.filial = contrato_actual.empresa_proveedora.razon_social;
       delete data.contratos_laborales;
       return data;
     });

     return {
      trabajadores:resultado,
      area_nombre:area.nombre,
      area_id:area.id
     };
   }

   async obtenerTrabajadores() {
      const trabajadores = await Trabajador.findAll({
         where: {
            estado: "activo",
         },
         include: [
            {
               model: db.cargos,
               as: "cargo",
               include: [
                  {
                     model: db.areas,
                     as: "area",
                  },
               ],
            },
            {
               model: db.contratos_laborales,
               as: "contratos_laborales",
               where: { estado: 1 },
               required: false,
               include: {
                  model: db.empresas_proveedoras,
                  as: "empresa_proveedora",
               },
            },
         ],
      });

      const sanitizacion = trabajadores.map((tr) => {
         const t = tr.get({ plain: true });

         let contrato_mas_antiguo = null;
         if (t.contratos_laborales.length > 0) {
            contrato_mas_antiguo = t.contratos_laborales.reduce(
               (antiguo, actual) => {
                  return new Date(actual.fecha_inicio) <
                     new Date(antiguo.fecha_inicio)
                     ? actual
                     : antiguo;
               }
            );
         }

         return {
            ...t,
            contrato_mas_antiguo,
         };
      });

      return sanitizacion;
   }
   async obtenerTrabajadoresYcontratos() {
      const trabajadores = await Trabajador.findAll({
         where: {
            estado: "activo",
         },
         include: [
            {
               model: db.contratos_laborales,
               as: "contratos_laborales",
               where: { estado: 1 },
               required: false,
            },
         ],
      });
      const transformData = trabajadores.map((t) => {
         const tr = { ...t.get({ plain: true }) };
         tr.contratos_laborales = filtrarContratosSinInterrupcion(
            tr.contratos_laborales
         );
         return tr;
      });

      return transformData;
   }

   async obtenerTrabajadoresConContratosAPuntoDeVencer() {
      const hoy = moment().startOf("day");
      const haceNDias = moment().subtract(15, "days").startOf("day");

      const trabajadores = await Trabajador.findAll({
         where: {
            estado: "activo",
            fecha_baja: null,
         },
         include: [
            {
               model: db.contratos_laborales,
               as: "contratos_laborales",
               where: {
                  estado: 1,
                  fecha_inicio: { [Op.lte]: hoy.toDate() }, // iniciados
               },
               required: false,
            },
         ],
      });

      const resultado = trabajadores.map((trabajador) => {
         const contratosOrdenados = [...trabajador.contratos_laborales].sort(
            (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
         );

         const contratosFiltrados = [];
         for (let i = 0; i < contratosOrdenados.length; i++) {
            const contrato = contratosOrdenados[i];

            if (contrato.fecha_terminacion_anticipada) {
               break;
            }
            const fechaFinReal = contrato.fecha_fin;
            const fin = fechaFinReal
               ? moment(fechaFinReal).startOf("day")
               : null;

            let estadoContrato = "VIGENTE";

            if (fin && fin.isSameOrBefore(hoy)) {
               if (fin.isSameOrAfter(haceNDias)) {
                  estadoContrato = "PENDIENTE"; // venció hace <= 3 días
               } else {
                  estadoContrato = "VENCIDO";
                  // Si hay otro contrato más reciente, se omite el vencido
                  if (i > 0) continue;
               }
            }

            contratosFiltrados.push({
               ...contrato.toJSON(),
               estadoContrato,
            });

            // Solo mostrar el contrato más reciente por trabajador
            break;
         }

         return {
            ...trabajador.toJSON(),
            contratos_laborales: contratosFiltrados,
         };
      });

      return resultado;
   }

   async obtenerTrabajadoresConContratosVigentes(filial_id) {
      //const hoy = moment().startOf("day");

      const trabajadores = await Trabajador.findAll({
         where: {
            estado: "activo",
            fecha_baja: null,
         },
         include: [
            {
               model: db.contratos_laborales,
               as: "contratos_laborales",
               where: {
                  estado: 1,
                  //fecha_inicio: { [Op.lte]: hoy.toDate() }, // iniciados
                  filial_id,
               },
               required: false,
            },
         ],
      });

      // Obtener los ultimos contratos de cada trabajador
      const trabajadoresConUltimosContratos = trabajadores.map((trabajador) => {
         if (trabajador.contratos_laborales.length === 0) {
            return null;
         }

         const contratosOrdenados = [...trabajador.contratos_laborales].sort(
            (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
         );

         const ultimoContrato = contratosOrdenados[0];

         const { contratos_laborales, ...resto } = trabajador.toJSON();

         return {
            ...resto,
            ultimo_contrato: ultimoContrato,
         };
      });

      // Eliminar trabajadores sin contratos vigentes
      const trabajadoresFiltrados = trabajadoresConUltimosContratos.filter(
         (trabajador) => trabajador !== null
      );

      return trabajadoresFiltrados;
   }

   async obtenerTrabajadorPorNroDocumento(numero_documento, transaction = null) {
      const options = {
               where: { numero_documento: numero_documento, estado: "activo", fecha_baja: null},
      };

      if (transaction) {
         options.transaction = transaction;
      }

      const trabajador = await Trabajador.findOne(options);

      return trabajador;
   }
}

module.exports = SequelizeTrabajadorRepository;
