# Carpeta de Controladores

Esta carpeta contendrá los controladores con la lógica de negocio en futuras implementaciones.

## ¿Qué es un Controlador?

Un controlador es una función que maneja la lógica específica de una ruta.
Separa la definición de rutas de la lógica de negocio, haciendo el código más organizado y mantenible.

## Uso Futuro

Aquí se crearán controladores para:

### authController.js

- `register()` - Lógica para registrar nuevos usuarios
- `login()` - Lógica para autenticar usuarios
- `logout()` - Lógica para cerrar sesión
- `forgotPassword()` - Lógica para recuperar contraseña

### taskController.js

- `getAllTasks()` - Obtener todas las tareas del usuario
- `getTaskById()` - Obtener una tarea específica
- `createTask()` - Crear nueva tarea
- `updateTask()` - Actualizar tarea
- `deleteTask()` - Eliminar tarea

### userController.js

- `getProfile()` - Obtener perfil del usuario
- `updateProfile()` - Actualizar información del perfil
- `deleteAccount()` - Eliminar cuenta de usuario

Por ahora, esta carpeta permanece vacía hasta que se implementen estos controladores.
