-- Base de datos para Bazar Eco Tienda
CREATE DATABASE IF NOT EXISTS bazar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bazar_db;

-- Tabla USUARIOS
CREATE TABLE IF NOT EXISTS USUARIOS (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(100) NOT NULL,
    rol ENUM('ventas', 'administracion', 'deposito', 'produccion', 'gerencia') NOT NULL,
    INDEX idx_usuario (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla CLIENTES
CREATE TABLE IF NOT EXISTS CLIENTES (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(150),
    email VARCHAR(100),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla PROVEEDORES
CREATE TABLE IF NOT EXISTS PROVEEDORES (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla PRODUCTOS
CREATE TABLE IF NOT EXISTS PRODUCTOS (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen_url VARCHAR(150) NOT NULL,
    id_proveedor INT NOT NULL,
    categoria VARCHAR(50),
    FOREIGN KEY (id_proveedor) REFERENCES PROVEEDORES(id_proveedor) ON DELETE RESTRICT,
    INDEX idx_categoria (categoria),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla VENTAS
CREATE TABLE IF NOT EXISTS VENTAS (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    forma_pago VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (id_cliente) REFERENCES CLIENTES(id_cliente) ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario) ON DELETE RESTRICT,
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla DETALLE_VENTA
CREATE TABLE IF NOT EXISTS DETALLE_VENTA (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES VENTAS(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES PRODUCTOS(id_producto) ON DELETE RESTRICT,
    INDEX idx_venta (id_venta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla PEDIDOS
CREATE TABLE IF NOT EXISTS PEDIDOS (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(200) NOT NULL,
    estado ENUM('en proceso', 'finalizado', 'entregado') NOT NULL DEFAULT 'en proceso',
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_creacion DATE NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES CLIENTES(id_cliente) ON DELETE RESTRICT,
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario) ON DELETE RESTRICT,
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo
-- Insertar un proveedor por defecto
INSERT INTO PROVEEDORES (nombre, contacto, telefono, email) VALUES
('Proveedor General', 'Juan Pérez', '1234567890', 'contacto@proveedor.com')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar productos de ejemplo con imágenes
INSERT INTO PRODUCTOS (nombre, precio, stock, imagen_url, id_proveedor, categoria) VALUES
('Vaso reutilizable', 2200.00, 50, 'assets/vaso.png', 1, 'vasos'),
('Vaso térmico', 6900.00, 30, 'assets/vasoTermico.png', 1, 'vasos'),
('Plato de bambú', 3500.00, 40, 'assets/plato.png', 1, 'platos'),
('Plato postre', 2800.00, 35, 'assets/platos.png', 1, 'platos'),
('Contenedor de vidrio', 7800.00, 25, 'assets/contenedor.png', 1, 'contenedores'),
('Compostera para hogar', 19990.00, 15, 'assets/compostera.png', 1, 'composteras'),
('Jarra térmica', 12500.00, 20, 'assets/jarra.png', 1, 'jarras'),
('Set de cubiertos', 5200.00, 45, 'assets/vasos.png', 1, 'cubiertos')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- Insertar un usuario de ejemplo (contraseña: admin123 - hash bcrypt)
INSERT INTO USUARIOS (nombre, usuario, contrasena, rol) VALUES
('Administrador', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administracion')
ON DUPLICATE KEY UPDATE usuario=usuario;

