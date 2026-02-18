// Endpoint para inicializar la base de datos en Vercel
// Acceder desde: https://tu-proyecto.vercel.app/api/init-db
const initDatabase = require('../server/scripts/init-db');

module.exports = async (req, res) => {
  // Protección básica: solo permitir en desarrollo o con token secreto
  const secret = req.query.secret || req.headers['x-init-secret'];
  const allowedSecret = process.env.INIT_DB_SECRET || 'init_db_secret_2024_cambiar';
  
  if (secret !== allowedSecret) {
    return res.status(401).json({ 
      error: 'No autorizado. Proporciona el parámetro ?secret=tu_secreto' 
    });
  }

  try {
    console.log('Inicializando base de datos...');
    await initDatabase();
    res.json({ 
      success: true, 
      message: 'Base de datos inicializada correctamente',
      details: 'Tablas creadas, usuario admin creado, productos de ejemplo insertados'
    });
  } catch (error) {
    console.error('Error al inicializar base de datos:', error);
    res.status(500).json({ 
      error: 'Error al inicializar base de datos',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
