# Carpeta de Rutas

Esta carpeta contendrá la definición de rutas HTTP del servidor en futuras implementaciones.

## Uso Futuro

Aquí se definirán las rutas (endpoints) de la API:

### Rutas de Autenticación

- `POST /api/auth/register` - Registro de nuevos usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `POST /api/auth/forgot-password` - Recuperación de contraseña

### Rutas de Tareas

- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/:id` - Obtener una tarea específica
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea completa
- `PATCH /api/tasks/:id` - Actualizar campos específicos
- `DELETE /api/tasks/:id` - Eliminar tarea

### Rutas de Usuario

- `GET /api/users/profile` - Obtener perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil
- `DELETE /api/users/account` - Eliminar cuenta

Por ahora, esta carpeta permanece vacía hasta que se implementen estas rutas.
