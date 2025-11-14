const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');

async function initDatabase() {
  let connection;
  try {
    // Conectar sin especificar base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Conectado a MySQL');

    // Crear base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'sistema_bazar'}`);
    
    // Cerrar conexión y reconectar a la base de datos específica
    await connection.end();
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sistema_bazar',
      port: process.env.DB_PORT || 3306
    });

    console.log('Base de datos creada/seleccionada');

    // Crear tablas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        contrasena VARCHAR(100) NOT NULL,
        rol ENUM('ventas','administracion','deposito','produccion','gerencia') NOT NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clientes (
        id_cliente INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        direccion VARCHAR(150),
        email VARCHAR(100)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS proveedores (
        id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        contacto VARCHAR(100),
        telefono VARCHAR(20),
        email VARCHAR(100)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS productos (
        id_producto INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion VARCHAR(200),
        stock INT DEFAULT 0,
        precio DECIMAL(10,2) NOT NULL,
        imagen_url VARCHAR(255) NOT NULL,
        id_proveedor INT,
        FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ventas (
        id_venta INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATE NOT NULL,
        id_cliente INT,
        id_usuario INT,
        forma_pago ENUM('efectivo','tarjeta','transferencia','cuenta_corriente') NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
          ON UPDATE CASCADE
          ON DELETE SET NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS detalle_venta (
        id_detalle INT AUTO_INCREMENT PRIMARY KEY,
        id_venta INT NOT NULL,
        id_producto INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (id_venta) REFERENCES ventas(id_venta)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
        FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
          ON UPDATE CASCADE
          ON DELETE RESTRICT
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pedidos_personalizados (
        id_pedido INT AUTO_INCREMENT PRIMARY KEY,
        id_cliente INT,
        descripcion TEXT NOT NULL,
        fecha_pedido DATE NOT NULL,
        estado ENUM('pendiente','en_produccion','finalizado','entregado') DEFAULT 'pendiente',
        FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      )
    `);

    console.log('Tablas creadas exitosamente');

    // Crear usuario admin por defecto
    const [users] = await connection.execute('SELECT * FROM usuarios WHERE usuario = ?', ['admin']);
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'INSERT INTO usuarios (nombre, usuario, contrasena, rol) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin', hashedPassword, 'gerencia']
      );
      console.log('Usuario admin creado (usuario: admin, contraseña: admin123)');
    }

    // Insertar productos de ejemplo con las imágenes disponibles
    const [productos] = await connection.execute('SELECT COUNT(*) as count FROM productos');
    if (productos[0].count === 0) {
      const productosEjemplo = [
        { nombre: 'Taza', descripcion: 'Taza de cerámica personalizada', stock: 50, precio: 1500, imagen: 'taza.png' },
        { nombre: 'Tazas (Pack)', descripcion: 'Pack de tazas', stock: 20, precio: 5000, imagen: 'tazas.png' },
        { nombre: 'Vaso', descripcion: 'Vaso de vidrio', stock: 40, precio: 800, imagen: 'vaso.png' },
        { nombre: 'Vasos (Pack)', descripcion: 'Pack de vasos', stock: 15, precio: 3000, imagen: 'vasos.png' },
        { nombre: 'Vaso Térmico', descripcion: 'Vaso térmico aislante', stock: 30, precio: 3500, imagen: 'vasoTermico.png' },
        { nombre: 'Vasos Térmicos (Pack)', descripcion: 'Pack de vasos térmicos', stock: 10, precio: 12000, imagen: 'vasosTermicos.png' },
        { nombre: 'Plato', descripcion: 'Plato de cerámica', stock: 35, precio: 1200, imagen: 'plato.png' },
        { nombre: 'Platos (Pack)', descripcion: 'Pack de platos', stock: 12, precio: 4500, imagen: 'platos.png' },
        { nombre: 'Jarra', descripcion: 'Jarra de vidrio', stock: 25, precio: 2500, imagen: 'jarra.png' },
        { nombre: 'Contenedor', descripcion: 'Contenedor reutilizable', stock: 30, precio: 1800, imagen: 'contenedor.png' },
        { nombre: 'Contenedores (Pack)', descripcion: 'Pack de contenedores', stock: 8, precio: 6000, imagen: 'contenedores.png' },
        { nombre: 'Compostera', descripcion: 'Compostera ecológica', stock: 15, precio: 8000, imagen: 'compostera.png' },
        { nombre: 'Composteras (Pack)', descripcion: 'Pack de composteras', stock: 5, precio: 28000, imagen: 'composteras.png' }
      ];

      for (const producto of productosEjemplo) {
        await connection.execute(
          'INSERT INTO productos (nombre, descripcion, stock, precio, imagen_url) VALUES (?, ?, ?, ?, ?)',
          [producto.nombre, producto.descripcion, producto.stock, producto.precio, `/assets/${producto.imagen}`]
        );
      }
      console.log('Productos de ejemplo insertados');
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar base de datos:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase()
  .then(() => {
    console.log('Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });

