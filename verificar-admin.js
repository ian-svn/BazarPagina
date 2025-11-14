const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verificarAdmin() {
  let connection;
  try {
    console.log('Conectando a la base de datos...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sistema_bazar',
      port: process.env.DB_PORT || 3306
    });

    console.log('✓ Conectado a MySQL');

    // Verificar si existe el usuario admin
    const [users] = await connection.execute(
      'SELECT * FROM usuarios WHERE usuario = ?',
      ['admin']
    );

    if (users.length === 0) {
      console.log('Usuario admin no existe. Creando...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'INSERT INTO usuarios (nombre, usuario, contrasena, rol) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin', hashedPassword, 'gerencia']
      );
      console.log('✓ Usuario admin creado exitosamente');
    } else {
      console.log('Usuario admin existe. Actualizando contraseña...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'UPDATE usuarios SET contrasena = ? WHERE usuario = ?',
        [hashedPassword, 'admin']
      );
      console.log('✓ Contraseña del usuario admin actualizada');
    }

    // Verificar la contraseña
    const [testUsers] = await connection.execute(
      'SELECT * FROM usuarios WHERE usuario = ?',
      ['admin']
    );
    const testUser = testUsers[0];
    const isValid = await bcrypt.compare('admin123', testUser.contrasena);
    
    if (isValid) {
      console.log('✓ Contraseña verificada correctamente');
    } else {
      console.log('✗ ERROR: La contraseña no coincide');
    }

    console.log('\n========================================');
    console.log('   Credenciales de Administrador');
    console.log('========================================');
    console.log('Usuario: admin');
    console.log('Contraseña: admin123');
    console.log('========================================\n');

  } catch (error) {
    console.error('✗ ERROR:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   No se puede conectar a MySQL. Verifica que esté corriendo.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   La base de datos no existe. Ejecuta inicializar-db.bat primero.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   Credenciales incorrectas. Verifica el archivo .env');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

verificarAdmin();

