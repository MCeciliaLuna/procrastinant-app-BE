# Especificación de Enrutamiento - Backend API Procrastinant App

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis del Frontend Actual](#análisis-del-frontend-actual)
3. [Arquitectura Propuesta](#arquitectura-propuesta)
4. [Modelos de Datos](#modelos-de-datos)
5. [Especificación de Rutas](#especificación-de-rutas)
6. [Mejores Prácticas Implementadas](#mejores-prácticas-implementadas)
7. [Códigos de Estado HTTP](#códigos-de-estado-http)
8. [Seguridad y Autenticación](#seguridad-y-autenticación)
9. [Validaciones](#validaciones)
10. [Ejemplos de Implementación](#ejemplos-de-implementación)

---

## 📊 Resumen Ejecutivo

Este documento especifica el enrutamiento completo para el backend de **Procrastinant App**, una aplicación de gestión de tareas (to-do list). El backend se desarrollará con **Node.js** y **Express.js**, implementando una API REST siguiendo las mejores prácticas de la industria.

### Endpoints Totales: 15

| Categoría         | Cantidad | Descripción                                                              |
| ----------------- | -------- | ------------------------------------------------------------------------ |
| **Autenticación** | 3        | Login, registro, logout                                                  |
| **Tareas**        | 6        | CRUD completo + reordenamiento + toggle estado                           |
| **Usuarios**      | 6        | Perfil, actualización, cambio contraseña, verificación auth, eliminación |

---

## 🔍 Análisis del Frontend Actual

### Endpoints Esperados por el Frontend

Según el archivo [`constants.js`](file:///home/mcecilialuna/Escritorio/PROMPT-ENGINEERING/procrastinant-app/src/config/constants.js), el frontend ya tiene definidos estos endpoints:

```javascript
// Autenticación
/auth/login
/auth/register
/auth/logout

// Tareas
/tareas (GET, POST)
/tareas/:id (PUT, DELETE)
/tareas/reorder (POST)

// Usuario
/user/profile (GET, PUT)
/user/password (PUT)
/user/account (DELETE)
```

### Modelo de Usuario (authStore)

```javascript
{
  nombre: String,
  apellido: String,
  alias: String,
  email: String
}
```

### Modelo de Tarea (tareasStore)

```javascript
{
  id: Number/String,
  descripcion: String,
  listo: Boolean,
  numeroOrden: Number
}
```

> [!IMPORTANT]
> El frontend usa **autenticación por token JWT** (Bearer Token) según la configuración de Axios. Todos los endpoints privados deben validar este token.

---

## 🏗️ Arquitectura Propuesta

### Estructura de Directorios

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.routes.js      # Rutas de autenticación
│   │   ├── tareas.routes.js    # Rutas de tareas
│   │   ├── user.routes.js      # Rutas de usuario
│   │   └── index.js            # Agregador de rutas
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── tareas.controller.js
│   │   └── user.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js  # Verificación de JWT
│   │   ├── validate.middleware.js
│   │   └── errorHandler.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   └── Tarea.model.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── tarea.validator.js
│   │   └── user.validator.js
│   ├── utils/
│   │   ├── jwt.utils.js
│   │   └── response.utils.js
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   └── app.js
├── .env
├── .env.example
└── package.json
```

### Patrón de Diseño

- **MVC (Model-View-Controller)**: Separación de responsabilidades
- **Middleware Chain**: Para autenticación, validación y manejo de errores
- **RESTful API**: Uso apropiado de métodos HTTP y códigos de estado
- **Validación en capas**: Schema validation + business logic validation

---

## 📦 Modelos de Datos

### Usuario (User)

```javascript
{
  _id: ObjectId,                    // MongoDB ID (generado automáticamente)
  nombre: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 50
  },
  alias: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    // Hasheada con bcrypt (nunca se devuelve en respuestas)
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Tarea (Tarea)

```javascript
{
  _id: ObjectId,                    // MongoDB ID
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true                     // Para búsquedas rápidas
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 300
  },
  listo: {
    type: Boolean,
    default: false
  },
  numeroOrden: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

> [!NOTE] > **Relación**: Una tarea pertenece a un usuario (`userId`). Cada usuario puede tener múltiples tareas.

---

## 🛣️ Especificación de Rutas

### 1. Autenticación (`/api/auth`)

#### 1.1. Registro de Usuario

**Endpoint**: `POST /api/auth/register`

**Acceso**: Público

**Descripción**: Crea una nueva cuenta de usuario.

**Request Body**:

```json
{
  "nombre": "María Cecilia",
  "apellido": "Luna",
  "alias": "mcecilialuna",
  "email": "maria@example.com",
  "password": "Password123"
}
```

**Validaciones**:

- `nombre`: Requerido, solo letras, 2-50 caracteres
- `apellido`: Requerido, solo letras, 2-50 caracteres
- `alias`: Requerido, alfanumérico, 3-20 caracteres
- `email`: Requerido, formato email válido, único
- `password`: Requerido, mínimo 8 caracteres, al menos 1 mayúscula y 1 número

**Response Success** (201 Created):

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "María Cecilia",
      "apellido": "Luna",
      "alias": "mcecilialuna",
      "email": "maria@example.com",
      "createdAt": "2025-12-31T20:28:37.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Error en validación",
  "errors": [
    {
      "field": "email",
      "message": "El email ya está registrado"
    },
    {
      "field": "password",
      "message": "La contraseña no cumple con los requisitos mínimos de seguridad"
    }
  ]
}
```

---

#### 1.2. Inicio de Sesión

**Endpoint**: `POST /api/auth/login`

**Acceso**: Público

**Descripción**: Autentica a un usuario y devuelve un token JWT.

**Request Body**:

```json
{
  "email": "maria@example.com",
  "password": "Password123"
}
```

**Validaciones**:

- `email`: Requerido, formato email válido
- `password`: Requerido

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "María Cecilia",
      "apellido": "Luna",
      "alias": "mcecilialuna",
      "email": "maria@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error** (401 Unauthorized):

```json
{
  "success": false,
  "message": "Credenciales inválidas",
  "errors": [
    {
      "field": "email",
      "message": "Email o contraseña incorrectos"
    }
  ]
}
```

---

#### 1.3. Cerrar Sesión

**Endpoint**: `POST /api/auth/logout`

**Acceso**: Privado (requiere autenticación)

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Descripción**: Cierra la sesión del usuario (invalida token si se usa blacklist).

**Request Body**: Ninguno

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente",
  "data": null
}
```

> [!TIP] > **Implementación de Blacklist**: Considera implementar una blacklist de tokens (usando Redis) para invalidar tokens antes de su expiración natural. Alternativamente, el frontend puede simplemente eliminar el token del localStorage.

---

### 2. Tareas (`/api/tareas`)

Todas las rutas de tareas son **privadas** y requieren autenticación.

#### 2.1. Obtener Todas las Tareas

**Endpoint**: `GET /api/tareas`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters** (opcionales):

- `page`: Número de página (default: 1)
- `limit`: Tareas por página (default: 50)
- `listo`: Filtrar por estado (true/false)
- `sort`: Ordenar por campo (createdAt, numeroOrden, descripcion)
- `order`: Dirección del ordenamiento (asc, desc)

**Ejemplo**: `GET /api/tareas?listo=false&sort=numeroOrden&order=asc`

**Descripción**: Obtiene todas las tareas del usuario autenticado.

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Tareas obtenidas exitosamente",
  "data": {
    "tareas": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "userId": "507f1f77bcf86cd799439011",
        "descripcion": "Terminar proyecto de React",
        "listo": false,
        "numeroOrden": 1,
        "createdAt": "2025-12-31T20:00:00.000Z",
        "updatedAt": "2025-12-31T20:00:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "userId": "507f1f77bcf86cd799439011",
        "descripcion": "Revisar documentación de Express",
        "listo": true,
        "numeroOrden": 2,
        "createdAt": "2025-12-31T19:00:00.000Z",
        "updatedAt": "2025-12-31T20:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalTareas": 2,
      "limit": 50
    }
  }
}
```

---

#### 2.2. Crear Nueva Tarea

**Endpoint**: `POST /api/tareas`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:

```json
{
  "descripcion": "Aprender Node.js",
  "listo": false,
  "numeroOrden": 3
}
```

**Validaciones**:

- `descripcion`: Requerido, 1-500 caracteres
- `listo`: Opcional, booleano (default: false)
- `numeroOrden`: Requerido, número entero >= 0

**Response Success** (201 Created):

```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "tarea": {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "descripcion": "Aprender Node.js",
      "listo": false,
      "numeroOrden": 3,
      "createdAt": "2025-12-31T20:45:00.000Z",
      "updatedAt": "2025-12-31T20:45:00.000Z"
    }
  }
}
```

---

#### 2.3. Actualizar Tarea

**Endpoint**: `PUT /api/tareas/:id`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**URL Parameters**:

- `id`: ID de la tarea a actualizar

**Request Body** (todos los campos son opcionales):

```json
{
  "descripcion": "Aprender Node.js y Express",
  "numeroOrden": 1
}
```

**Validaciones**:

- Solo se pueden actualizar: `descripcion`, `numeroOrden`
- El usuario solo puede actualizar sus propias tareas
- Si se actualiza `descripcion`: 1-500 caracteres
- Si se actualiza `numeroOrden`: número entero >= 0

> [!WARNING] > **Campo `listo` protegido**: El campo `listo` NO debe actualizarse aquí. Use el endpoint específico `PATCH /api/tareas/:id/toggle` para cambiar el estado.

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Tarea actualizada exitosamente",
  "data": {
    "tarea": {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "descripcion": "Aprender Node.js y Express",
      "listo": false,
      "numeroOrden": 1,
      "createdAt": "2025-12-31T20:45:00.000Z",
      "updatedAt": "2025-12-31T20:50:00.000Z"
    }
  }
}
```

**Response Error** (404 Not Found):

```json
{
  "success": false,
  "message": "Tarea no encontrada",
  "errors": null
}
```

**Response Error** (403 Forbidden):

```json
{
  "success": false,
  "message": "No tienes permisos para modificar esta tarea",
  "errors": null
}
```

---

#### 2.4. Cambiar Estado de Tarea (Toggle)

**Endpoint**: `PATCH /api/tareas/:id/toggle`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**URL Parameters**:

- `id`: ID de la tarea

**Request Body** (opcional):

```json
{
  "listo": true
}
```

> [!TIP]
> Si no se envía `listo` en el body, el endpoint alterna automáticamente el estado actual (toggle). Si se envía, establece el valor específico.

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Estado de tarea actualizado",
  "data": {
    "tarea": {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "descripcion": "Aprender Node.js y Express",
      "listo": true,
      "numeroOrden": 1,
      "createdAt": "2025-12-31T20:45:00.000Z",
      "updatedAt": "2025-12-31T21:00:00.000Z"
    }
  }
}
```

---

#### 2.5. Eliminar Tarea

**Endpoint**: `DELETE /api/tareas/:id`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**URL Parameters**:

- `id`: ID de la tarea a eliminar

**Validaciones**:

- El usuario solo puede eliminar sus propias tareas

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Tarea eliminada exitosamente",
  "data": {
    "tareaId": "507f1f77bcf86cd799439014"
  }
}
```

**Response Error** (404 Not Found):

```json
{
  "success": false,
  "message": "Tarea no encontrada",
  "errors": null
}
```

---

#### 2.6. Reordenar Tareas

**Endpoint**: `POST /api/tareas/reorder`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Descripción**: Actualiza el `numeroOrden` de múltiples tareas en una sola operación.

**Request Body**:

```json
{
  "orden": [
    { "tareaId": "507f1f77bcf86cd799439012", "numeroOrden": 2 },
    { "tareaId": "507f1f77bcf86cd799439013", "numeroOrden": 1 },
    { "tareaId": "507f1f77bcf86cd799439014", "numeroOrden": 3 }
  ]
}
```

**Validaciones**:

- `orden`: Array requerido, mínimo 1 elemento
- Cada elemento debe tener `tareaId` y `numeroOrden`
- Solo se pueden reordenar tareas del usuario autenticado

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Tareas reordenadas exitosamente",
  "data": {
    "tareasActualizadas": 3,
    "tareas": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "numeroOrden": 1,
        "descripcion": "Revisar documentación de Express"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "numeroOrden": 2,
        "descripcion": "Terminar proyecto de React"
      },
      {
        "_id": "507f1f77bcf86cd799439014",
        "numeroOrden": 3,
        "descripcion": "Aprender Node.js y Express"
      }
    ]
  }
}
```

---

### 3. Usuario (`/api/user`)

Todas las rutas de usuario son **privadas** y requieren autenticación.

#### 3.1. Obtener Perfil

**Endpoint**: `GET /api/user/profile`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Descripción**: Obtiene la información del perfil del usuario autenticado.

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "María Cecilia",
      "apellido": "Luna",
      "alias": "mcecilialuna",
      "email": "maria@example.com",
      "createdAt": "2025-12-31T20:28:37.000Z",
      "updatedAt": "2025-12-31T20:28:37.000Z"
    }
  }
}
```

> [!NOTE]
> La contraseña NUNCA se incluye en las respuestas.

---

#### 3.2. Verificar Autenticación

**Endpoint**: `GET /api/user/verify`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Descripción**: Verifica si el token JWT es válido y el usuario está autenticado.

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Usuario autenticado",
  "data": {
    "isAuthenticated": true,
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "María Cecilia",
      "apellido": "Luna",
      "alias": "mcecilialuna",
      "email": "maria@example.com"
    }
  }
}
```

**Response Error** (401 Unauthorized):

```json
{
  "success": false,
  "message": "Token inválido o expirado",
  "errors": null
}
```

---

#### 3.3. Actualizar Perfil

**Endpoint**: `PUT /api/user/profile`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body** (todos los campos son opcionales):

```json
{
  "nombre": "María Cecilia",
  "apellido": "Luna García",
  "alias": "mcluna",
  "email": "maria.luna@example.com"
}
```

**Validaciones**:

- `nombre`: Si se proporciona, solo letras, 2-50 caracteres
- `apellido`: Si se proporciona, solo letras, 2-50 caracteres
- `alias`: Si se proporciona, alfanumérico, 3-20 caracteres
- `email`: Si se proporciona, formato email válido, único

> [!WARNING] > **Campo único**: Si se intenta actualizar `email` con un valor ya existente, devolver error 400.

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "María Cecilia",
      "apellido": "Luna García",
      "alias": "mcluna",
      "email": "maria.luna@example.com",
      "createdAt": "2025-12-31T20:28:37.000Z",
      "updatedAt": "2025-12-31T21:15:00.000Z"
    }
  }
}
```

**Response Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Error en validación",
  "errors": [
    {
      "field": "email",
      "message": "El email ya está en uso"
    }
  ]
}
```

---

#### 3.4. Cambiar Contraseña

**Endpoint**: `PUT /api/user/password`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:

```json
{
  "passwordActual": "Password123",
  "passwordNueva": "NewPassword456"
}
```

**Validaciones**:

- `passwordActual`: Requerido, debe coincidir con la contraseña actual
- `passwordNueva`: Requerido, mínimo 8 caracteres, al menos 1 mayúscula y 1 número
- `passwordNueva` debe ser diferente de `passwordActual`

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente",
  "data": null
}
```

**Response Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Error en validación",
  "errors": [
    {
      "field": "passwordActual",
      "message": "La contraseña actual es incorrecta"
    }
  ]
}
```

---

#### 3.5. Eliminar Cuenta

**Endpoint**: `DELETE /api/user/account`

**Acceso**: Privado

**Headers**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body** (opcional, para confirmación):

```json
{
  "password": "Password123",
  "confirmacion": "ELIMINAR"
}
```

> [!CAUTION] > **Operación irreversible**: La eliminación de cuenta debe:
>
> 1. Eliminar el usuario de la base de datos
> 2. Eliminar TODAS las tareas asociadas al usuario
> 3. Invalidar el token (si se usa blacklist)
>
> Considera implementar "soft delete" (marcar como eliminado sin borrar) para permitir recuperación.

**Response Success** (200 OK):

```json
{
  "success": true,
  "message": "Cuenta eliminada exitosamente",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "tareasEliminadas": 15
  }
}
```

**Response Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Contraseña incorrecta o confirmación inválida",
  "errors": null
}
```

---

## ✅ Mejores Prácticas Implementadas

### 1. Estructura RESTful

| Acción                     | Método HTTP | Endpoint                 | Idempotente |
| -------------------------- | ----------- | ------------------------ | ----------- |
| Listar recursos            | GET         | `/api/tareas`            | ✅          |
| Crear recurso              | POST        | `/api/tareas`            | ❌          |
| Obtener recurso específico | GET         | `/api/tareas/:id`        | ✅          |
| Actualizar completo        | PUT         | `/api/tareas/:id`        | ✅          |
| Actualizar parcial         | PATCH       | `/api/tareas/:id/toggle` | ✅          |
| Eliminar recurso           | DELETE      | `/api/tareas/:id`        | ✅          |

### 2. Versionado de API

```javascript
// Prefijo base para todas las rutas
app.use("/api", routes);

// Preparado para futuras versiones
// app.use('/api/v2', routesV2);
```

### 3. Nomenclatura Consistente

- **URLs en minúsculas**: `/api/user/profile` (no `/api/User/Profile`)
- **Plurales para colecciones**: `/api/tareas` (no `/api/tarea`)
- **Sustantivos, no verbos**: `/api/tareas` (no `/api/obtenerTareas`)
- **Guiones para palabras compuestas**: `/cambiar-password` o **camelCase** en español

### 4. Respuestas Estandarizadas

```javascript
// Success Response
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { /* datos */ }
}

// Error Response
{
  "success": false,
  "message": "Mensaje de error",
  "errors": [
    { "field": "email", "message": "Email inválido" }
  ]
}
```

### 5. Seguridad

- ✅ **Autenticación JWT**: Token Bearer en headers
- ✅ **Hash de contraseñas**: bcrypt con salt rounds >= 10
- ✅ **Validación de pertenencia**: Usuario solo accede a sus recursos
- ✅ **CORS configurado**: Solo orígenes permitidos
- ✅ **Rate limiting**: Protección contra ataques de fuerza bruta
- ✅ **Helmet.js**: Headers de seguridad HTTP
- ✅ **Input sanitization**: Prevención de inyección SQL/NoSQL

### 6. Manejo de Errores

```javascript
// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
```

### 7. Logging

```javascript
// Morgan para logging de requests
app.use(morgan("combined"));

// Winston para logs de aplicación
logger.info("Usuario registrado", { userId: user._id });
logger.error("Error en base de datos", { error: err.message });
```

---

## 🎯 Códigos de Estado HTTP

### Códigos de Éxito (2xx)

| Código             | Significado         | Cuándo usar                          |
| ------------------ | ------------------- | ------------------------------------ |
| **200 OK**         | Éxito               | GET, PUT, PATCH, DELETE exitosos     |
| **201 Created**    | Recurso creado      | POST exitoso (registro, crear tarea) |
| **204 No Content** | Éxito sin contenido | DELETE sin contenido de respuesta    |

### Códigos de Error del Cliente (4xx)

| Código                       | Significado           | Cuándo usar                                       |
| ---------------------------- | --------------------- | ------------------------------------------------- |
| **400 Bad Request**          | Petición inválida     | Validación fallida, datos incorrectos             |
| **401 Unauthorized**         | No autenticado        | Token ausente, inválido o expirado                |
| **403 Forbidden**            | Sin permisos          | Usuario autenticado pero sin acceso al recurso    |
| **404 Not Found**            | Recurso no encontrado | Tarea o usuario no existe                         |
| **409 Conflict**             | Conflicto             | Email ya existe (duplicado)                       |
| **422 Unprocessable Entity** | Validación semántica  | Request bien formado pero inválido semánticamente |
| **429 Too Many Requests**    | Rate limit excedido   | Demasiadas peticiones en poco tiempo              |

### Códigos de Error del Servidor (5xx)

| Código                        | Significado            | Cuándo usar                                  |
| ----------------------------- | ---------------------- | -------------------------------------------- |
| **500 Internal Server Error** | Error del servidor     | Error no manejado, problema de base de datos |
| **503 Service Unavailable**   | Servicio no disponible | Servidor en mantenimiento                    |

---

## 🔐 Seguridad y Autenticación

### Flujo de Autenticación JWT

```mermaid
sequenceDiagram
    participant C as Cliente
    participant S as Servidor
    participant DB as Base de Datos

    C->>S: POST /api/auth/login (email, password)
    S->>DB: Buscar usuario por email
    DB-->>S: Usuario encontrado
    S->>S: Verificar password (bcrypt.compare)
    S->>S: Generar JWT token
    S-->>C: 200 OK { user, token }

    Note over C: Guardar token en localStorage

    C->>S: GET /api/tareas (Header: Bearer token)
    S->>S: Verificar token (jwt.verify)
    S->>S: Extraer userId del token
    S->>DB: Buscar tareas del usuario
    DB-->>S: Tareas encontradas
    S-->>C: 200 OK { tareas }
```

### Middleware de Autenticación

```javascript
// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    // 1. Extraer token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado",
        errors: null,
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Agregar userId al request
    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
        errors: null,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Token inválido",
      errors: null,
    });
  }
};
```

### Generación de Token JWT

```javascript
// utils/jwt.utils.js
import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const payload = {
    userId,
    iat: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
```

### Variables de Entorno

```bash
# .env.example
PORT=3000
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://localhost:27017/procrastinant-app
MONGODB_URI_TEST=mongodb://localhost:27017/procrastinant-app-test

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Bcrypt
BCRYPT_SALT_ROUNDS=10
```

---

## ✔️ Validaciones

### Validación con Express Validator

```javascript
// validators/tarea.validator.js
import { body, param } from "express-validator";
import { validarResultados } from "../middlewares/validate.middleware.js";

export const validarCrearTarea = [
  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es requerida")
    .isLength({ min: 1, max: 500 })
    .withMessage("La descripción debe tener entre 1 y 500 caracteres"),

  body("listo")
    .optional()
    .isBoolean()
    .withMessage("Listo debe ser un valor booleano"),

  body("numeroOrden")
    .notEmpty()
    .withMessage("El número de orden es requerido")
    .isInt({ min: 0 })
    .withMessage("El número de orden debe ser un entero mayor o igual a 0"),

  validarResultados,
];

export const validarActualizarTarea = [
  param("id").isMongoId().withMessage("ID de tarea inválido"),

  body("descripcion")
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("La descripción debe tener entre 1 y 500 caracteres"),

  body("numeroOrden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El número de orden debe ser un entero mayor o igual a 0"),

  validarResultados,
];
```

### Middleware de Validación

```javascript
// middlewares/validate.middleware.js
import { validationResult } from "express-validator";

export const validarResultados = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Error en validación",
      errors: formattedErrors,
    });
  }

  next();
};
```

---

## 💻 Ejemplos de Implementación

### Ejemplo 1: Router de Tareas

```javascript
// routes/tareas.routes.js
import express from "express";
import * as tareasController from "../controllers/tareas.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  validarCrearTarea,
  validarActualizarTarea,
  validarEliminarTarea,
  validarToggleTarea,
  validarReordenar,
} from "../validators/tarea.validator.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// GET /api/tareas - Obtener todas las tareas
router.get("/", tareasController.obtenerTareas);

// POST /api/tareas - Crear nueva tarea
router.post("/", validarCrearTarea, tareasController.crearTarea);

// PUT /api/tareas/:id - Actualizar tarea
router.put("/:id", validarActualizarTarea, tareasController.actualizarTarea);

// PATCH /api/tareas/:id/toggle - Toggle estado de tarea
router.patch("/:id/toggle", validarToggleTarea, tareasController.toggleTarea);

// DELETE /api/tareas/:id - Eliminar tarea
router.delete("/:id", validarEliminarTarea, tareasController.eliminarTarea);

// POST /api/tareas/reorder - Reordenar tareas
router.post("/reorder", validarReordenar, tareasController.reordenarTareas);

export default router;
```

### Ejemplo 2: Controlador de Tareas

```javascript
// controllers/tareas.controller.js
import Tarea from "../models/Tarea.model.js";

export const obtenerTareas = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      page = 1,
      limit = 50,
      listo,
      sort = "numeroOrden",
      order = "asc",
    } = req.query;

    // Construir filtro
    const filter = { userId };
    if (listo !== undefined) {
      filter.listo = listo === "true";
    }

    // Ordenamiento
    const sortOrder = order === "desc" ? -1 : 1;
    const sortOptions = { [sort]: sortOrder };

    // Paginación
    const skip = (page - 1) * limit;

    // Consulta
    const tareas = await Tarea.find(filter)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Tarea.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Tareas obtenidas exitosamente",
      data: {
        tareas,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTareas: total,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const crearTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { descripcion, listo = false, numeroOrden } = req.body;

    const nuevaTarea = new Tarea({
      userId,
      descripcion,
      listo,
      numeroOrden,
    });

    await nuevaTarea.save();

    res.status(201).json({
      success: true,
      message: "Tarea creada exitosamente",
      data: {
        tarea: nuevaTarea,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const updates = req.body;

    // No permitir actualizar listo aquí
    delete updates.listo;
    delete updates.userId;

    const tarea = await Tarea.findOne({ _id: id, userId });

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
        errors: null,
      });
    }

    Object.assign(tarea, updates);
    tarea.updatedAt = Date.now();
    await tarea.save();

    res.status(200).json({
      success: true,
      message: "Tarea actualizada exitosamente",
      data: {
        tarea,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { listo } = req.body;

    const tarea = await Tarea.findOne({ _id: id, userId });

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
        errors: null,
      });
    }

    // Si listo viene en el body, usar ese valor; sino, toggle
    tarea.listo = listo !== undefined ? listo : !tarea.listo;
    tarea.updatedAt = Date.now();
    await tarea.save();

    res.status(200).json({
      success: true,
      message: "Estado de tarea actualizado",
      data: {
        tarea,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const eliminarTarea = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const tarea = await Tarea.findOneAndDelete({ _id: id, userId });

    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
        errors: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Tarea eliminada exitosamente",
      data: {
        tareaId: id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const reordenarTareas = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { orden } = req.body;

    // Actualizar en bulk
    const bulkOps = orden.map((item) => ({
      updateOne: {
        filter: { _id: item.tareaId, userId },
        update: {
          numeroOrden: item.numeroOrden,
          updatedAt: Date.now(),
        },
      },
    }));

    const result = await Tarea.bulkWrite(bulkOps);

    // Obtener tareas actualizadas
    const tareaIds = orden.map((item) => item.tareaId);
    const tareas = await Tarea.find({
      _id: { $in: tareaIds },
      userId,
    }).sort({ numeroOrden: 1 });

    res.status(200).json({
      success: true,
      message: "Tareas reordenadas exitosamente",
      data: {
        tareasActualizadas: result.modifiedCount,
        tareas,
      },
    });
  } catch (error) {
    next(error);
  }
};
```

### Ejemplo 3: Modelo de Tarea (Mongoose)

```javascript
// models/Tarea.model.js
import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
      minlength: [1, "La descripción debe tener al menos 1 carácter"],
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    },
    listo: {
      type: Boolean,
      default: false,
    },
    numeroOrden: {
      type: Number,
      required: [true, "El número de orden es requerido"],
      min: [0, "El número de orden debe ser mayor o igual a 0"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para búsquedas rápidas
tareaSchema.index({ userId: 1, numeroOrden: 1 });
tareaSchema.index({ userId: 1, listo: 1 });

// No devolver __v en las respuestas JSON
tareaSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Tarea", tareaSchema);
```

### Ejemplo 4: Agregador de Rutas

```javascript
// routes/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import tareasRoutes from "./tareas.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

// Rutas de tareas (requieren autenticación)
router.use("/tareas", tareasRoutes);

// Rutas de usuario (requieren autenticación)
router.use("/user", userRoutes);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando correctamente",
    data: {
      uptime: process.uptime(),
      timestamp: Date.now(),
    },
  });
});

export default router;
```

### Ejemplo 5: Configuración de Express

```javascript
// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

// Middlewares de seguridad
app.use(helmet());

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: {
    success: false,
    message: "Demasiadas peticiones, intenta de nuevo más tarde",
    errors: null,
  },
});

app.use("/api", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Rutas
app.use("/api", routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    errors: null,
  });
});

// Error handler
app.use(errorHandler);

export default app;
```

---

## 📊 Resumen de Endpoints

### Tabla Completa

| #   | Método | Endpoint                 | Autenticación | Descripción                           |
| --- | ------ | ------------------------ | ------------- | ------------------------------------- |
| 1   | POST   | `/api/auth/register`     | ❌ Público    | Registrar nuevo usuario               |
| 2   | POST   | `/api/auth/login`        | ❌ Público    | Iniciar sesión                        |
| 3   | POST   | `/api/auth/logout`       | ✅ Requerida  | Cerrar sesión                         |
| 4   | GET    | `/api/tareas`            | ✅ Requerida  | Obtener todas las tareas del usuario  |
| 5   | POST   | `/api/tareas`            | ✅ Requerida  | Crear nueva tarea                     |
| 6   | PUT    | `/api/tareas/:id`        | ✅ Requerida  | Actualizar tarea (descripción, orden) |
| 7   | PATCH  | `/api/tareas/:id/toggle` | ✅ Requerida  | Cambiar estado de tarea (listo)       |
| 8   | DELETE | `/api/tareas/:id`        | ✅ Requerida  | Eliminar tarea                        |
| 9   | POST   | `/api/tareas/reorder`    | ✅ Requerida  | Reordenar múltiples tareas            |
| 10  | GET    | `/api/user/profile`      | ✅ Requerida  | Obtener perfil del usuario            |
| 11  | GET    | `/api/user/verify`       | ✅ Requerida  | Verificar autenticación               |
| 12  | PUT    | `/api/user/profile`      | ✅ Requerida  | Actualizar datos del usuario          |
| 13  | PUT    | `/api/user/password`     | ✅ Requerida  | Cambiar contraseña                    |
| 14  | DELETE | `/api/user/account`      | ✅ Requerida  | Eliminar cuenta de usuario            |
| 15  | GET    | `/api/health`            | ❌ Público    | Health check de la API                |

---

## 🚀 Próximos Pasos

### Fase 1: Configuración Inicial

- [ ] Inicializar proyecto Node.js/Express
- [ ] Configurar variables de entorno
- [ ] Conectar a MongoDB
- [ ] Implementar estructura de carpetas

### Fase 2: Autenticación

- [ ] Crear modelo User
- [ ] Implementar hash de contraseñas con bcrypt
- [ ] Configurar JWT
- [ ] Crear rutas de autenticación
- [ ] Middleware de autenticación

### Fase 3: Tareas

- [ ] Crear modelo Tarea
- [ ] Implementar CRUD de tareas
- [ ] Endpoint de reordenamiento
- [ ] Toggle de estado

### Fase 4: Usuario

- [ ] Rutas de perfil
- [ ] Actualización de datos
- [ ] Cambio de contraseña
- [ ] Eliminación de cuenta

### Fase 5: Testing y Seguridad

- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Implementar rate limiting
- [ ] Auditoría de seguridad
- [ ] Documentación con Swagger/OpenAPI

---

## 📝 Notas Adicionales

### Recomendaciones

1. **Base de Datos**: MongoDB con Mongoose es ideal para este proyecto por su flexibilidad
2. **Testing**: Usar Jest + Supertest para tests de API
3. **Documentación**: Implementar Swagger UI para documentación interactiva
4. **Logging**: Winston o Pino para logs estructurados
5. **Monitoreo**: Considerar integración con Sentry para tracking de errores

### Mejoras Futuras

- **Paginación avanzada**: Cursor-based pagination para mejor performance
- **Búsqueda**: Implementar búsqueda full-text en tareas
- **Filtros avanzados**: Filtrar por fecha, prioridad, etiquetas
- **Websockets**: Actualización en tiempo real de tareas
- **Notificaciones**: Sistema de recordatorios
- **Compartir tareas**: Colaboración entre usuarios
- **Categorías/Etiquetas**: Organización avanzada de tareas

---

**Documento creado**: 31 de diciembre de 2025  
**Versión**: 1.0  
**Autor**: Auditoría del repositorio Procrastinant App
