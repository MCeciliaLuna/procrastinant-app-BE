# Procrastinant App - Backend

API REST para aplicación de gestión de tareas (to-do list) desarrollada con Node.js y Express.

## 📋 Descripción

Este es el servidor backend de Procrastinant App, una aplicación de gestión de tareas. Esta primera etapa establece la base del proyecto con un servidor Express funcional, estructura de carpetas organizada y configuración lista para futuras implementaciones.

## 🚀 Tecnologías Utilizadas

- **Node.js** v24.12.0 LTS ('Krypton')
- **Express.js** - Framework web para Node.js
- **CORS** - Manejo de peticiones cross-origin
- **dotenv** - Gestión de variables de entorno
- **bcrypt** - Encriptación de contraseñas (para futuras implementaciones)
- **nodemon** - Auto-reinicio del servidor en desarrollo
- **ESLint** - Linter de código JavaScript

## 📦 Requisitos Previos

- **Node.js** v24.12.0 o superior
- **npm** (incluido con Node.js)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/MCeciliaLuna/procrastinant-app-BE.git
cd procrastinant-app-BE
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo con tus valores:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las variables:

```env
# Server Configuration
PORT=3000

# Database Configuration (para futuras implementaciones)
DB_HOST=

# Environment
NODE_ENV=development
```

## ⚙️ Configuración

### Variables de Entorno

- **PORT**: Puerto donde correrá el servidor (por defecto: 3000)
- **DB_HOST**: Host de la base de datos (vacío por ahora, para futuras implementaciones)
- **NODE_ENV**: Entorno de ejecución (`development` o `production`)

## ▶️ Ejecución

### Modo Desarrollo (con auto-reinicio)

```bash
npm run dev
```

El servidor se reiniciará automáticamente cada vez que guardes cambios en los archivos.

### Modo Producción

```bash
npm start
```

El servidor se ejecutará con Node.js sin auto-reinicio.

## 📁 Estructura del Proyecto

```
procrastinant-app-BE/
├── src/
│   ├── config/           # Configuraciones del servidor (futuro)
│   ├── routes/           # Definición de rutas HTTP (futuro)
│   ├── controllers/      # Lógica de negocio (futuro)
│   ├── models/           # Modelos de datos (futuro)
│   └── middlewares/      # Middlewares personalizados (futuro)
├── node_modules/         # Dependencias instaladas
├── .env                  # Variables de entorno (no se sube a Git)
├── .env.example          # Plantilla de variables de entorno
├── .gitignore            # Archivos ignorados por Git
├── .eslintrc.js          # Configuración de ESLint
├── server.js             # Archivo principal del servidor ⭐
├── package.json          # Configuración y dependencias del proyecto
├── package-lock.json     # Lock de versiones de dependencias
└── README.md             # Este archivo
```

### Descripción de Carpetas

- **`src/config/`**: Configuraciones del servidor (base de datos, JWT, etc.) - Para futuras implementaciones
- **`src/routes/`**: Definición de endpoints de la API - Para futuras implementaciones
- **`src/controllers/`**: Lógica de negocio de cada ruta - Para futuras implementaciones
- **`src/models/`**: Esquemas y modelos de la base de datos - Para futuras implementaciones
- **`src/middlewares/`**: Middlewares personalizados (autenticación, validación, etc.) - Para futuras implementaciones

## 🌐 API Endpoints

### Ruta de Bienvenida

```
GET /
```

**Respuesta:**

```json
{
  "message": "Bienvenido a la DB de Procrastinant App!"
}
```

> **Nota:** Los endpoints completos de la API (autenticación, tareas, usuarios) se implementarán en etapas posteriores.

## ✅ Verificación del Servidor

Para verificar que el servidor funciona correctamente, puedes usar cualquiera de estos métodos:

### Opción 1: Navegador Web

1. Inicia el servidor con `npm run dev`
2. Abre tu navegador en `http://localhost:3000`
3. Deberías ver el mensaje de bienvenida en formato JSON

### Opción 2: cURL (Terminal)

```bash
curl http://localhost:3000
```

**Respuesta esperada:**

```json
{ "message": "Bienvenido a la DB de Procrastinant App!" }
```

### Opción 3: Postman

1. Abre Postman
2. Crea una nueva petición GET
3. URL: `http://localhost:3000`
4. Haz clic en "Send"
5. Verifica que recibes la respuesta JSON con el mensaje de bienvenida

## 📝 Scripts Disponibles

| Script     | Comando       | Descripción                                                        |
| ---------- | ------------- | ------------------------------------------------------------------ |
| Desarrollo | `npm run dev` | Ejecuta el servidor con nodemon (auto-reinicio al guardar cambios) |
| Producción | `npm start`   | Ejecuta el servidor con Node.js                                    |
| Test       | `npm test`    | Ejecuta tests (pendiente de implementación)                        |

## 🔒 Configuración de CORS

El servidor está configurado para aceptar peticiones desde:

- **Origen permitido**: `http://localhost:5173` (frontend de Vite en desarrollo)
- **Métodos HTTP**: GET, POST, PUT, DELETE, PATCH
- **Headers permitidos**: Content-Type, Authorization
- **Credenciales**: Habilitadas

> **Nota**: En producción, será necesario actualizar la configuración de CORS para permitir el dominio de tu frontend desplegado.

## 🗺️ Próximos Pasos

Futuras implementaciones planeadas:

- [ ] Implementar rutas de autenticación (registro, login, recuperación de contraseña)
- [ ] Implementar rutas de tareas (CRUD completo)
- [ ] Implementar rutas de usuario (perfil, configuración)
- [ ] Integrar base de datos (MongoDB o PostgreSQL)
- [ ] Implementar autenticación con JWT
- [ ] Implementar validación de datos con bibliotecas como Joi o express-validator
- [ ] Agregar tests unitarios e integración
- [ ] Implementar manejo centralizado de errores
- [ ] Agregar logging con Winston o Morgan
- [ ] Documentación de API con Swagger

## 🤝 Contribución

Si deseas contribuir a este proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commitea tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**Desarrollado por:** MCeciliaLuna  
**Repositorio:** [https://github.com/MCeciliaLuna/procrastinant-app-BE](https://github.com/MCeciliaLuna/procrastinant-app-BE)

---

## 📚 Documentación de la API

### Resumen de Endpoints

La API cuenta con **15 endpoints** organizados en 3 categorías:

| Categoría         | Cantidad | Descripción                                                      |
| ----------------- | -------- | ---------------------------------------------------------------- |
| **Autenticación** | 3        | Login, registro, logout                                          |
| **Tareas**        | 6        | CRUD completo + reordenamiento + toggle estado                   |
| **Usuario**       | 5        | Perfil, actualización, cambio contraseña, verificación, eliminación |
| **Health**        | 1        | Health check de la API                                           |

### Base URL

```
http://localhost:3000/api
```

### Autenticación

Todos los endpoints privados requieren un token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene al hacer login o registro y tiene una duración de 7 días por defecto.

---

### 🔐 Endpoints de Autenticación (`/api/auth`)

| Método | Endpoint          | Acceso  | Descripción              |
| ------ | ----------------- | ------- | ------------------------ |
| POST   | `/auth/register`  | Público | Registrar nuevo usuario  |
| POST   | `/auth/login`     | Público | Iniciar sesión           |
| POST   | `/auth/logout`    | Privado | Cerrar sesión            |

#### Ejemplo: Registro

**Request:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "María Cecilia",
  "apellido": "Luna",
  "alias": "mcecilialuna",
  "email": "maria@example.com",
  "password": "Password123"
}
```

**Response (201 Created):**
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

---

### ✅ Endpoints de Tareas (`/api/tareas`)

**Todos los endpoints son privados** (requieren autenticación)

| Método | Endpoint              | Descripción                    |
| ------ | --------------------- | ------------------------------ |
| GET    | `/tareas`             | Obtener todas las tareas       |
| POST   | `/tareas`             | Crear nueva tarea              |
| PUT    | `/tareas/:id`         | Actualizar tarea               |
| PATCH  | `/tareas/:id/toggle`  | Cambiar estado (listo)         |
| DELETE | `/tareas/:id`         | Eliminar tarea                 |
| POST   | `/tareas/reorder`     | Reordenar tareas               |

#### Query Parameters (GET /tareas)

- `page`: Número de página (default: 1)
- `limit`: Tareas por página (default: 50)
- `listo`: Filtrar por estado (true/false)
- `sort`: Campo para ordenar (numeroOrden, createdAt, descripcion)
- `order`: Dirección (asc, desc)

#### Ejemplo: Crear Tarea

**Request:**
```bash
POST /api/tareas
Authorization: Bearer <token>
Content-Type: application/json

{
  "descripcion": "Terminar proyecto de React",
  "listo": false,
  "numeroOrden": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": {
    "tarea": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "descripcion": "Terminar proyecto de React",
      "listo": false,
      "numeroOrden": 1,
      "createdAt": "2025-12-31T20:45:00.000Z",
      "updatedAt": "2025-12-31T20:45:00.000Z"
    }
  }
}
```

---

### 👤 Endpoints de Usuario (`/api/user`)

**Todos los endpoints son privados** (requieren autenticación)

| Método | Endpoint           | Descripción                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/user/profile`    | Obtener perfil              |
| GET    | `/user/verify`     | Verificar autenticación     |
| PUT    | `/user/profile`    | Actualizar perfil           |
| PUT    | `/user/password`   | Cambiar contraseña          |
| DELETE | `/user/account`    | Eliminar cuenta             |

#### Ejemplo: Actualizar Perfil

**Request:**
```bash
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "María Cecilia",
  "apellido": "Luna García",
  "alias": "mcluna"
}
```

---

### 🏥 Health Check

| Método | Endpoint      | Acceso  | Descripción                |
| ------ | ------------- | ------- | -------------------------- |
| GET    | `/health`     | Público | Estado de la API           |

```bash
GET /api/health
```

---

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

---

### Códigos de Estado HTTP

| Código | Significado                 | Uso                                           |
| ------ | --------------------------- | --------------------------------------------- |
| 200    | OK                          | Operación exitosa                             |
| 201    | Created                     | Recurso creado exitosamente                   |
| 400    | Bad Request                 | Error de validación                           |
| 401    | Unauthorized                | No autenticado o token inválido               |
| 403    | Forbidden                   | Sin permisos para el recurso                  |
| 404    | Not Found                   | Recurso no encontrado                         |
| 429    | Too Many Requests           | Límite de peticiones excedido                 |
| 500    | Internal Server Error       | Error del servidor                            |

---

## 🧪 Testing con Postman

Una colección completa de Postman está disponible en `postman/Procrastinant-API.postman_collection.json`.

### Importar la Colección

1. Abre Postman
2. Click en "Import"
3. Selecciona el archivo `postman/Procrastinant-API.postman_collection.json`
4. La colección se importará con todos los endpoints organizados

### Usar la Colección

1. **Primero**: Ejecuta el endpoint de **Registro** o **Login**
2. El token se guardará automáticamente en la variable de colección `{{token}}`
3. Todos los endpoints privados usarán este token automáticamente
4. Si el token expira, simplemente vuelve a hacer login

### Variables de Colección

- `{{baseUrl}}`: `http://localhost:3000/api`
- `{{token}}`: Se establece automáticamente al hacer login/registro

---

## 🔧 Configuración Avanzada

### Variables de Entorno Requeridas

Asegúrate de configurar todas las variables en `.env`:

```env
# Server Configuration
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/procrastinant-app-BE
MONGODB_URI_TEST=mongodb://localhost:27017/procrastinant-app-BE-test

# JWT Configuration
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173

# Environment
NODE_ENV=development
```

### Conexión a MongoDB

El backend se conecta a MongoDB usando Mongoose:

- **URL**: `mongodb://localhost:27017/procrastinant-app-BE`
- Al iniciar el servidor, verás un mensaje de conexión exitosa o error
- Asegúrate de tener MongoDB instalado y corriendo localmente

**Verificar MongoDB:**

1. Abre MongoDB Compass
2. Conecta a `mongodb://localhost:27017`
3. Verifica que existe la base de datos `procrastinant-app-BE`

---

## 🔒 Seguridad

La API implementa las siguientes medidas de seguridad:

✅ Autenticación con JWT  
✅ Hash de contraseñas con bcrypt (salt rounds: 10)  
✅ CORS configurado  
✅ Rate limiting (100 requests / 15 minutos)  
✅ Helmet para headers de seguridad HTTP  
✅ Validación de datos de entrada con express-validator  
✅ Validación de pertenencia de recursos  
✅ Manejo centralizado de errores  

---

## 📊 Modelos de Datos

### Usuario

```javascript
{
  _id: ObjectId,
  nombre: String (2-50 caracteres),
  apellido: String (2-50 caracteres),
  alias: String (3-20 caracteres),
  email: String (único, lowercase),
  password: String (hasheado, nunca se devuelve),
  createdAt: Date,
  updatedAt: Date
}
```

### Tarea

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  descripcion: String (1-300 caracteres),
  listo: Boolean (default: false),
  numeroOrden: Number (>= 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Debugging y Logs

### Logs de Peticiones HTTP

Morgan está configurado para loggear todas las peticiones:

- **Desarrollo**: Formato `dev` (colorizado, conciso)
- **Producción**: Formato `combined` (Apache style)

### Logs de Errores

En desarrollo, los errores incluyen stack trace completo en la respuesta JSON.

---

## 📖 Documentación Completa

Para ver la especificación completa de la API con todos los detalles de validaciones, respuestas y casos de uso, consulta el archivo [`backend-routing-specification.md`](backend-routing-specification.md).

---
