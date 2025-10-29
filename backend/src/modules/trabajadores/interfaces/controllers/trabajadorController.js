const obtenerTrabajadores = require("../../application/useCases/obtenerTrabajadores");
const crearTrabajador = require("../../application/useCases/crearTrabajador");
const obtenerTrabajadoresPorArea = require("../../application/useCases/obtenerTrabajadoresPorArea");
const SequelizeTrabajadorRepository = require("../../infraestructure/repositories/sequelizeTrabajadorRepository");
const crearTrabajadorConContrato = require("../../../../application/services/crearTrabajadorConContrato");
const obtenerTrabajadorpoId = require("../../application/useCases/obtenerTrabajadorpoId");
const editarTrabajadorConContrato = require("../../../../application/services/editarTrabajadorConContrato");

const { Op } = require("sequelize");
const { Trabajador } = require("../../infraestructure/models/trabajadorModel");
const { ContratoLaboral } = require("../../../contratos_laborales/infraestructure/models/contratoLaboralModel");
const { Filial } = require("../../../filiales/infrastructure/models/filialModel");

function ymd(d){ const p=n=>String(n).padStart(2,"0"); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; }

const obtenerTrabajadoresYcontratos = require("../../application/useCases/obtenerTrabajadoresYcontratos");
const obtenerTrabajadoresConContratosVigentes = require("../../application/useCases/obtenerTrabajadoresConContratosVigentes");
const obtenerTrabajadoresPorAreaCargo = require("../../application/useCases/obtenerTrabajadoresPorAreaCargo");
const obtenerAreas = require("../../application/useCases/obtenerAreas");
const sincronizacion_marcate = require("../../application/useCases/sincronizacion_marcate");
const obtenerAreasYCargos = require("../../application/useCases/obtenerAreasYCargos");
const sequelize = require("../../../.././config/db");
const eliminarTrabajadorPorId = require("../../application/useCases/eliminarTrabajadorPorId");


const trabajadorRepository = new SequelizeTrabajadorRepository();

const TrabajadorController = {
   async crearTrabajador(req, res) {
      try {
         const nuevoTrabajador = await crearTrabajador(
            req.body,
            trabajadorRepository
         );
         res.status(nuevoTrabajador.codigo).json(nuevoTrabajador.respuesta);
      } catch (error) {
         console.log('error', error);
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerTrabajadorPorId(req, res) {      
      try {
         const trabajador = await obtenerTrabajadorpoId(
            req.params.id,
            trabajadorRepository
         );
         res.status(trabajador.codigo).json(trabajador.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async crearTrabajadorConContrato(req, res) {
      try {
         console.log('req.body', req.body);
         const nuevaContratacion = await crearTrabajadorConContrato(req.body);
         res.status(nuevaContratacion.codigo).json(nuevaContratacion.respuesta);
      } catch (error) {
                  console.log('error', error);
         res.status(500).json({ error: error.message });
      }
   },
   async editarTrabajadorConContrato(req, res) {
      try {
         console.log('entre');
         const usuarioEditado = await editarTrabajadorConContrato(req.body);
         res.status(usuarioEditado.codigo).json(usuarioEditado.respuesta);
      } catch (error) {
         console.log('error', error);
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerTrabajadoresPorArea(req, res) {
      try {
         const trabajadores = await obtenerTrabajadoresPorArea(
            req.params.id,
            req.params.fecha,
            trabajadorRepository
         );
         res.status(trabajadores.codigo).json(trabajadores.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   async sincronizarMarcate(req,res){      
      try {         
         const response=await sincronizacion_marcate(req.body);
         res.status(response.codigo).json(response.respuesta);
      } catch (error) {
         console.log("El error desde marcate es:",error);
         res.status(500).json({ error: error });
      }
   },
   async obtenerTrabajadoresPorAreaCargo(req, res) {
      try {         
         const rol=req.usuario.rol;         
         const trabajadores = await obtenerTrabajadoresPorAreaCargo(
            req.params.fecha,
            rol,
            trabajadorRepository
         );
         res.status(trabajadores.codigo).json(trabajadores.respuesta);
      } catch (error) {
         console.log(error);
         res.status(500).json({ error: error.message });
      }
   },
   async obtenerAreas(req, res) {
      try {
         console.log("Ejecutando sistema.....");
         
         const areas = await obtenerAreas(trabajadorRepository);
         res.status(areas.codigo).json(areas.respuesta);
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   },
   
   async obtenerTrabajadores(req, res) {
      try {
         const trabajadores = await obtenerTrabajadores(trabajadorRepository);
         res.status(trabajadores.codigo).json(
            trabajadores.respuesta.trabajadores
         );
      } catch (error) {
         console.log(error);

         res.status(500).json({ error: error.message });
      }
   },
   async listarFilialesVigentes(req, res) {
      try {
         const { dni } = req.params;
         const anio = Number(req.query.anio);
         const mes  = Number(req.query.mes);
         if (!dni || !anio || !mes) return res.status(400).json({ ok:false, error:"dni, anio y mes son obligatorios" });

         const trabajador = await Trabajador.findOne({ where: { numero_documento: dni } });
         if (!trabajador) return res.status(404).json({ ok:false, error:"Trabajador no encontrado" });

         const desde = new Date(anio, mes-1, 1);
         const hasta = new Date(anio, mes, 0);

         const contratos = await ContratoLaboral.findAll({
            where: {
            trabajador_id: trabajador.id,
            estado: 1,
            [Op.and]: [
               { fecha_inicio: { [Op.lte]: hasta } },
               { [Op.or]: [{ fecha_fin: { [Op.gte]: desde } }, { fecha_fin: null }] }
            ]
            },
            include: [{ model: Filial, as: "empresa_proveedora", attributes: ["id","razon_social"] }]
         });

         const vistos = new Set();
         const filiales = [];
         for (const c of contratos) {
            const fid = Number(c.filial_id);
            if (!vistos.has(fid)) {
            vistos.add(fid);
            filiales.push({
               filial_id: fid,
               filial_razon_social: c.empresa_proveedora?.razon_social || `Filial ${fid}`,
               contrato_id: c.id,
               sueldo: Number(c.sueldo || 0),
               regimen: c.regimen || null,
               tipo_contrato: c.tipo_contrato || null
            });
            }
         }
         
         return res.json({
            ok: true,
            data: {
            trabajador_id: trabajador.id,
            periodo: { anio, mes, desde: ymd(desde), hasta: ymd(hasta) },
            filiales
            }
         });
      } catch (err) {
         console.error(err);
         return res.status(500).json({ ok:false, error:"Error interno" });
      }
   },
   async obtenerTrabajadoresYcontratos(req, res) {            
      try {
         const response = await obtenerTrabajadoresYcontratos(
            trabajadorRepository
         );
         res.status(response.codigo).json(response.respuesta);
      } catch (error) {
         res.status(502).json({ error: error.message });
      }
   },

   async obtenerTrabajadoresConContratosVigentes(req, res) {            
      try {

         const { filial_id } = req.body;
         const response = await obtenerTrabajadoresConContratosVigentes(
            filial_id,
            trabajadorRepository
         );
         res.status(response.codigo).json(response.respuesta);
      } catch (error) {

         res.status(502).json({ error: error.message });
      }
   },

   async obtenerAreasYCargos(req, res) {
      try {
         const areasYCargos = await obtenerAreasYCargos(trabajadorRepository);
         res.status(areasYCargos.codigo).json(areasYCargos.respuesta);
      } catch (error) {
         console.log("error", error);
         res.status(500).json({ error: error.message });
      }
   },
   async eliminarTrabajadorPorId(req,res){
      const transaction = await sequelize.transaction();
      try {
         const trabajador_id=req.params.trabajador_id         
         const response= await eliminarTrabajadorPorId(trabajador_id,trabajadorRepository,transaction)
         await transaction.commit();
         res.status(response.codigo).json(response.respuesta);
      } catch (error) {
         await transaction.rollback();
         console.log(error);
         res.status(500).json({error:error.message})
         
      }
   }
};

module.exports = TrabajadorController;
