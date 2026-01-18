# Procrastinant App - Backend

API REST para aplicación de gestión de tareas (to-do list) desarrollada con Node.js y Express.

## 📋 Descripción

Backend de Procrastinant App - una aplicación completa de gestión de tareas con autenticación de usuarios, CRUD de tareas y medidas de seguridad implementadas.

## 🚀 Tecnologías

- **Node.js** v24.12.0 LTS
- **Express.js** - Framework web
- **MongoDB & Mongoose** - Base de datos NoSQL
- **JWT** - Autenticación con tokens
- **bcrypt** - Encriptación de contraseñas
- **Jest & Supertest** - Testing

## 📦 Requisitos

- Node.js v18.0.0 o superior
- MongoDB 5.0 o superior

## 🔧 Instalación

```bash
# Clonar repositorio
git clone https://github.com/MCeciliaLuna/procrastinant-app-BE.git
cd procrastinant-app-BE

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

**Configurar `.env`:**

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/procrastinant-app-BE
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173
NODE_ENV=development
```

## ▶️ Ejecución

```bash
# Desarrollo (con auto-reinicio)
npm run dev

# Producción
npm start

# Tests
npm test
```

## 📁 Estructura del Proyecto

```
procrastinant-app-BE/
├── src/
│   ├── config/           # Configuración (DB, JWT)
│   ├── routes/           # Rutas de la API
│   ├── controllers/      # Lógica de negocio
│   ├── models/           # Modelos de datos
│   ├── middlewares/      # Autenticación y validación
│   └── __tests__/        # Tests unitarios e integración
├── server.js             # Punto de entrada
└── .env                  # Variables de entorno
```

## 🌐 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint         | Descripción    |
| ------ | ---------------- | -------------- |
| POST   | `/auth/register` | Registrarse    |
| POST   | `/auth/login`    | Iniciar sesión |
| POST   | `/auth/logout`   | Cerrar sesión  |

**Ejemplo - Registro:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "María",
  "apellido": "Luna",
  "alias": "mluna",
  "email": "maria@example.com",
  "password": "Password123"
}
```

### ✅ Tareas (`/api/tareas`) 🔒

Todos los endpoints requieren autenticación con token JWT.

| Método | Endpoint             | Descripción      |
| ------ | -------------------- | ---------------- |
| GET    | `/tareas`            | Listar tareas    |
| POST   | `/tareas`            | Crear tarea      |
| PUT    | `/tareas/:id`        | Actualizar tarea |
| PATCH  | `/tareas/:id/toggle` | Toggle estado    |
| DELETE | `/tareas/:id`        | Eliminar tarea   |

**Query params (GET):** `listo`, `sort`, `order`

**Ejemplo - Crear Tarea:**

```bash
POST /api/tareas
Authorization: Bearer <token>

{
  "descripcion": "Terminar proyecto",
  "listo": false
}
```

### 👤 Usuario (`/api/user`) 🔒

| Método | Endpoint         | Descripción        |
| ------ | ---------------- | ------------------ |
| GET    | `/user/profile`  | Ver perfil         |
| GET    | `/user/verify`   | Verificar token    |
| PUT    | `/user/profile`  | Actualizar perfil  |
| PUT    | `/user/password` | Cambiar contraseña |
| DELETE | `/user/account`  | Eliminar cuenta    |

### 🏥 Health Check

```bash
GET /api/health
```

## 📊 Modelos de Datos

**Usuario:**

```javascript
{
  nombre: String,
  apellido: String,
  alias: String,
  email: String (único),
  password: String (hasheado)
}
```

**Tarea:**

```javascript
{
  userId: ObjectId,
  descripcion: String,
  listo: Boolean
}
```

## 🔒 Seguridad

✅ JWT para autenticación  
✅ Contraseñas hasheadas con bcrypt  
✅ CORS configurado  
✅ Rate limiting (100 req/15min)  
✅ Validación de datos

## 🧪 Testing

**Cobertura:** ~60% (64 tests)

```bash
npm test                    # Todos los tests
npm test:coverage          # Con reporte de cobertura
npm test -- auth.integration.test  # Test específico
```

## 🧪 Postman

Importa la colección desde: `postman/Procrastinant-API.postman_collection.json`

Variables automáticas:

- `{{baseUrl}}`: http://localhost:3000/api
- `{{token}}`: Se configura al hacer login

## 📖 Documentación Adicional

Ver [`backend-routing-specification.md`](backend-routing-specification.md) para especificaciones detalladas.

---

**Desarrollado por:** MCeciliaLuna  
**Repositorio:** https://github.com/MCeciliaLuna/procrastinant-app-BE
