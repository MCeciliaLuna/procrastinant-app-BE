# Prompt: Creación de Servidor Backend con Node.js y Express

## Contexto del Proyecto

Este prompt corresponde a la **primera etapa del backend: creación del servidor básico**. El frontend ya está desarrollado con React + Vite. Ahora necesito crear un servidor backend separado que sirva como base para futuras implementaciones.

**IMPORTANTE:** Esta etapa se enfoca **exclusivamente en**:
- Creación del servidor básico con Express
- Estructura de carpetas inicial
- Configuración de middlewares básicos
- Variables de entorno
- Mensaje de bienvenida en ruta raíz
- Documentación inicial

**NO incluir:**
- Rutas HTTP específicas (GET, POST, PUT, DELETE de recursos)
- Controladores con lógica de negocio
- Modelos de base de datos
- Integración con base de datos
- Autenticación/Autorización
- Validación de datos

---

## Objetivo

Necesito que me ayudes a crear un servidor backend con Node.js y Express desde cero, configurado con las mejores prácticas, estructura de carpetas organizada, middlewares básicos, variables de entorno, y completamente funcional para servir como base del proyecto.

---

## Especificaciones Técnicas

### Tecnologías y Versiones

**Node.js:**
- Versión: 24.12.0 LTS ('Krypton')
- Esta versión LTS recibirá soporte hasta abril de 2028
- Justificación: Versión LTS más reciente, estable y con soporte a largo plazo

**Framework:**
- Express.js (última versión estable)

**Type de módulos:**
- CommonJS (`require` / `module.exports`)

**Sistema operativo:**
- Debian 12

---

## Ubicación del Proyecto

- esta carpeta

---

## Estructura de Carpetas a Crear

```
procrastinant-app-BE/
├── src/
│   ├── config/           # Configuraciones (vacío por ahora)
│   ├── routes/           # Rutas (vacío por ahora - futura implementación)
│   ├── controllers/      # Controladores (vacío por ahora - futura implementación)
│   ├── models/           # Modelos (vacío por ahora - futura implementación)
│   └── middlewares/      # Middlewares personalizados (vacío por ahora)
├── node_modules/         # Dependencias (generado automáticamente)
├── .env                  # Variables de entorno (no commitear)
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore            # Archivos a ignorar en Git
├── .eslintrc.js          # Configuración de ESLint
├── server.js             # Archivo principal del servidor
├── package.json          # Configuración del proyecto y dependencias
├── package-lock.json     # Lock de dependencias
└── README.md             # Documentación del proyecto
```

---

## Dependencias a Instalar

### Dependencias de producción:
1. **express** - Framework web
2. **dotenv** - Manejo de variables de entorno
3. **cors** - Configuración de CORS
4. **bcrypt** - Encriptación de contraseñas (para futura implementación)

### Dependencias de desarrollo:
1. **nodemon** - Auto-reinicio del servidor en desarrollo
2. **eslint** - Linter de código

---

## Configuración de Variables de Entorno

### Archivo .env

Crear archivo `.env` con las siguientes variables:

```env
# Server Configuration
PORT=3000

# Database Configuration (vacío por ahora, para futura implementación)
DB_HOST=

# Environment
NODE_ENV=development
```

### Archivo .env.example

Crear archivo `.env.example` con las mismas variables pero sin valores:

```env
# Server Configuration
PORT=

# Database Configuration
DB_HOST=

# Environment
NODE_ENV=
```

---

## Configuración del Servidor (server.js)

### Requisitos del archivo principal:

**Estructura básica:**
```javascript
// Importar dependencias
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Configurar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173' })); // Vite dev server

// Ruta de bienvenida (raíz)
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la DB de Procrastinant App!' });
});

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

**Características requeridas:**
- Importar y configurar dotenv al inicio
- Crear instancia de Express
- Configurar middlewares: `express.json()` y `express.urlencoded()`
- Configurar CORS para permitir peticiones desde `http://localhost:5173` (Vite)
- Ruta GET en raíz `/` que responda con JSON: `{ message: "Bienvenido a la DB de Procrastinant App!" }`
- Puerto 3000 (desde variable de entorno)
- Mensaje en consola al iniciar servidor

---

## Scripts de package.json

Configurar los siguientes scripts en `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

**Descripción:**
- `npm run dev` - Ejecuta servidor con nodemon (auto-reinicio en desarrollo)
- `npm start` - Ejecuta servidor con node (para producción)
- `npm test` - Placeholder para tests futuros

---

## Configuración de CORS

**Configuración básica:**
- Permitir solicitudes solo desde `http://localhost:5173` (frontend en desarrollo)
- Métodos permitidos: GET, POST, PUT, DELETE, PATCH
- Headers permitidos: Content-Type, Authorization

**Implementación:**
```javascript
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
```

---

## Configuración de ESLint

Crear archivo `.eslintrc.js` con configuración básica:

```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
  },
};
```

---

## Archivo .gitignore

Crear archivo `.gitignore` con el siguiente contenido:

```
# Dependencies
node_modules/

# Environment variables
.env

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build
dist/
build/
```

---

## Documentación - README.md

Crear un README completo con las siguientes secciones:

### 1. Título y Descripción
- Nombre del proyecto: "Procrastinant App - Backend"
- Descripción breve: API REST para aplicación de gestión de tareas

### 2. Tecnologías Utilizadas
- Node.js 24.12.0 LTS ('Krypton')
- Express.js
- CORS
- dotenv
- bcrypt

### 3. Requisitos Previos
- Node.js 24.12.0 o superior
- npm (incluido con Node.js)

### 4. Instalación

Paso a paso:
```bash
# Clonar repositorio
git clone https://github.com/MCeciliaLuna/procrastinant-app-BE.git
cd procrastinant-app-BE

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

### 5. Configuración

Explicar cada variable de entorno:
- `PORT`: Puerto donde correrá el servidor (default: 3000)
- `DB_*`: Variables de conexión a base de datos (para futuras implementaciones)
- `NODE_ENV`: Entorno de ejecución (development, production)

### 6. Ejecución

```bash
# Modo desarrollo (con auto-reinicio)
npm run dev

# Modo producción
npm start
```

### 7. Estructura del Proyecto

Explicar la organización de carpetas:
- `src/config/` - Configuraciones del servidor
- `src/routes/` - Definición de rutas (futura implementación)
- `src/controllers/` - Lógica de negocio (futura implementación)
- `src/models/` - Modelos de datos (futura implementación)
- `src/middlewares/` - Middlewares personalizados (futura implementación)

### 8. API Endpoints

**Ruta de bienvenida:**
```
GET /
Respuesta: { "message": "Bienvenido a la DB de Procrastinant App!" }
```

**Nota:** Los endpoints de la API se implementarán en etapas posteriores.

### 9. Verificación del Servidor

Instrucciones para verificar que el servidor funciona correctamente:

**Opción 1 - Navegador:**
- Abrir `http://localhost:3000` en el navegador
- Debe mostrar el mensaje de bienvenida en formato JSON

**Opción 2 - cURL:**
```bash
curl http://localhost:3000
```

**Opción 3 - Postman:**
- Crear nueva petición GET
- URL: `http://localhost:3000`
- Enviar petición
- Verificar respuesta JSON

### 10. Próximos Pasos

Listar las siguientes etapas de desarrollo:
- [ ] Implementar rutas de autenticación (login, registro, recuperación)
- [ ] Implementar rutas de tareas (CRUD completo)
- [ ] Implementar rutas de usuario (perfil, configuración)
- [ ] Integrar base de datos (MongoDB/PostgreSQL)
- [ ] Implementar autenticación con JWT
- [ ] Implementar validación de datos
- [ ] Agregar tests unitarios e integración

### 11. Scripts Disponibles

Tabla con scripts y su descripción:
| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo | `npm run dev` | Ejecuta servidor con nodemon |
| Producción | `npm start` | Ejecuta servidor con node |
| Test | `npm test` | Ejecuta tests (pendiente) |

### 12. Configuración de CORS

Explicar que CORS está configurado para:
- Origen permitido: `http://localhost:5173` (frontend en desarrollo)
- Tener en cuenta que no hay difereniacion entre desarrollo y produccion

### 13. Contribución

Indicaciones básicas para contribuir (opcional)

### 14. Licencia

Tipo de licencia del proyecto (opcional)

---

## Entregables Esperados

1. **Comandos de instalación completos** para Debian 12:
   - Instalación de Node.js 24.12.0 LTS
   - Inicialización del proyecto npm
   - Instalación de todas las dependencias

2. **Estructura de carpetas completa** con todos los directorios

3. **Archivos de configuración:**
   - `server.js` completo y funcional
   - `.env` y `.env.example`
   - `.gitignore`
   - `.eslintrc.js`
   - `package.json` con scripts y dependencias

4. **README.md completo** con toda la documentación de esta etapa

5. **Instrucciones de verificación** detalladas usando:
   - Navegador web
   - cURL
   - Postman

---

## Validación del Servidor

### Criterios de éxito:

✅ El servidor inicia correctamente en el puerto 3000  
✅ Al acceder a `http://localhost:3000` responde con JSON: `{ "message": "Bienvenido a la DB de Procrastinant App!" }`  
✅ CORS está configurado y permite peticiones desde `http://localhost:5173`  
✅ Nodemon reinicia el servidor automáticamente al guardar cambios  
✅ ESLint no muestra errores en el código  
✅ Las variables de entorno se cargan correctamente  
✅ La estructura de carpetas está completa  
✅ El README es claro y completo  

---

## Consideraciones Importantes

### Lo que SÍ debe incluirse:
- Servidor Express completamente funcional
- Configuración de CORS para el frontend
- Variables de entorno configuradas
- Estructura de carpetas preparada para escalabilidad
- Middlewares básicos (json, urlencoded)
- ESLint configurado
- Documentación completa
- Scripts de desarrollo y producción

### Lo que NO debe incluirse:
- Rutas HTTP específicas de recursos (auth, tareas, user)
- Controladores con lógica de negocio
- Modelos de base de datos
- Conexión a base de datos
- Middleware de autenticación/autorización
- Validación de datos con bibliotecas externas
- Tests (se implementarán después)

### Notas adicionales:
- El código debe ser limpio y bien comentado
- Seguir convenciones de CommonJS (require/module.exports)
- Usar nombres descriptivos en español para comentarios
- La estructura debe ser escalable para futuros desarrollos
- Todas las carpetas vacías deben tener un comentario o archivo README indicando su propósito futuro

---

## Formato de Respuesta

Por favor proporciona:

1. **Comandos bash completos** para Debian 12:
   - Instalación de Node.js 24.12.0 LTS
   - Creación del proyecto
   - Instalación de dependencias

2. **Contenido de cada archivo:**
   - `server.js`
   - `.env` y `.env.example`
   - `.gitignore`
   - `.eslintrc.js`
   - `package.json`
   - `README.md`

3. **Instrucciones de verificación** detalladas usando Postman

4. **Estructura de carpetas** con explicación de cada directorio

---

**Nota Final:** Esta etapa establece los cimientos del backend. Las siguientes etapas implementarán rutas, controladores, modelos, integración con base de datos y toda la lógica de negocio necesaria para la aplicación de to-do list.