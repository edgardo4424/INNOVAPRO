UPDATE piezas SET item = 'XX.0000' WHERE (id = '159');
UPDATE piezas SET item = 'XX.0001' WHERE (id = '157');
UPDATE piezas SET item = 'XX.0002' WHERE (id = '161');

UPDATE piezas SET item = 'PU.0350', peso_kg = '1.50' WHERE (id = '163');
UPDATE piezas SET item = 'PU.0450', peso_kg = '1.50' WHERE (id = '165');
UPDATE piezas SET item = 'PU.0200', peso_kg = '10.00', precio_alquiler_soles = '10.00' WHERE (id = '160');
UPDATE piezas SET item = 'PU.0400', peso_kg = '1.50' WHERE (id = '164');
UPDATE piezas SET item = 'PU.0150', precio_alquiler_soles = '9.00' WHERE (id = '159');
UPDATE piezas SET item = 'PU.0500', peso_kg = '1.50' WHERE (id = '166');
UPDATE piezas SET item = 'PU.0550', peso_kg = '9.61', precio_venta_dolares = '51.96', precio_venta_soles = '192.24' WHERE (id = '167');
UPDATE piezas SET peso_kg = '9.00', precio_alquiler_soles = '9.00' WHERE (id = '156');
UPDATE piezas SET item = 'PU.0250', peso_kg = '10.00', precio_alquiler_soles = '10.00' WHERE (id = '161');
UPDATE piezas SET peso_kg = '15.00', precio_alquiler_soles = '15.00' WHERE (id = '162');

UPDATE piezas SET item = 'XX.0002' WHERE (id = '158');
UPDATE piezas SET item = 'PU.0300' WHERE (id = '162');

-- 🔹 Eliminaciones
DELETE FROM piezas_usos WHERE (id = '84');
DELETE FROM piezas_usos WHERE (id = '85');
DELETE FROM piezas WHERE (id = '157');
DELETE FROM piezas WHERE (id = '158');

-- 🔹 Actualización de familias
UPDATE familias_piezas SET codigo = 'CO' WHERE (id = '5');