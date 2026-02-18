import axios from 'axios';

// Configurar la URL base según el entorno
// En producción, las rutas /api van al mismo dominio (Vercel las maneja)
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Usar rutas relativas en producción
  : 'http://localhost:5000';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

