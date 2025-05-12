-- Tabla: familias_piezas
CREATE TABLE familias_piezas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE piezas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item VARCHAR(100) UNIQUE NOT NULL,
  familia_id INT NOT NULL, 
  descripcion VARCHAR(255) NOT NULL,
  peso_kg DECIMAL(10,2) DEFAULT 0,
  precio_venta_dolares DECIMAL(10,2) DEFAULT 0,
  precio_venta_soles DECIMAL(10,2) DEFAULT 0,
  precio_alquiler_soles DECIMAL(10,2) DEFAULT 0,
  stock_actual INT DEFAULT 0,

  CONSTRAINT fk_piezas_familia
    FOREIGN KEY (familia_id)
    REFERENCES familias_piezas(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- Tabla: usos
CREATE TABLE usos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

-- Tabla: despieces
CREATE TABLE despieces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subtotal DECIMAL(10,2) NOT NULL,
   porcentaje_descuento DECIMAL(10,2) DEFAULT 0,
subtotal_con_descuento DECIMAL(10,2) DEFAULT 0,
igv_porcentaje DECIMAL(10,2) DEFAULT 18,
igv_monto DECIMAL(10,2) DEFAULT 0,
total_final DECIMAL(10,2) DEFAULT 0
);

-- Tabla: despieces_detalle
CREATE TABLE despieces_detalle (
  id INT AUTO_INCREMENT PRIMARY KEY,
  despiece_id INT NOT NULL, 
  pieza_id INT NOT NULL, 
  cantidad int not null,
  peso_kg DECIMAL(10,2) DEFAULT 0,
  precio_venta_dolares DECIMAL(10,2) DEFAULT 0,
  precio_venta_soles DECIMAL(10,2) DEFAULT 0,
  precio_alquiler_soles DECIMAL(10,2) DEFAULT 0,
  
   CONSTRAINT fk_despieces_detalle_despieces
    FOREIGN KEY (despiece_id)
    REFERENCES despieces(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
    
    CONSTRAINT fk_despieces_detalle_piezas
    FOREIGN KEY (pieza_id)
    REFERENCES piezas(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);