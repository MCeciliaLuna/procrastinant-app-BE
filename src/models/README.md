# Carpeta de Modelos

Esta carpeta contendrá los modelos de datos en futuras implementaciones.

## ¿Qué es un Modelo?

Un modelo define la estructura de los datos en la base de datos.
Especifica qué campos tiene cada entidad, sus tipos de datos, validaciones y relaciones con otros modelos.

## Uso Futuro

Aquí se definirán modelos para:

### User.js (Modelo de Usuario)

Campos probables:

- `id` - Identificador único
- `email` - Correo electrónico (único)
- `password` - Contraseña encriptada
- `name` - Nombre/s del usuario
- `lastname` - Apellido/s del usuario
- `alias` - Apodo del usuario
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de última actualización

### Task.js (Modelo de Tarea)

Campos probables:

- `id` - Identificador único
- `description` - Descripción detallada
- `completed` - Estado de completado (booleano)
- `userId` - Referencia al usuario propietario
- `createdAt` - Fecha de creación
- `updatedAt` - Fecha de última actualización

Por ahora, esta carpeta permanece vacía hasta que se integre una base de datos y se definan estos modelos.
