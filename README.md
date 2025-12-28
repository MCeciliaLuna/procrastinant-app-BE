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
