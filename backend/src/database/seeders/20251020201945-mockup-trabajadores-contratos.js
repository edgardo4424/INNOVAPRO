"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const nodeEnv = process.env.NODE_ENV || "development";

    if (nodeEnv == "development") {
      console.log(
        "Ejecutando seed de trabajdores y contratos en desarollo",
        nodeEnv
      );
      await queryInterface.sequelize.query(`

INSERT INTO trabajadores (
   nombres,
   apellidos,
   tipo_documento,
   numero_documento,
   sueldo_base,
   asignacion_familiar,
   sistema_pension,
   tipo_afp,
   estado,
   cargo_id,
   domiciliado,
   fecha_nacimiento
)
VALUES
('Genaro Alonso','García de la Cruz','DNI','DOCF1-10000001',3200,'2025-08-26','AFP','INTEGRA','activo',1,1,'1985-05-15'),
('David','Lázaro Silvestre','CE','DOCF1-10000002',3000,NULL,'ONP',NULL,'activo',2,0,'1987-07-20'),
('Ivonne Stefany','García de la Cruz','DNI','DOCF1-10000003',3000,'2025-08-26','AFP','PRIMA','activo',3,1,'1990-09-12'),
('Pilar','Morales Vilca','CE','DOCF1-10000004',2500,NULL,'ONP',NULL,'activo',4,0,'1988-03-05'),
('Rosmery','García Dueñas','DNI','DOCF1-10000005',2200,'2025-08-26','AFP','PROFUTURO','activo',5,1,'1984-06-30'),
('Katya Yulissa','Chalco Apaza','CE','DOCF1-10000006',2400,NULL,'ONP',NULL,'activo',6,0,'1982-11-18'),
('Abel Humberto','Garzón Williams','DNI','DOCF1-10000007',2000,'2025-08-26','AFP','HABITAT','activo',7,1,'1991-02-02'),
('Cesar Jesús','García Avellaneda','CE','DOCF1-10000008',1800,NULL,'ONP',NULL,'activo',8,0,'1989-08-14'),
('Eduardo Antonic','Carrasco Cisneros','DNI','DOCF1-10000009',2000,'2025-08-26','AFP','PRIMA','activo',9,1,'1986-04-10'),
('Rosmer Julix','Chavarria Rojas','CE','DOCF1-10000010',2000,NULL,'ONP',NULL,'activo',9,0,'1992-01-28'),
('Cesar Alberto','Orta Gonzalez','DNI','DOCF1-10000011',2100,'2025-08-26','AFP','INTEGRA','activo',10,1,'1983-11-09'),
('Maria José','Oliveros Aliendres','CE','DOCF1-10000012',1900,NULL,'ONP',NULL,'activo',11,0,'1995-02-16'),
('Marco Abiel','Calderon Perez','DNI','DOCF1-10000013',2800,'2025-08-26','AFP','HABITAT','activo',12,1,'1981-04-25'),
('Judith Carolina','Padua Melgarejo','CE','DOCF1-10000014',2600,NULL,'ONP',NULL,'activo',13,0,'1989-10-13'),
('Antonio Jesus','Rodriguez Aranda','DNI','DOCF1-10000015',2400,'2025-08-26','AFP','PROFUTURO','activo',6,1,'1985-01-19'),
('Paul Mayer','Rengifo Rengifo','CE','DOCF1-10000016',2000,NULL,'ONP',NULL,'activo',8,0,'1994-07-07'),
('Gary Joau','Cubas Rioja','DNI','DOCF1-10000017',1900,'2025-08-26','AFP','INTEGRA','activo',8,1,'1986-03-29'),
('Arthur Aron','Salas Mozombite','CE','DOCF1-10000018',2100,NULL,'ONP',NULL,'activo',15,0,'1992-05-11'),
('Eber','Huanchos Flores','DNI','DOCF1-10000019',1900,'2025-08-26','AFP','PRIMA','activo',8,1,'1988-06-01'),
('Bruno Narciso','Rengifo Rengifo','CE','DOCF1-10000020',2000,NULL,'ONP',NULL,'activo',8,0,'1993-08-24'),
('Kenneth Josue','Gago Silvestre','DNI','DOCF1-10000021',2000,'2025-08-26','AFP','HABITAT','activo',16,1,'1987-02-03'),
('Alex Roger','Rengifo Saavedra','CE','DOCF1-10000022',2100,NULL,'ONP',NULL,'activo',8,0,'1990-09-22'),
('Ledy Maria','Hernandez Leon','DNI','DOCF1-10000023',1800,'2025-08-26','AFP','PROFUTURO','activo',11,1,'1995-01-27'),
('Julio Cesar','Aranguren Santa Cruz','CE','DOCF1-10000024',2700,NULL,'ONP',NULL,'activo',17,0,'1984-12-04'),
('Evelyn Daniela','Chacaltana Vasquez','DNI','DOCF1-10000025',2000,'2025-08-26','AFP','INTEGRA','activo',16,1,'1992-07-15'),
('Juan Piero','Perez Melgarejo','CE','DOCF1-10000026',2100,NULL,'ONP',NULL,'activo',16,0,'1993-05-09'),
('Andres Edgardo','Martinez Salvaterra','DNI','DOCF1-10000027',2800,'2025-08-26','AFP','PRIMA','activo',18,1,'1986-11-01'),
('Lizeth Sherly','Iguia Montero','CE','DOCF1-10000028',2300,NULL,'ONP',NULL,'activo',6,0,'1990-01-20'),
('Carlos Daniel','Bravo Matta','DNI','DOCF1-10000029',2000,'2025-08-26','AFP','HABITAT','activo',16,1,'1989-09-17'),
('Manuel Ernesto','Rivas Garcia','CE','DOCF1-10000030',1900,NULL,'ONP',NULL,'activo',8,0,'1991-03-13'),
('Josias','Fares Pacaya','DNI','DOCF1-10000031',2000,'2025-08-26','AFP','PROFUTURO','activo',8,1,'1988-08-22'),
('Viky','Safra Picon','CE','DOCF1-10000032',2600,NULL,'ONP',NULL,'activo',19,0,'1987-12-11'),
('Luis Angel','Lujan Villanueva','DNI','DOCF1-10000033',1800,'2025-08-26','AFP','INTEGRA','activo',20,1,'1996-02-02'),
('Sampi Charly','Insapillo','CE','DOCF1-10000034',1800,NULL,'ONP',NULL,'activo',20,0,'1995-06-09'),
('Lesslie Thalia','Rojas Garcia Lucero','DNI','DOCF1-10000035',1800,'2025-08-26','AFP','PRIMA','activo',20,1,'1989-03-30'),
('Henry Paolo','Nube Shuña','CE','DOCF1-10000036',1800,NULL,'ONP',NULL,'activo',20,0,'1992-07-19'),
('Juan Antonio','Ramirez Chilcahua','DNI','DOCF1-10000037',2000,'2025-08-26','AFP','HABITAT','activo',8,1,'1987-10-23'),
('Braians Josue','Garcia Andara','CE','DOCF1-10000038',1900,NULL,'ONP',NULL,'activo',8,0,'1990-11-28'),
('Kimberly','Tafur Cuadros','DNI','DOCF1-10000039',2300,'2025-08-26','AFP','PROFUTURO','activo',22,1,'1988-04-14'),
('Junior Paolo','Pilco Ramirez','CE','DOCF1-10000040',2000,NULL,'ONP',NULL,'activo',8,0,'1991-09-21'),
('Guido','Magipo Gonzales','DNI','DOCF1-10000041',1800,'2025-08-26','AFP','INTEGRA','activo',20,1,'1994-08-25'),
('Frank Jhover','Cespedes Castillo','CE','DOCF1-10000042',2400,NULL,'ONP',NULL,'activo',6,0,'1985-02-12'),
('Heather Kimberly','Llanos Silvestre','DNI','DOCF1-10000043',2200,'2025-08-26','AFP','PRIMA','activo',23,1,'1992-11-08'),
('Andrea Giuliana','Vargas Manriquez','CE','DOCF1-10000044',2400,NULL,'ONP',NULL,'activo',22,0,'1987-05-14'),
('Miguel Angel','Huaman Romero','DNI','DOCF1-10000045',2300,'2025-08-26','AFP','HABITAT','activo',6,1,'1984-03-01'),
('Luis Felipe','Gonzales Ayvar','CE','DOCF1-10000046',2400,NULL,'ONP',NULL,'activo',24,0,'1986-09-27'),
('Lenis Wladimir','Rodriguez Peña','DNI','DOCF1-10000047',2100,'2025-08-26','AFP','PROFUTURO','activo',16,1,'1989-12-16'),
('Claudia Celeste','Sandoval Vega','CE','DOCF1-10000048',2000,NULL,'ONP',NULL,'activo',21,0,'1990-10-11'),
('Mayra Xiomara','Roldan Silvestre','DNI','DOCF1-10000049',2000,'2025-08-26','AFP','INTEGRA','activo',25,1,'1991-01-09'),
('Elvis Alejandro','Amaro Delgado','CE','DOCF1-10000050',2000,NULL,'ONP',NULL,'activo',21,0,'1993-06-05'),
('Christian','Sanchez Casaverde','DNI','DOCF1-10000051',2100,'2025-08-26','AFP','PRIMA','activo',26,1,'1988-07-07'),
('Amelia Isabel','Cardenas Carhuachin','CE','DOCF1-10000052',2000,NULL,'ONP',NULL,'activo',21,0,'1995-03-22'),
('Javier Gustavo','Ahumada Martinez','DNI','DOCF1-10000053',1900,'2025-08-26','AFP','HABITAT','activo',27,1,'1989-09-29'),
('Luis Alfredo','Saavedra Falcon','CE','DOCF1-10000054',2400,NULL,'ONP',NULL,'activo',24,0,'1986-08-02'),
('Gino Williams','Lopez Anable','DNI','DOCF1-10000055',2000,'2025-08-26','AFP','PROFUTURO','activo',8,1,'1990-05-15'),
('Pery Rony','Torres Perez','CE','DOCF1-10000056',2000,NULL,'ONP',NULL,'activo',8,0,'1992-02-18'),
('Daynys Celestino','Torvisco Cardona','DNI','DOCF1-10000057',1800,'2025-08-26','AFP','INTEGRA','activo',20,1,'1994-09-10'),
('Leonel','Gonzales Condor','CE','DOCF1-10000058',1800,NULL,'ONP',NULL,'activo',20,0,'1988-10-24'),
('Maria','Barrueta Belmailu','DNI','DOCF1-10000059',1800,'2025-08-26','AFP','PRIMA','activo',28,1,'1987-01-30'),
('Justin','Fretel Montayre Jhair','CE','DOCF1-10000060',2400,NULL,'ONP',NULL,'activo',24,0,'1992-04-19'),
('Hugo Jeampierk','Simon Contreras','DNI','DOCF1-10000061',2300,'2025-08-26','AFP','HABITAT','activo',24,1,'1986-08-07'),
('Cristhian','Asangkay Rengifo','CE','DOCF1-10000062',1900,NULL,'ONP',NULL,'activo',20,0,'1993-12-02'),
('Giancarlo Fel','Bennvenuto Gutierrez','DNI','DOCF1-10000063',1800,'2025-08-26','AFP','PROFUTURO','activo',20,1,'1989-11-13'),
('Anthony','Marquina Perez Junior','CE','DOCF1-10000064',1800,NULL,'ONP',NULL,'activo',20,0,'1996-02-22');
    `);

      await queryInterface.sequelize.query(`
      INSERT INTO contratos_laborales (
   trabajador_id,
   fecha_inicio,
   fecha_fin,
   sueldo,
   regimen,
   fecha_terminacion_anticipada,
   tipo_contrato,
   estado,
   filial_id,
   banco,
   numero_cuenta
)
SELECT
   t.id,
   '2025-01-01',
   '2025-12-31',
   t.sueldo_base,
   CASE WHEN t.sueldo_base <= 2000 THEN 'MYPE' ELSE 'GENERAL' END,
   NULL,
   'PLANILLA',
   1,
   1,
   'BBVA',
   CONCAT('123456789', t.id)
FROM trabajadores t
WHERE t.numero_documento LIKE 'DOCF1-100000%';
      `);
      await queryInterface.sequelize.query(`
      INSERT INTO contratos_laborales (trabajador_id, fecha_inicio, fecha_fin, sueldo, regimen, fecha_terminacion_anticipada, tipo_contrato, estado, filial_id, banco, numero_cuenta) 
      VALUES 
      (1, '2025-01-01', '2025-12-31', 3200, 'GENERAL', NULL, 'PLANILLA', 1, 1, 'BBVA', '123456789001');`);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DELETE FROM contratos_laborales
      WHERE trabajador_id IN (SELECT id FROM trabajadores WHERE numero_documento LIKE 'DOCF1-100000%');

      DELETE FROM trabajadores
      WHERE numero_documento LIKE 'DOCF1-100000%';
    `);
  },
};
