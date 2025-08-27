-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: innovapro
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `rol` enum('Gerencia','Ventas','Oficina Técnica','Almacén','Administración','Clientes') DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `telefono` varchar(20) DEFAULT NULL,
  `id_chat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `empresas_proveedoras`
--

DROP TABLE IF EXISTS `empresas_proveedoras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas_proveedoras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(255) NOT NULL,
  `ruc` varchar(11) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `representante_legal` varchar(255) NOT NULL,
  `dni_representante` varchar(8) NOT NULL,
  `cargo_representante` varchar(100) NOT NULL,
  `telefono_representante` varchar(50) NOT NULL,
  `creado_por` int NOT NULL,
  `telefono_oficina` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`razon_social`),
  UNIQUE KEY `ruc` (`ruc`),
  KEY `creado_por` (`creado_por`),
  CONSTRAINT `empresas_proveedoras_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cargos`
--

DROP TABLE IF EXISTS `cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `area_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `cargo_ibfk_1_idx` (`area_id`),
  CONSTRAINT `cargo_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `areas` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trabajadores`
--

DROP TABLE IF EXISTS `trabajadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trabajadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filial_id` int NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `tipo_documento` enum('DNI','CE','PTP') NOT NULL,
  `numero_documento` varchar(45) NOT NULL,
  `sueldo_base` int NOT NULL,
  `asignacion_familiar` tinyint(1) NOT NULL,
  `sistema_pension` enum('AFP','ONP') NOT NULL,
  `quinta_categoria` tinyint(1) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `cargo_id` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `trabajador_ibfk_1_idx` (`filial_id`),
  KEY `trabajador_ibfk_3_idx` (`cargo_id`),
  CONSTRAINT `trabajador_ibfk_1` FOREIGN KEY (`filial_id`) REFERENCES `empresas_proveedoras` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `trabajador_ibfk_3` FOREIGN KEY (`cargo_id`) REFERENCES `cargos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `asistencias`
--

DROP TABLE IF EXISTS `asistencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trabajador_id` int NOT NULL,
  `fecha` date NOT NULL,
  `horas_trabajadas` float DEFAULT NULL,
  `horas_extras` float DEFAULT NULL,
  `estado_asistencia` enum('presente','falto','tardanza','permiso','licencia','vacaciones','falta-justificada') NOT NULL,
  `hora_inicio_refrigerio` time DEFAULT NULL,
  `hora_fin_refrigerio` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `asistencia_ibfk_1_idx` (`trabajador_id`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajadores` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=311 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usos`
--

DROP TABLE IF EXISTS `usos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  `grupo_tarifa` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `despieces`
--

DROP TABLE IF EXISTS `despieces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `despieces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `moneda` enum('PEN','USD') NOT NULL,
  `subtotal` decimal(10,2) DEFAULT '0.00',
  `porcentaje_descuento` decimal(10,2) DEFAULT '0.00',
  `subtotal_con_descuento` decimal(10,2) DEFAULT '0.00',
  `igv_porcentaje` decimal(10,2) DEFAULT '18.00',
  `igv_monto` decimal(10,2) DEFAULT '0.00',
  `total_final` decimal(10,2) DEFAULT '0.00',
  `cp` varchar(10) DEFAULT NULL,
  `tiene_pernos` tinyint(1) DEFAULT '0',
  `detalles_opcionales` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atributos`
--

DROP TABLE IF EXISTS `atributos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atributos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uso_id` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `llave_json` varchar(255) NOT NULL,
  `tipo_dato` varchar(255) NOT NULL,
  `unidad_medida` varchar(255) DEFAULT NULL,
  `orden` int DEFAULT '1',
  `valores_por_defecto` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uso_id` (`uso_id`),
  CONSTRAINT `atributos_ibfk_1` FOREIGN KEY (`uso_id`) REFERENCES `usos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atributos_valor`
--

DROP TABLE IF EXISTS `atributos_valor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atributos_valor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `despiece_id` int NOT NULL,
  `atributo_id` int NOT NULL,
  `valor` varchar(255) DEFAULT NULL,
  `numero_formulario_uso` int DEFAULT NULL,
  `zona` int DEFAULT NULL,
  `nota_zona` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `despiece_id` (`despiece_id`),
  KEY `atributo_id` (`atributo_id`),
  CONSTRAINT `atributos_valor_ibfk_1` FOREIGN KEY (`despiece_id`) REFERENCES `despieces` (`id`),
  CONSTRAINT `atributos_valor_ibfk_2` FOREIGN KEY (`atributo_id`) REFERENCES `atributos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=852 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bonos`
--

DROP TABLE IF EXISTS `bonos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bonos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trabajador_id` int NOT NULL,
  `fecha` date NOT NULL,
  `observacion` varchar(45) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `bonos_ibkf_1_idx` (`trabajador_id`),
  CONSTRAINT `bonos_ibkf_1` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajadores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `borradores`
--

DROP TABLE IF EXISTS `borradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `borradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_borrador` varchar(30) DEFAULT NULL,
  `serie` varchar(10) DEFAULT NULL,
  `correlativo` int DEFAULT NULL,
  `empresa_ruc` varchar(11) DEFAULT NULL,
  `cliente_num_doc` varchar(15) DEFAULT NULL,
  `cliente_razon_social` varchar(255) DEFAULT NULL,
  `fecha_Emision` datetime DEFAULT NULL,
  `body` text,
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `borradores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(255) NOT NULL,
  `tipo` enum('Persona Jurídica','Persona Natural') NOT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `domicilio_fiscal` varchar(255) DEFAULT NULL,
  `representante_legal` varchar(255) DEFAULT NULL,
  `dni_representante` varchar(15) DEFAULT NULL,
  `creado_por` int DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ruc` (`ruc`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `email` (`email`),
  KEY `creado_por` (`creado_por`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `obras`
--

DROP TABLE IF EXISTS `obras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `obras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `creado_por` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` enum('Planificación','Demolición','Excavación','Cimentación y estructura','Cerramientos y albañilería','Acabados','Entrega y postventa') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `creado_por` (`creado_por`),
  CONSTRAINT `obras_ibfk_2` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente_obras`
--

DROP TABLE IF EXISTS `cliente_obras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_obras` (
  `cliente_id` int NOT NULL,
  `obra_id` int NOT NULL,
  PRIMARY KEY (`cliente_id`,`obra_id`),
  KEY `obra_id` (`obra_id`),
  CONSTRAINT `cliente_obras_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `cliente_obras_ibfk_2` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contactos`
--

DROP TABLE IF EXISTS `contactos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `estados_cotizacion`
--

DROP TABLE IF EXISTS `estados_cotizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados_cotizacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `orden` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cotizaciones`
--

DROP TABLE IF EXISTS `cotizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `despiece_id` int DEFAULT NULL,
  `contacto_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `obra_id` int NOT NULL,
  `filial_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `estados_cotizacion_id` int NOT NULL,
  `tipo_cotizacion` enum('Alquiler','Venta') DEFAULT NULL,
  `tiene_transporte` tinyint(1) DEFAULT NULL,
  `tiene_instalacion` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tiempo_alquiler_dias` int DEFAULT NULL,
  `codigo_documento` varchar(255) DEFAULT NULL,
  `uso_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `despiece_id` (`despiece_id`),
  KEY `contacto_id` (`contacto_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `obra_id` (`obra_id`),
  KEY `filial_id` (`filial_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `estados_cotizacion_id` (`estados_cotizacion_id`),
  KEY `fk_cotizaciones_uso_id` (`uso_id`),
  CONSTRAINT `cotizaciones_ibfk_1` FOREIGN KEY (`despiece_id`) REFERENCES `despieces` (`id`),
  CONSTRAINT `cotizaciones_ibfk_2` FOREIGN KEY (`contacto_id`) REFERENCES `contactos` (`id`),
  CONSTRAINT `cotizaciones_ibfk_3` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `cotizaciones_ibfk_4` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`),
  CONSTRAINT `cotizaciones_ibfk_5` FOREIGN KEY (`filial_id`) REFERENCES `empresas_proveedoras` (`id`),
  CONSTRAINT `cotizaciones_ibfk_6` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `cotizaciones_ibfk_7` FOREIGN KEY (`estados_cotizacion_id`) REFERENCES `estados_cotizacion` (`id`),
  CONSTRAINT `fk_cotizaciones_uso_id` FOREIGN KEY (`uso_id`) REFERENCES `usos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `condiciones_alquiler`
--

DROP TABLE IF EXISTS `condiciones_alquiler`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condiciones_alquiler` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int NOT NULL,
  `comentario_solicitud` text,
  `condiciones` text,
  `condiciones_cumplidas` text,
  `estado` enum('PENDIENTE','DEFINIDAS','CUMPLIDAS') DEFAULT 'PENDIENTE',
  `creado_por` int DEFAULT NULL,
  `actualizado_por` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_condiciones_cotizacion` (`cotizacion_id`),
  CONSTRAINT `fk_condiciones_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contacto_clientes`
--

DROP TABLE IF EXISTS `contacto_clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacto_clientes` (
  `contacto_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  PRIMARY KEY (`contacto_id`,`cliente_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `contacto_clientes_ibfk_1` FOREIGN KEY (`contacto_id`) REFERENCES `contactos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contacto_clientes_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contacto_obras`
--

DROP TABLE IF EXISTS `contacto_obras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacto_obras` (
  `contacto_id` int NOT NULL,
  `obra_id` int NOT NULL,
  PRIMARY KEY (`contacto_id`,`obra_id`),
  KEY `obra_id` (`obra_id`),
  CONSTRAINT `contacto_obras_ibfk_1` FOREIGN KEY (`contacto_id`) REFERENCES `contactos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contacto_obras_ibfk_2` FOREIGN KEY (`obra_id`) REFERENCES `obras` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contratos_laborales`
--

DROP TABLE IF EXISTS `contratos_laborales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contratos_laborales` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trabajador_id` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `sueldo` int NOT NULL,
  `regimen` enum('GENERAL','MYPE') NOT NULL,
  `fecha_terminacion_anticipada` date DEFAULT NULL,
  `tipo_contrato` enum('PLANILLA','HONORARIOS') NOT NULL DEFAULT 'PLANILLA',
  `estado` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `contrato_laboral_ibkf_1_idx` (`trabajador_id`),
  CONSTRAINT `contrato_laboral_ibkf_1` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajadores` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `costos_pernocte_transporte`
--

DROP TABLE IF EXISTS `costos_pernocte_transporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `costos_pernocte_transporte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_transporte` enum('Camioneta','Camión') NOT NULL,
  `precio_soles` decimal(10,2) NOT NULL,
  `umbral_toneladas` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cotizaciones_instalacion`
--

DROP TABLE IF EXISTS `cotizaciones_instalacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizaciones_instalacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int NOT NULL,
  `tipo_instalacion` enum('Parcial','Completa') NOT NULL,
  `precio_instalacion_completa_soles` decimal(10,2) DEFAULT '0.00',
  `precio_instalacion_parcial_soles` decimal(10,2) DEFAULT '0.00',
  `nota` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cotizacion_id` (`cotizacion_id`),
  CONSTRAINT `cotizaciones_instalacion_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tarifas_transporte`
--

DROP TABLE IF EXISTS `tarifas_transporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarifas_transporte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grupo_tarifa` varchar(255) NOT NULL,
  `subtipo` varchar(255) NOT NULL,
  `tipo_transporte` enum('Camioneta','Camión') NOT NULL,
  `unidad` enum('Tn','Tramo','Andamio','Pd','Und') NOT NULL,
  `rango_desde` decimal(10,2) NOT NULL,
  `rango_hasta` decimal(10,2) NOT NULL,
  `precio_soles` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cotizaciones_transporte`
--

DROP TABLE IF EXISTS `cotizaciones_transporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizaciones_transporte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int NOT NULL,
  `uso_id` int NOT NULL,
  `tarifa_transporte_id` int DEFAULT NULL,
  `tipo_transporte` enum('Camioneta','Camión','Semi camión') NOT NULL,
  `unidad` enum('Tn','Tramo','Andamio','Pd','Und') NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `costo_tarifas_transporte` decimal(10,2) DEFAULT '0.00',
  `costo_pernocte_transporte` decimal(10,2) DEFAULT '0.00',
  `costo_distrito_transporte` decimal(10,2) DEFAULT '0.00',
  `costo_total` decimal(10,2) DEFAULT '0.00',
  `distrito_transporte` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cotizacion_id` (`cotizacion_id`),
  KEY `uso_id` (`uso_id`),
  KEY `tarifa_transporte_id` (`tarifa_transporte_id`),
  CONSTRAINT `cotizaciones_transporte_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`),
  CONSTRAINT `cotizaciones_transporte_ibfk_2` FOREIGN KEY (`uso_id`) REFERENCES `usos` (`id`),
  CONSTRAINT `cotizaciones_transporte_ibfk_4` FOREIGN KEY (`tarifa_transporte_id`) REFERENCES `tarifas_transporte` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `familias_piezas`
--

DROP TABLE IF EXISTS `familias_piezas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `familias_piezas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `piezas`
--

DROP TABLE IF EXISTS `piezas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `piezas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item` varchar(100) NOT NULL,
  `familia_id` int NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `peso_kg` decimal(10,2) DEFAULT '0.00',
  `precio_venta_dolares` decimal(10,2) DEFAULT '0.00',
  `precio_venta_soles` decimal(10,2) DEFAULT '0.00',
  `precio_alquiler_soles` decimal(10,2) DEFAULT '0.00',
  `stock_actual` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `item` (`item`),
  KEY `fk_piezas_familia` (`familia_id`),
  CONSTRAINT `fk_piezas_familia` FOREIGN KEY (`familia_id`) REFERENCES `familias_piezas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=558 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `despieces_detalle`
--

DROP TABLE IF EXISTS `despieces_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `despieces_detalle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `despiece_id` int NOT NULL,
  `pieza_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `peso_kg` decimal(10,2) DEFAULT '0.00',
  `precio_venta_dolares` decimal(10,2) DEFAULT '0.00',
  `precio_venta_soles` decimal(10,2) DEFAULT '0.00',
  `precio_alquiler_soles` decimal(10,2) DEFAULT '0.00',
  `esAdicional` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_despiece_pieza` (`despiece_id`,`pieza_id`,`esAdicional`),
  KEY `fk_despieces_detalle_piezas` (`pieza_id`),
  CONSTRAINT `fk_despieces_detalle_despieces` FOREIGN KEY (`despiece_id`) REFERENCES `despieces` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_despieces_detalle_piezas` FOREIGN KEY (`pieza_id`) REFERENCES `piezas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=792 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_operacion` varchar(4) DEFAULT NULL,
  `tipo_doc` varchar(2) DEFAULT NULL,
  `serie` varchar(10) DEFAULT NULL,
  `correlativo` int DEFAULT NULL,
  `tipo_moneda` varchar(3) DEFAULT NULL,
  `fecha_emision` datetime DEFAULT NULL,
  `empresa_ruc` varchar(11) DEFAULT NULL,
  `cliente_tipo_doc` varchar(2) DEFAULT NULL,
  `cliente_num_doc` varchar(15) DEFAULT NULL,
  `cliente_razon_social` varchar(255) DEFAULT NULL,
  `cliente_direccion` text,
  `monto_oper_gravadas` decimal(12,2) DEFAULT NULL,
  `monto_oper_exoneradas` decimal(12,2) DEFAULT NULL,
  `monto_igv` decimal(12,2) DEFAULT NULL,
  `total_impuestos` decimal(12,2) DEFAULT NULL,
  `valor_venta` decimal(12,2) DEFAULT NULL,
  `sub_total` decimal(12,2) DEFAULT NULL,
  `monto_imp_venta` decimal(12,2) DEFAULT NULL,
  `estado_documento` varchar(2) DEFAULT NULL,
  `manual` tinyint(1) DEFAULT NULL,
  `id_base_dato` varchar(10) DEFAULT NULL,
  `estado` enum('EMITIDA','RECHAZADA','ANULADA','OBSERVADA') DEFAULT NULL,
  `observaciones` text,
  `usuario_id` int DEFAULT NULL,
  `detraccion_cod_bien_detraccion` varchar(10) DEFAULT NULL,
  `detraccion_cod_medio_pago` varchar(10) DEFAULT NULL,
  `detraccion_cta_banco` varchar(50) DEFAULT NULL,
  `detraccion_percent` decimal(5,2) DEFAULT NULL,
  `detraccion_mount` decimal(12,2) DEFAULT NULL,
  `descuento_cod_tipo` varchar(10) DEFAULT NULL,
  `descuento_monto_base` decimal(12,2) DEFAULT NULL,
  `descuento_factor` decimal(5,2) DEFAULT NULL,
  `descuento_monto` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalle_factura`
--

DROP TABLE IF EXISTS `detalle_factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_factura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `factura_id` int DEFAULT NULL,
  `unidad` varchar(10) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `cod_producto` varchar(50) DEFAULT NULL,
  `descripcion` text,
  `monto_valor_unitario` decimal(12,2) DEFAULT NULL,
  `monto_base_igv` decimal(12,2) DEFAULT NULL,
  `porcentaje_igv` decimal(5,2) DEFAULT NULL,
  `igv` decimal(12,2) DEFAULT NULL,
  `tip_afe_igv` varchar(5) DEFAULT NULL,
  `total_impuestos` decimal(12,2) DEFAULT NULL,
  `monto_precio_unitario` decimal(12,2) DEFAULT NULL,
  `monto_valor_venta` decimal(12,2) DEFAULT NULL,
  `factor_icbper` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factura_id` (`factura_id`),
  CONSTRAINT `detalle_factura_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `factura` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notas_credito_debito`
--

DROP TABLE IF EXISTS `notas_credito_debito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notas_credito_debito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_Operacion` varchar(6) DEFAULT NULL,
  `tipo_Doc` varchar(4) DEFAULT NULL,
  `serie` varchar(10) DEFAULT NULL,
  `correlativo` int DEFAULT NULL,
  `tipo_Moneda` varchar(3) DEFAULT NULL,
  `tipo_Documento` varchar(3) DEFAULT NULL,
  `fecha_Emision` datetime DEFAULT NULL,
  `Obeservacion` text,
  `Manual` tinyint(1) DEFAULT NULL,
  `empresa_Ruc` varchar(11) DEFAULT NULL,
  `cliente_Tipo_Doc` varchar(2) DEFAULT NULL,
  `cliente_Num_Doc` varchar(11) DEFAULT NULL,
  `cliente_Razon_Social` varchar(255) DEFAULT NULL,
  `cliente_Direccion` text,
  `monto_Igv` decimal(12,2) DEFAULT NULL,
  `total_Impuestos` decimal(12,2) DEFAULT NULL,
  `valor_Venta` decimal(12,2) DEFAULT NULL,
  `monto_Oper_Gravadas` decimal(12,2) DEFAULT NULL,
  `monto_Oper_Exoneradas` decimal(12,2) DEFAULT NULL,
  `sub_Total` decimal(12,2) DEFAULT NULL,
  `monto_Tmp_Venta` decimal(12,2) DEFAULT NULL,
  `afectado_Tipo_Doc` varchar(4) DEFAULT NULL,
  `afectado_Num_Doc` varchar(50) DEFAULT NULL,
  `motivo_Cod` varchar(4) DEFAULT NULL,
  `motivo_Des` varchar(255) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `notas_credito_debito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalle_nota_cre_deb`
--

DROP TABLE IF EXISTS `detalle_nota_cre_deb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_nota_cre_deb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nota_id` int DEFAULT NULL,
  `unidad` varchar(4) DEFAULT NULL,
  `cantidad` decimal(12,2) DEFAULT NULL,
  `descripcion` text,
  `monto_Valor_Unitario` decimal(12,2) DEFAULT NULL,
  `monto_Base_Igv` decimal(12,2) DEFAULT NULL,
  `monto_Precio_Unitario` decimal(12,2) DEFAULT NULL,
  `monto_Valor_Venta` decimal(12,2) DEFAULT NULL,
  `porcentaje_Igv` decimal(12,2) DEFAULT NULL,
  `igv` decimal(12,2) DEFAULT NULL,
  `tip_Afe_Igv` varchar(4) DEFAULT NULL,
  `factor_Icbper` decimal(12,2) DEFAULT NULL,
  `total_Impuestos` decimal(12,2) DEFAULT NULL,
  `codigo` varchar(20) DEFAULT NULL,
  `cod_Prod_Sunat` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nota_id` (`nota_id`),
  CONSTRAINT `detalle_nota_cre_deb_ibfk_1` FOREIGN KEY (`nota_id`) REFERENCES `notas_credito_debito` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `distritos_transporte`
--

DROP TABLE IF EXISTS `distritos_transporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distritos_transporte` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `extra_camioneta` decimal(10,2) NOT NULL,
  `extra_camion` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `formas_pago_factura`
--

DROP TABLE IF EXISTS `formas_pago_factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formas_pago_factura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `factura_id` int DEFAULT NULL,
  `tipo` varchar(20) DEFAULT NULL,
  `monto` decimal(12,2) DEFAULT NULL,
  `cuota` int DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factura_id` (`factura_id`),
  CONSTRAINT `formas_pago_factura_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `factura` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gastos`
--

DROP TABLE IF EXISTS `gastos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gastos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asistencia_id` int NOT NULL,
  `descripcion` varchar(250) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `gasto_ibfk_1_idx` (`asistencia_id`),
  CONSTRAINT `gasto_ibfk_1` FOREIGN KEY (`asistencia_id`) REFERENCES `asistencias` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guias_de_remision`
--

DROP TABLE IF EXISTS `guias_de_remision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guias_de_remision` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_doc` varchar(2) DEFAULT NULL,
  `serie` varchar(4) DEFAULT NULL,
  `correlativo` varchar(10) DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `fecha_emision` timestamp NULL DEFAULT NULL,
  `empresa_ruc` varchar(11) DEFAULT NULL,
  `cliente_tipo_doc` varchar(1) DEFAULT NULL,
  `cliente_num_doc` varchar(15) DEFAULT NULL,
  `cliente_razon_social` varchar(255) DEFAULT NULL,
  `cliente_direccion` varchar(255) DEFAULT NULL,
  `guia_envio_cod_traslado` varchar(2) DEFAULT NULL,
  `guia_envio_mod_traslado` varchar(2) DEFAULT NULL,
  `guia_envio_peso_total` decimal(10,2) DEFAULT NULL,
  `guia_envio_und_peso_total` varchar(3) DEFAULT NULL,
  `guia_envio_fec_traslado` timestamp NULL DEFAULT NULL,
  `guia_envio_partida_ubigeo` varchar(6) DEFAULT NULL,
  `guia_envio_partida_direccion` varchar(255) DEFAULT NULL,
  `guia_envio_llegada_ubigeo` varchar(6) DEFAULT NULL,
  `guia_envio_llegada_direccion` varchar(255) DEFAULT NULL,
  `estado_documento` varchar(1) DEFAULT NULL,
  `manual` tinyint(1) DEFAULT NULL,
  `id_base_dato` varchar(20) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `guia_envio_des_traslado` varchar(255) DEFAULT NULL,
  `guia_envio_vehiculo_placa` varchar(10) DEFAULT NULL,
  `guia_envio_partida_ruc` varchar(11) DEFAULT NULL,
  `guia_envio_partida_cod_local` varchar(5) DEFAULT NULL,
  `guia_envio_llegada_ruc` varchar(11) DEFAULT NULL,
  `guia_envio_llegada_cod_local` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `guias_de_remision_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guia_choferes`
--

DROP TABLE IF EXISTS `guia_choferes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guia_choferes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guia_id` int DEFAULT NULL,
  `tipo_doc` varchar(1) DEFAULT NULL,
  `nro_doc` varchar(15) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `licencia` varchar(20) DEFAULT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `nro_mtc` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `guia_id` (`guia_id`),
  CONSTRAINT `guia_choferes_ibfk_1` FOREIGN KEY (`guia_id`) REFERENCES `guias_de_remision` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `guia_detalles`
--

DROP TABLE IF EXISTS `guia_detalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guia_detalles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guia_id` int DEFAULT NULL,
  `unidad` varchar(3) DEFAULT NULL,
  `cantidad` decimal(10,2) DEFAULT NULL,
  `cod_producto` varchar(50) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `guia_id` (`guia_id`),
  CONSTRAINT `guia_detalles_ibfk_1` FOREIGN KEY (`guia_id`) REFERENCES `guias_de_remision` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipos_trabajo`
--

DROP TABLE IF EXISTS `tipos_trabajo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_trabajo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jornadas`
--

DROP TABLE IF EXISTS `jornadas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jornadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asistencia_id` int NOT NULL,
  `turno` enum('mañana','tarde') NOT NULL,
  `lugar` enum('almacen','obra') NOT NULL,
  `tipo_trabajo_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `jornada_ibfk_1_idx` (`tipo_trabajo_id`),
  CONSTRAINT `jornada_ibfk_1` FOREIGN KEY (`tipo_trabajo_id`) REFERENCES `tipos_trabajo` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `legend_factura`
--

DROP TABLE IF EXISTS `legend_factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legend_factura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `factura_id` int DEFAULT NULL,
  `legend_code` varchar(10) DEFAULT NULL,
  `legend_value` text,
  PRIMARY KEY (`id`),
  KEY `factura_id` (`factura_id`),
  CONSTRAINT `legend_factura_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `factura` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `legend_nota_cre_deb`
--

DROP TABLE IF EXISTS `legend_nota_cre_deb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legend_nota_cre_deb` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nota_id` int DEFAULT NULL,
  `legend_Value` text,
  `legend_Code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `nota_id` (`nota_id`),
  CONSTRAINT `legend_nota_cre_deb_ibfk_1` FOREIGN KEY (`nota_id`) REFERENCES `notas_credito_debito` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pieza_id` int NOT NULL,
  `stock_fijo` int NOT NULL DEFAULT '0',
  `stock_disponible` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `pieza_id_UNIQUE` (`pieza_id`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`pieza_id`) REFERENCES `piezas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=551 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movimiento_stock`
--

DROP TABLE IF EXISTS `movimiento_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimiento_stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stock_id` int NOT NULL,
  `tipo` enum('Alquiler','Devolucion','Ajuste ingreso','Ajuste salida','Ingreso','Baja','Venta','Ingreso-reparacion','Salida-reparacion') NOT NULL,
  `cantidad` int NOT NULL,
  `stock_pre_movimiento` int NOT NULL,
  `stock_post_movimiento` int NOT NULL,
  `tipo_stock` enum('Disponible','Fijo') NOT NULL,
  `motivo` varchar(300) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `movimiento_stock_ibfk_1_idx` (`stock_id`),
  CONSTRAINT `movimiento_stock_ibfk_1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `mensaje` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `leida` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `piezas_usos`
--

DROP TABLE IF EXISTS `piezas_usos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `piezas_usos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pieza_id` int NOT NULL,
  `uso_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pieza_id` (`pieza_id`),
  KEY `uso_id` (`uso_id`),
  CONSTRAINT `piezas_usos_ibfk_1` FOREIGN KEY (`pieza_id`) REFERENCES `piezas` (`id`),
  CONSTRAINT `piezas_usos_ibfk_2` FOREIGN KEY (`uso_id`) REFERENCES `usos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=356 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sunat_respuesta`
--

DROP TABLE IF EXISTS `sunat_respuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sunat_respuesta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensaje` text,
  `hash` text,
  `cdr_zip` longblob,
  `sunat_success` tinyint(1) DEFAULT NULL,
  `cdr_response_id` varchar(100) DEFAULT NULL,
  `cdr_response_code` varchar(10) DEFAULT NULL,
  `cdr_response_description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `factura_id` int DEFAULT NULL,
  `nota_id` int DEFAULT NULL,
  `guia_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `factura_id` (`factura_id`),
  KEY `nota_id` (`nota_id`),
  KEY `guia_id` (`guia_id`),
  CONSTRAINT `sunat_respuesta_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `factura` (`id`),
  CONSTRAINT `sunat_respuesta_ibfk_2` FOREIGN KEY (`nota_id`) REFERENCES `notas_credito_debito` (`id`),
  CONSTRAINT `sunat_respuesta_ibfk_3` FOREIGN KEY (`guia_id`) REFERENCES `guias_de_remision` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tareas`
--

DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `empresaProveedoraId` int DEFAULT NULL,
  `clienteId` int DEFAULT NULL,
  `obraId` int DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `tipoTarea` enum('Apoyo Técnico','Apoyo Administrativo','Pase de Pedido','Servicios Adicionales','Tarea Interna') NOT NULL,
  `estado` enum('Pendiente','En proceso','Finalizada','Devuelta','Cancelada') NOT NULL DEFAULT 'Pendiente',
  `motivoDevolucion` text,
  `correccionComercial` text,
  `fecha_creacion` datetime DEFAULT NULL,
  `detalles` json DEFAULT NULL,
  `asignadoA` int DEFAULT NULL,
  `contactoId` int DEFAULT NULL,
  `usoId` int DEFAULT NULL,
  `atributos_valor_zonas` json DEFAULT NULL,
  `cotizacionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuarioId` (`usuarioId`),
  KEY `empresaProveedoraId` (`empresaProveedoraId`),
  KEY `clienteId` (`clienteId`),
  KEY `obraId` (`obraId`),
  KEY `Tareas_asignadoA_foreign_idx` (`asignadoA`),
  KEY `fk_tareas_contactoId` (`contactoId`),
  KEY `fk_tareas_usoId` (`usoId`),
  CONSTRAINT `fk_tareas_contactoId` FOREIGN KEY (`contactoId`) REFERENCES `contactos` (`id`),
  CONSTRAINT `fk_tareas_usoId` FOREIGN KEY (`usoId`) REFERENCES `usos` (`id`),
  CONSTRAINT `Tareas_asignadoA_foreign_idx` FOREIGN KEY (`asignadoA`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tareas_ibfk_2` FOREIGN KEY (`empresaProveedoraId`) REFERENCES `empresas_proveedoras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tareas_ibfk_3` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tareas_ibfk_4` FOREIGN KEY (`obraId`) REFERENCES `obras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ubigeos`
--

DROP TABLE IF EXISTS `ubigeos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ubigeos` (
  `codigo` int DEFAULT NULL,
  `departamento` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provincia` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distrito` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extra_camioneta_soles` decimal(10,2) DEFAULT NULL,
  `extra_camion_soles` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vacaciones`
--

DROP TABLE IF EXISTS `vacaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trabajador_id` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_termino` date NOT NULL,
  `dias_tomados` int NOT NULL,
  `dias_vendidos` int NOT NULL,
  `observaciones` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `vacaciones_ibfk_1_idx` (`trabajador_id`),
  CONSTRAINT `vacaciones_ibfk_1` FOREIGN KEY (`trabajador_id`) REFERENCES `trabajadores` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-14 15:35:06
