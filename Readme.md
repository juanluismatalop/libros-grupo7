# Proyecto Libros Grupo E

### por Juan Luis Mata López, David Rico Chica y Alberto Ruiz Quiros

## Librería Judas Tadeo

Este proyecto es una aplicación web para gestionar una librería, permitiendo la administración de autores, libros y clientes. A continuación, se detalla la estructura del proyecto y la función de cada archivo.

---

## Estructura del Proyecto

### 1. **app.js**
Este es el archivo principal de la aplicación. Aquí se configuran las rutas, la conexión a la base de datos y los middleware de Express.

- **Conexión a MySQL**: Se establece una conexión a la base de datos MySQL utilizando el paquete `mysql2`.
- **Rutas**: Se definen las rutas para manejar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para autores, libros y clientes.
- **Middleware**: Se configuran sesiones y se establece el motor de plantillas Pug.

### 2. **views/**
Esta carpeta contiene las plantillas Pug que se utilizan para renderizar las diferentes páginas de la aplicación.

- **layout.pug**: Plantilla base que define la estructura HTML común para todas las páginas, incluyendo el encabezado y la navegación.
- **index.pug**: Página de inicio de la aplicación.
- **login.pug**: Página de inicio de sesión donde los usuarios pueden ingresar sus credenciales.
- **libro/**: Carpeta que contiene las vistas relacionadas con los libros:
  - **libro.pug**: Muestra la lista de libros y proporciona enlaces para agregar, editar o eliminar libros.
  - **libro-add.pug**: Formulario para agregar un nuevo libro.
  - **libro-edit.pug**: Formulario para editar un libro existente.
  - **libro-delete.pug**: Confirmación para eliminar un libro.
- **autor/**: Carpeta que contiene las vistas relacionadas con los autores:
  - **autor.pug**: Muestra la lista de autores y proporciona enlaces para agregar, editar o eliminar autores.
  - **autor-add.pug**: Formulario para agregar un nuevo autor.
  - **autor-edit.pug**: Formulario para editar un autor existente.
  - **autor-delete.pug**: Confirmación para eliminar un autor.
- **cliente/**: Carpeta que contiene las vistas relacionadas con los clientes:
  - **cliente.pug**: Muestra la lista de clientes y proporciona enlaces para agregar, editar o eliminar clientes.
  - **cliente-add.pug**: Formulario para agregar un nuevo cliente.
  - **cliente-edit.pug**: Formulario para editar un cliente existente.
  - **cliente-delete.pug**: Confirmación para eliminar un cliente.
- **venta/**: Carpeta que contiene las vistas relacionadas con las ventas:
  - **venta.pug**: Muestra la lista de ventas y proporciona enlaces para agregar o eliminar ventas.
  - **venta-add.pug**: Formulario para agregar una nueva venta.
  - **venta-delete.pug**: Confirmación para eliminar una venta.

### 3. **sql/**
Esta carpeta contiene los scripts SQL para crear y gestionar la base de datos.

- **bbdd.sql**: Script que crea la base de datos `libros` y define las tablas `CLIENTE`, `VENTA`, `LIBRO`, `AUTOR` y `VENTA_LIBRO`.

### 4. **stack/**
Esta carpeta contiene la configuración de Docker para ejecutar la aplicación en contenedores.

- **scripts/initdb.sql**: Script utilizado para inicializar la base 
de datos en el contenedor de Docker, asegurando que las tablas estén 
creadas y listas para usar.
- **docker-compose.yaml**: Archivo que define los servicios de Docker, incluyendo el contenedor de MySQL y Adminer para la gestión de la base de datos. Configura las variables de entorno necesarias y los puertos expuestos.
- **.env**: Es necesario crear un archivo llamado `.env` en la misma carpeta que `docker-compose.yaml`. Este archivo debe contener las siguientes variables de entorno personalizadas para que la aplicación funcione correctamente:

```
MYSQL_ROOT_PASSWORD=tu_contraseña
MYSQL_USERNAME=tu_usuario
MYSQL_PORT=tu_puerto
MYSQL_HOST=localhost
MYSQL_DATABASE=nombre_de_tu_base_de_datos
ADMINER_PORT=puerto_adminer
SERVICE_PORT=puerto_servicio
```

Asegúrate de reemplazar los valores con los datos que correspondan a tu configuración.

---

Este README proporciona una visión general del proyecto y su estructura. Si tienes alguna pregunta o necesitas más información, no dudes en preguntar.