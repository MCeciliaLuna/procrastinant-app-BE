# Carpeta de Rutas

Esta carpeta contendrá la definición de rutas HTTP del servidor en futuras implementaciones.

## Uso Futuro

Aquí se definirán las rutas (endpoints) de la API:

### Rutas de Autenticación

- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión

### Rutas de Tareas

- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea completa
- `DELETE /api/tasks/:id` - Eliminar tarea

### Rutas de Usuario

- `GET /api/users/profile` - Obtener perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/change-password` - Cambiar contraseña
- `DELETE /api/users/account` - Eliminar cuenta

Por ahora, esta carpeta permanece vacía hasta que se implementen estas rutas.
