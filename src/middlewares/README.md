# Carpeta de Middlewares

Esta carpeta contendrá middlewares personalizados en futuras implementaciones.

## ¿Qué es un Middleware?

Un middleware es una función que se ejecuta ANTES de que una petición llegue a su ruta final.
Puede modificar la petición, validar datos, verificar autenticación, manejar errores, etc.

## Uso Futuro

Aquí se crearán middlewares personalizados como:

### authMiddleware.js

- `verifyToken()` - Verificar que el usuario esté autenticado
- `isAdmin()` - Verificar permisos de administrador

### validationMiddleware.js

- `validateTaskInput()` - Validar datos al crear/actualizar tareas
- `validateUserInput()` - Validar datos de usuario
- `validateEmail()` - Validar formato de email

### errorMiddleware.js

- `errorHandler()` - Manejar errores de forma centralizada
- `notFound()` - Manejar rutas no encontradas (404)

### loggerMiddleware.js

- `requestLogger()` - Registrar información de cada petición

## Nota

Los middlewares básicos como `express.json()`, `express.urlencoded()` y `cors()`
ya están configurados en el archivo `server.js`. Esta carpeta es para middlewares
personalizados específicos de la aplicación.

Por ahora, esta carpeta permanece vacía hasta que se implementen estos middlewares.
