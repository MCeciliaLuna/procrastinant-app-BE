# Prompt: Implementación de Enrutamiento y Controladores Backend

## Contexto del Proyecto

Este prompt corresponde a la **segunda etapa del backend: implementación completa del sistema de enrutamiento**. El servidor básico con Express ya está creado y funcional. Ahora necesito implementar todos los endpoints de la API REST, controladores, modelos, middlewares, validaciones y conexión a MongoDB.

**IMPORTANTE:** Se te proporcionará un documento markdown (`backend-routing-specification.md`) que contiene la especificación completa de todos los endpoints. Debes seguir exactamente esa especificación para la implementación.

---

## Objetivo

Necesito que implementes el sistema completo de enrutamiento del backend siguiendo el documento de especificación adjunto, creando toda la estructura de carpetas, modelos de MongoDB con Mongoose, controladores con código boilerplate funcional, middlewares de autenticación y validación, y dejando todo listo para pruebas con Postman.

---

## Especificaciones Técnicas

### Tecnologías Existentes
- Node.js 24.12.0 LTS
- Express.js (ya instalado)
- CommonJS (require/module.exports)
- Sistema operativo: Debian 12

### Nuevas Dependencias a Instalar

**Dependencias de producción:**
1. **mongoose** - ODM para MongoDB
2. **jsonwebtoken** - Generación y verificación de tokens JWT
3. **express-validator** - Validación de datos de entrada
4. **express-rate-limit** - Rate limiting para protección contra ataques
5. **helmet** - Middlewares de seguridad HTTP
6. **morgan** - Logger de peticiones HTTP

**Nota:** `bcrypt` y `cors` ya están instalados.

### Base de Datos
- **MongoDB Compass**: Ya instalado en el sistema (no instalar en el proyecto)
- **Conexión**: MongoDB local en `mongodb://localhost:27017`
- **Nombre de la base de datos**: `procrastinant-app-BE`
- **ODM**: Mongoose

---

## Estructura de Carpetas Completa a Crear

```
procrastinant-app-BE/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de conexión a MongoDB
│   │   └── env.js               # Manejo centralizado de variables de entorno
│   ├── models/
│   │   ├── User.model.js        # Modelo de Usuario (Mongoose)
│   │   └── Tarea.model.js       # Modelo de Tarea (Mongoose)
│   ├── controllers/
│   │   ├── auth.controller.js   # Controlador de autenticación
│   │   ├── tareas.controller.js # Controlador de tareas
│   │   └── user.controller.js   # Controlador de usuario
│   ├── routes/
│   │   ├── auth.routes.js       # Rutas de autenticación
│   │   ├── tareas.routes.js     # Rutas de tareas
│   │   ├── user.routes.js       # Rutas de usuario
│   │   └── index.js             # Agregador de rutas
│   ├── middlewares/
│   │   ├── auth.middleware.js   # Verificación de JWT
│   │   ├── validate.middleware.js # Procesamiento de validaciones
│   │   └── errorHandler.middleware.js # Manejo centralizado de errores
│   ├── validators/
│   │   ├── auth.validator.js    # Validaciones de autenticación
│   │   ├── tarea.validator.js   # Validaciones de tareas
│   │   └── user.validator.js    # Validaciones de usuario
│   └── utils/
│       ├── jwt.utils.js         # Utilidades para JWT
│       └── response.utils.js    # Utilidades para respuestas estandarizadas
├── postman/
│   └── Procrastinant-API.postman_collection.json # Colección de Postman
├── .env                          # Variables de entorno (actualizar)
├── .env.example                  # Ejemplo actualizado
├── server.js                     # Archivo principal (actualizar)
├── package.json                  # Actualizar con nuevas dependencias
└── README.md                     # Actualizar con documentación completa
```

---

## Variables de Entorno

### Actualizar archivo .env

Agregar las siguientes variables al archivo `.env` existente:

```env
# Server Configuration (ya existe)
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/procrastinant-app-BE
MONGODB_URI_TEST=mongodb://localhost:27017/procrastinant-app-BE-test

# JWT Configuration
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion_2025
JWT_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173

# Environment
NODE_ENV=development
```

### Actualizar archivo .env.example

Actualizar con las mismas variables pero sin valores:

```env
# Server Configuration
PORT=

# Database Configuration
MONGODB_URI=
MONGODB_URI_TEST=

# JWT Configuration
JWT_SECRET=
JWT_EXPIRES_IN=

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=

# CORS Configuration
ALLOWED_ORIGINS=

# Environment
NODE_ENV=
```

---

## Especificación de Implementación

### Nivel de Implementación: Código Boilerplate + TODOs

**Lo que DEBE estar implementado:**
- ✅ Estructura completa de carpetas y archivos
- ✅ Modelos de Mongoose completamente definidos (User, Tarea)
- ✅ Conexión a MongoDB funcional
- ✅ Sistema de rutas completo con todos los endpoints
- ✅ Middlewares de autenticación (JWT) funcionales
- ✅ Middlewares de validación con express-validator
- ✅ Middleware de manejo de errores centralizado
- ✅ Utilidades de JWT (generar, verificar)
- ✅ Utilidades de respuestas estandarizadas
- ✅ Validadores completos para todos los endpoints
- ✅ Configuración de CORS, helmet, rate limiting, morgan
- ✅ Estructura básica de controladores

**Lo que debe tener TODOs/comentarios:**
- 🔶 Lógica específica de negocio en controladores (ej: validación de email duplicado en registro)
- 🔶 Implementación completa de hash de passwords con bcrypt
- 🔶 Queries específicas a MongoDB en controladores
- 🔶 Lógica de reordenamiento de tareas
- 🔶 Validación de pertenencia de recursos (usuario solo accede a sus tareas)

**Ejemplo de implementación esperada en controladores:**

```javascript
// controllers/auth.controller.js
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.utils');
const { successResponse, errorResponse } = require('../utils/response.utils');

exports.register = async (req, res, next) => {
  try {
    const { nombre, apellido, alias, email, password } = req.body;

    // TODO: Verificar que el email no esté ya registrado
    // const existingUser = await User.findOne({ email });
    // if (existingUser) { ... }

    // TODO: Hashear contraseña con bcrypt
    // const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));

    // TODO: Crear usuario en base de datos
    // const newUser = new User({ nombre, apellido, alias, email, password: hashedPassword });
    // await newUser.save();

    // TODO: Generar token JWT
    // const token = generateToken(newUser._id);

    // TODO: Devolver respuesta con usuario (sin password) y token
    // return successResponse(res, 201, 'Usuario registrado exitosamente', { user: {...}, token });

    // Placeholder response
    return successResponse(res, 201, 'Endpoint de registro - Implementar lógica', null);
  } catch (error) {
    next(error);
  }
};
```

---

## Modelos de MongoDB (Mongoose)

### 1. Modelo de Usuario (src/models/User.model.js)

**Campos requeridos:**
```javascript
{
  nombre: String (required, trim, minLength: 2, maxLength: 50),
  apellido: String (required, trim, minLength: 2, maxLength: 50),
  alias: String (required, trim, minLength: 3, maxLength: 20),
  email: String (required, unique, lowercase, validación de email),
  password: String (required, minLength: 8, nunca devolver en respuestas),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Configuraciones adicionales:**
- Índice único en `email`
- Método `toJSON` que excluya `password` y `__v`
- Timestamps automáticos

### 2. Modelo de Tarea (src/models/Tarea.model.js)

**Campos requeridos:**
```javascript
{
  userId: ObjectId (ref: 'User', required, index),
  descripcion: String (required, trim, minLength: 1, maxLength: 300),
  listo: Boolean (default: false),
  numeroOrden: Number (required, min: 0),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Configuraciones adicionales:**
- Índice compuesto: `{ userId: 1, numeroOrden: 1 }`
- Índice compuesto: `{ userId: 1, listo: 1 }`
- Método `toJSON` que excluya `__v`
- Timestamps automáticos

---

## Sistema de Rutas

### Estructura de Endpoints (seguir especificación del markdown)

**Autenticación (`/api/auth`):**
1. `POST /api/auth/register` - Registro de usuario
2. `POST /api/auth/login` - Inicio de sesión
3. `POST /api/auth/logout` - Cerrar sesión (privada)

**Tareas (`/api/tareas`):** (todas privadas)
1. `GET /api/tareas` - Obtener todas las tareas
2. `POST /api/tareas` - Crear nueva tarea
3. `PUT /api/tareas/:id` - Actualizar tarea
4. `PATCH /api/tareas/:id/toggle` - Cambiar estado (listo)
5. `DELETE /api/tareas/:id` - Eliminar tarea
6. `POST /api/tareas/reorder` - Reordenar tareas

**Usuario (`/api/user`):** (todas privadas)
1. `GET /api/user/profile` - Obtener perfil
2. `GET /api/user/verify` - Verificar autenticación
3. `PUT /api/user/profile` - Actualizar perfil
4. `PUT /api/user/password` - Cambiar contraseña
5. `DELETE /api/user/account` - Eliminar cuenta (física, no soft delete)

**Adicional:**
- `GET /api/health` - Health check (pública)

---

## Middlewares Requeridos

### 1. Middleware de Autenticación (src/middlewares/auth.middleware.js)

**Funcionalidad:**
- Extraer token del header `Authorization: Bearer <token>`
- Verificar token con `jwt.verify()`
- Agregar `req.userId` y `req.user` al request
- Manejar errores: token ausente, inválido, expirado

**Códigos de error:**
- 401: Token ausente, inválido o expirado

### 2. Middleware de Validación (src/middlewares/validate.middleware.js)

**Funcionalidad:**
- Procesar resultados de `express-validator`
- Formatear errores en estructura estándar
- Devolver 400 si hay errores de validación

### 3. Middleware de Manejo de Errores (src/middlewares/errorHandler.middleware.js)

**Funcionalidad:**
- Capturar todos los errores no manejados
- Formatear respuesta de error estándar
- Log de errores en desarrollo
- Códigos de estado apropiados

**Estructura de respuesta de error:**
```javascript
{
  success: false,
  message: "Mensaje de error",
  errors: [{ field: "campo", message: "mensaje" }] || null,
  ...(NODE_ENV === 'development' && { stack: err.stack })
}
```

---

## Validadores con Express Validator

### Crear validadores para todos los endpoints

**Ejemplo de estructura esperada (auth.validator.js):**

```javascript
const { body } = require('express-validator');
const { validarResultados } = require('../middlewares/validate.middleware');

exports.validarRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),
  
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras'),
  
  body('alias')
    .trim()
    .notEmpty().withMessage('El alias es requerido')
    .isLength({ min: 3, max: 20 }).withMessage('El alias debe tener entre 3 y 20 caracteres')
    .isAlphanumeric().withMessage('El alias solo puede contener letras y números'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula y un número'),
  
  validarResultados
];

exports.validarLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  
  validarResultados
];
```

**Crear validadores similares para:**
- Tareas: crear, actualizar, toggle, reordenar
- Usuario: actualizar perfil, cambiar contraseña

---

## Utilidades

### 1. JWT Utils (src/utils/jwt.utils.js)

**Funciones requeridas:**
```javascript
// Generar token JWT
exports.generateToken = (userId) => {
  // Implementar con jwt.sign()
};

// Verificar token JWT
exports.verifyToken = (token) => {
  // Implementar con jwt.verify()
};
```

### 2. Response Utils (src/utils/response.utils.js)

**Funciones requeridas:**
```javascript
// Respuesta de éxito
exports.successResponse = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Respuesta de error
exports.errorResponse = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
```

---

## Configuración de Express

### Actualizar server.js

**Agregar:**
- Conexión a MongoDB al iniciar servidor
- Importar y usar agregador de rutas (`/api`)
- Configurar CORS con `ALLOWED_ORIGINS`
- Configurar helmet
- Configurar rate limiting
- Configurar morgan
- Middleware de manejo de errores
- Handler 404

**Estructura esperada:**

```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/database');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler.middleware');

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares de seguridad
app.use(helmet());

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    success: false,
    message: 'Demasiadas peticiones, intenta de nuevo más tarde',
    errors: null
  }
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Ruta de bienvenida (mantener la existente)
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la DB de Procrastinant App!' });
});

// Rutas de API
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
    errors: null
  });
});

// Error handler
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

---

## Colección de Postman

### Crear archivo: postman/Procrastinant-API.postman_collection.json

**Requisitos:**
- Colección completa con todos los 15 endpoints
- Variables de colección: `{{baseUrl}}` = `http://localhost:3000/api`
- Variable `{{token}}` para endpoints privados
- Carpetas organizadas: Autenticación, Tareas, Usuario
- Tests básicos de status code en cada request
- Body examples en cada POST/PUT/PATCH

**Estructura esperada:**

```json
{
  "info": {
    "name": "Procrastinant API",
    "description": "API REST para aplicación de gestión de tareas",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Autenticación",
      "item": [
        {
          "name": "Registro",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nombre\": \"María Cecilia\",\n  \"apellido\": \"Luna\",\n  \"alias\": \"mcecilialuna\",\n  \"email\": \"maria@example.com\",\n  \"password\": \"Password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        // ... más endpoints
      ]
    },
    // ... más carpetas
  ]
}
```

**Incluir todos los endpoints con:**
- Headers apropiados (Authorization para privados)
- Body examples completos
- Tests de status code

---

## Documentación - README.md

### Actualizar README con nueva sección

**Agregar después de la sección existente:**

## API Endpoints

### Resumen

La API cuenta con 15 endpoints organizados en 3 categorías:

- **Autenticación** (3 endpoints)
- **Tareas** (6 endpoints)
- **Usuario** (5 endpoints)
- **Adicional** (1 endpoint - health check)

### Base URL

```
http://localhost:3000/api
```

### Autenticación

Todos los endpoints privados requieren un token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

### Endpoints Disponibles

#### Autenticación (`/api/auth`)

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Público | Registrar nuevo usuario |
| POST | `/auth/login` | Público | Iniciar sesión |
| POST | `/auth/logout` | Privado | Cerrar sesión |

#### Tareas (`/api/tareas`)

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/tareas` | Privado | Obtener todas las tareas |
| POST | `/tareas` | Privado | Crear nueva tarea |
| PUT | `/tareas/:id` | Privado | Actualizar tarea |
| PATCH | `/tareas/:id/toggle` | Privado | Cambiar estado de tarea |
| DELETE | `/tareas/:id` | Privado | Eliminar tarea |
| POST | `/tareas/reorder` | Privado | Reordenar tareas |

#### Usuario (`/api/user`)

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/user/profile` | Privado | Obtener perfil |
| GET | `/user/verify` | Privado | Verificar autenticación |
| PUT | `/user/profile` | Privado | Actualizar perfil |
| PUT | `/user/password` | Privado | Cambiar contraseña |
| DELETE | `/user/account` | Privado | Eliminar cuenta |

### Estructura de Respuestas

#### Respuesta de Éxito

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {
    // Datos de respuesta
  }
}
```

#### Respuesta de Error

```json
{
  "success": false,
  "message": "Mensaje de error",
  "errors": [
    {
      "field": "campo",
      "message": "mensaje de error específico"
    }
  ]
}
```

### Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Error de validación |
| 401 | Unauthorized | No autenticado o token inválido |
| 403 | Forbidden | Sin permisos para el recurso |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

### Testing con Postman

Una colección completa de Postman está disponible en `postman/Procrastinant-API.postman_collection.json`.

**Para usarla:**

1. Abrir Postman
2. Importar la colección
3. Configurar variables de entorno si es necesario
4. Ejecutar requests en orden:
   - Primero: Registro o Login para obtener token
   - Copiar el token de la respuesta
   - Pegar en variable `{{token}}` de la colección
   - Ejecutar endpoints privados

### Conexión a Base de Datos

El backend se conecta a MongoDB usando Mongoose.

**Configuración:**
- URL: `mongodb://localhost:27017/procrastinant-app-BE`
- Al iniciar, se muestra mensaje de conexión exitosa o error

**Verificar conexión:**
- Abrir MongoDB Compass
- Conectar a `mongodb://localhost:27017`
- Verificar que existe la base de datos `procrastinant-app-BE`

### Desarrollo

**Comandos útiles:**

```bash
# Iniciar servidor en modo desarrollo
npm run dev

# Verificar sintaxis con ESLint
npm run lint

# Ver logs en tiempo real
# (morgan ya está configurado)
```

### Variables de Entorno Requeridas

Asegúrate de configurar todas las variables en `.env`:

- `PORT`: Puerto del servidor (default: 3000)
- `MONGODB_URI`: URI de conexión a MongoDB
- `JWT_SECRET`: Secreto para firmar tokens JWT
- `JWT_EXPIRES_IN`: Tiempo de expiración de tokens (ej: 7d)
- `BCRYPT_SALT_ROUNDS`: Rounds para bcrypt (recomendado: 10)
- `ALLOWED_ORIGINS`: Orígenes permitidos para CORS
- `NODE_ENV`: Entorno de ejecución (development/production)

### Seguridad

La API implementa las siguientes medidas de seguridad:

- ✅ Autenticación con JWT
- ✅ Hash de contraseñas con bcrypt
- ✅ CORS configurado
- ✅ Rate limiting (100 requests / 15 minutos)
- ✅ Helmet para headers de seguridad
- ✅ Validación de datos de entrada
- ✅ Validación de pertenencia de recursos

### Documentación Completa

Para ver la especificación completa de la API, consultar el archivo `backend-routing-specification.md`.

---

## Entregables Esperados

1. **Comandos de instalación** para nuevas dependencias (Debian 12)
2. **Estructura de carpetas completa** con todos los archivos
3. **Modelos de Mongoose** completos y funcionales (User, Tarea)
4. **Conexión a MongoDB** funcional en `src/config/database.js`
5. **Sistema de rutas completo** con todos los endpoints
6. **Controladores** con estructura básica + TODOs para lógica específica
7. **Middlewares**:
   - Autenticación JWT (funcional)
   - Validación (funcional)
   - Manejo de errores centralizado (funcional)
8. **Validadores** completos para todos los endpoints (express-validator)
9. **Utilidades**:
   - JWT (generar, verificar)
   - Respuestas estandarizadas
10. **server.js actualizado** con toda la configuración
11. **Variables de entorno** actualizadas (.env y .env.example)
12. **Colección de Postman** completa con todos los endpoints
13. **README.md actualizado** con documentación de API

---

## Criterios de Validación

### ✅ El backend debe cumplir:

1. **Servidor inicia correctamente** sin errores
2. **Conexión a MongoDB exitosa** (mensaje en consola)
3. **Todos los 15 endpoints están definidos** en las rutas
4. **Middleware de autenticación funciona** (valida token JWT)
5. **Validaciones funcionan** (rechazan datos inválidos con 400)
6. **Manejo de errores centralizado** captura todos los errores
7. **CORS configurado** para `http://localhost:5173`
8. **Rate limiting activo** en `/api`
9. **Helmet configurado** para seguridad
10. **Morgan logea** todas las peticiones
11. **Colección de Postman** importa sin errores
12. **README actualizado** con toda la documentación

---

## Notas Importantes

### Sobre la Implementación

- **CommonJS**: Usar `require`/`module.exports` en todos los archivos
- **TODOs claros**: Marcar toda lógica específica pendiente con comentarios descriptivos
- **Código limpio**: Comentarios en español, nombres descriptivos
- **Estructura estándar**: Seguir exactamente la especificación del markdown adjunto

### Sobre MongoDB

- No instalar MongoDB en el proyecto (ya está en el sistema)
- Usar conexión local: `mongodb://localhost:27017`
- Nombre de DB: `procrastinant-app-BE`
- Verificar conexión antes de iniciar servidor

### Sobre JWT

- Nunca hardcodear el secret (usar variable de entorno)
- Token expira en 7 días por defecto
- El logout se maneja en el frontend (eliminar token de localStorage)
- No implementar blacklist de tokens

### Sobre Eliminación de Cuenta

- Eliminación física (no soft delete)
- Eliminar usuario Y todas sus tareas
- Devolver cantidad de tareas eliminadas en respuesta

### Sobre Postman

- Incluir todos los 15 endpoints
- Agregar tests básicos de status code
- Usar variables para baseUrl y token
- Organizar en carpetas lógicas

---

**Nota Final:** Seguir exactamente la especificación del documento markdown adjunto para estructura de endpoints, validaciones, códigos de estado y formatos de respuesta. Este prompt establece la infraestructura completa de la API REST.