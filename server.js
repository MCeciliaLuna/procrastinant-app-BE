// =====================================================
// IMPORTACIÓN DE DEPENDENCIAS
// =====================================================
// Estas son las bibliotecas que nuestro servidor necesita para funcionar:

// Express: Framework web que facilita la creación de servidores HTTP
// y el manejo de rutas, peticiones y respuestas
const express = require('express');

// Dotenv: Permite cargar variables de entorno desde un archivo .env
// Esto nos ayuda a mantener información sensible (como contraseñas,
// puertos, etc.) fuera del código
const dotenv = require('dotenv');

// CORS (Cross-Origin Resource Sharing): Middleware que permite que
// nuestro servidor acepte peticiones desde otros dominios (como nuestro frontend)
const cors = require('cors');

// =====================================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// =====================================================
// Carga las variables definidas en el archivo .env en process.env
// De esta forma, podemos acceder a ellas con process.env.NOMBRE_VARIABLE
dotenv.config();

// =====================================================
// CREACIÓN DE LA APLICACIÓN EXPRESS
// =====================================================
// Creamos una instancia de Express, que será nuestro servidor
// Esta instancia (app) nos permitirá definir rutas, middlewares y configuraciones
const app = express();

// =====================================================
// CONFIGURACIÓN DE CORS
// =====================================================
// Definimos las opciones de CORS para controlar qué orígenes pueden
// acceder a nuestro servidor

const corsOptions = {
  // origin: Define qué URL(es) pueden hacer peticiones a nuestro servidor
  // En desarrollo, permitimos solo el servidor de Vite (frontend)
  origin: 'http://localhost:5173',

  // methods: Lista de métodos HTTP permitidos
  // GET: obtener datos, POST: crear datos, PUT: actualizar completo,
  // DELETE: eliminar datos, PATCH: actualizar parcial
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

  // allowedHeaders: Qué cabeceras HTTP acepta el servidor
  // Content-Type: tipo de contenido (ej: application/json)
  // Authorization: para enviar tokens de autenticación
  allowedHeaders: ['Content-Type', 'Authorization'],

  // credentials: Permite el envío de cookies y credenciales
  // entre el cliente y el servidor
  credentials: true,
};

// =====================================================
// MIDDLEWARES
// =====================================================
// Los middlewares son funciones que se ejecutan ANTES de llegar a las rutas
// Procesan las peticiones entrantes de diferentes maneras

// 1. express.json(): Permite que Express entienda peticiones con cuerpo JSON
//    Convierte el JSON del body en un objeto JavaScript accesible en req.body
app.use(express.json());

// 2. express.urlencoded(): Permite procesar datos enviados desde formularios HTML
//    extended: true permite objetos y arrays en los datos del formulario
app.use(express.urlencoded({ extended: true }));

// 3. cors(): Aplica la configuración CORS definida anteriormente
//    Esto permite que nuestro frontend pueda comunicarse con el backend
app.use(cors(corsOptions));

// =====================================================
// RUTAS
// =====================================================

// Ruta raíz (GET /): Ruta de bienvenida del servidor
// Cuando alguien accede a http://localhost:3000/ recibe este mensaje
app.get('/', (req, res) => {
  // req (request): Objeto con información de la petición del cliente
  // res (response): Objeto para enviar la respuesta al cliente

  // res.json(): Envía una respuesta en formato JSON
  res.json({
    message: 'Bienvenido a la DB de Procrastinant App!',
  });
});

// NOTA: Aquí se agregarán más rutas en el futuro:
// - Rutas de autenticación (login, registro, recuperación de contraseña)
// - Rutas de tareas (crear, leer, actualizar, eliminar tareas)
// - Rutas de perfil de usuario, etc.

// =====================================================
// CONFIGURACIÓN DEL PUERTO
// =====================================================
// Definimos en qué puerto escuchará nuestro servidor
// Primero intenta usar el puerto de la variable de entorno (process.env.PORT)
// Si no existe, usa el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

// =====================================================
// INICIAR EL SERVIDOR
// =====================================================
// app.listen() inicia el servidor y lo pone a escuchar en el puerto especificado
app.listen(PORT, () => {
  // Esta función callback se ejecuta cuando el servidor inicia correctamente
  // Muestra un mensaje en la consola confirmando que está funcionando
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
