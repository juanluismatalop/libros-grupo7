# Proyecto Libros Grupo E

### por Juan Luis Mata López, David Rico Chica y Alberto Ruiz Quiros

## Librería Judas Tadeo

Este proyecto es una aplicación web para gestionar una librería, permitiendo la administración de autores, libros y clientes. A continuación, se detalla la estructura del proyecto y la función de cada archivo.

---

## Estructura del Proyecto
Inicializamos la BBDD y el contenedor.
Creamos un archivo con las variables de entorno (archivo stack/.env):

```
MYSQL_ROOT_PASSWORD=tu_contraseña
MYSQL_USERNAME=tu_usuario
MYSQL_PORT=tu_puerto
MYSQL_HOST=localhost
MYSQL_DATABASE=nombre_de_tu_base_de_datos
ADMINER_PORT=puerto_adminer
SERVICE_PORT=puerto_servicio
```

**MUY IMPORTANTE:** Este archivo no existe y hay que crearlo para que funcione el proyecto como el ejemplo, pero con contraseñas cambiadas. Antes de empezar el proyecto hay que hacer un docker-compose en la carpeta stack

Instalamos las dependencias del package.json:
npm install express express-session mysql2 pug body-parser dotenv
¿Qué es cada cosa?


- express: servidor Web para nodeJS.

- express-session: gestiona sesiones (HTTP) entre el servidor Web/cliente web.

- mysql2: driver para conectar a mysql.

- pug: motor HTML.

- body-parser: para convertir los datos de un formulario (verbos GET y POST) en JSON.

- dotenv: para cargar archivos de configuración de entorno.

Ahora ya podemos ejecutar el servicio con:
```
node app.js
```
o bien con:
```
npm start
```
Esto último es posible porque hemos añadido esta opción al package.json nosotros.

### 1. **views** ###
El librero puede:

1. Hacer el CRUD de clientes
2. Hacer el CRUD de libros
3. Hacer el CRUD de autor
4. Hacer el CRUD de venta
5. Consultar las ventas
6. Consultar los clientes
7. Consultar los autores dependiendo de su pais

### CRUD clientes ###

VERBO | RUTA | ACCIÓN
------|------|-------
GET | /clientes | Listar todos los clientes
GET | /clientes/add | Muestra el formulario para añadir un cliente
POST | /clientes/add | Añade un cliente a la BBDD
GET | /clientes/edit/:id | Muestra el formulario para editar el cliente con ese ID
POST | /clientes/edit/:id | Guarda la información del cliente con ese ID
GET | /clientes/del/:id | Muestra el formulario para borrar el cliente con ese ID
POST | /clientes/del/:id | Borra el cliente con ese ID

### CRUD libros ###

VERBO | RUTA | ACCIÓN
------|------|-------
GET | /libro | Listar todos los libros
GET | /libro/add | Muestra el formulario para añadir un libro
POST | /libro/add | Añade un libro a la BBDD
GET | /libro/edit/:id | Muestra el formulario para editar el libro con ese ID
POST | /libro/edit/:id | Guarda la información del libro con ese ID
GET | /libro/del/:id | Muestra el formulario para borrar el libro con ese ID
POST | /libro/del/:id | Borra el libro con ese ID

### CRUD autor ###

VERBO | RUTA | ACCIÓN
------|------|-------
GET | /autor | Listar todos los autores
GET | /autor/add | Muestra el formulario para añadir un autor
POST | /autor/add | Añade un autor a la BBDD
GET | /autor/edit/:id | Muestra el formulario para editar el autor con ese ID
POST | /autor/edit/:id | Guarda la información del autor con ese ID
GET | /autor/del/:id | Muestra el formulario para borrar el autor con ese ID
POST | /autor/del/:id | Borra el autor con ese ID

### CRUD venta ###

VERBO | RUTA | ACCIÓN
------|------|-------
GET | /venta | Listar todos los ventas
GET | /venta/add | Muestra el formulario para añadir un venta
POST | /venta/add | Añade un venta a la BBDD
GET | /venta/del/:id | Muestra el formulario para borrar la venta con ese ID
POST | /venta/del/:id | Borra la venta con ese ID

### 2. **app.js**
Este es el archivo principal de la aplicación. Aquí se configuran las rutas, la conexión a la base de datos y los middleware de Express.

- **Conexión a MySQL**: Se establece una conexión a la base de datos MySQL utilizando el paquete `mysql2`.
- **Rutas**: Se definen las rutas para manejar las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para autores, libros y clientes.
- **Middleware**: Se configuran sesiones y se establece el motor de plantillas Pug.


### 3. **sql/**
Esta carpeta contiene los scripts SQL para crear y gestionar la base de datos.

- **bbdd.sql**: Script que crea la base de datos `libros` y define las tablas `CLIENTE`, `VENTA`, `LIBRO`, `AUTOR` y `VENTA_LIBRO`.

#### CLIENTE ####
```
CREATE TABLE IF NOT EXISTS CLIENTE(
    ID_CLIENTE INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(300) NOT NULL,
    CORREO VARCHAR(300) NOT NULL
);
```

INSERT 

````
INSERT INTO CLIENTE (NOMBRE, CORREO) VALUES 
('Juan Pérez', 'juan.perez@example.com'),
('María López', 'maria.lopez@example.com'),
('Carlos García', 'carlos.garcia@example.com'),
('Ana Martínez', 'ana.martinez@example.com'),
('Luis Fernández', 'luis.fernandez@example.com');
````

#### VENTA ####
```
CREATE TABLE IF NOT EXISTS VENTA(
    ID_VENTA INT AUTO_INCREMENT PRIMARY KEY,
    FECHA_VENTA DATE NOT NULL, 
    TOTAL FLOAT NOT NULL
);
```

INSERT 

````
INSERT INTO VENTA (FECHA_VENTA, TOTAL) VALUES 
('2023-01-15', 150.00),
('2023-02-20', 200.50),
('2023-03-10', 300.75),
('2023-04-05', 120.00),
('2023-05-25', 250.00);
````
#### LIBRO ####
```
CREATE TABLE IF NOT EXISTS LIBRO(
    ID_LIBRO INT AUTO_INCREMENT PRIMARY KEY,
    TITULO VARCHAR(200) NOT NULL,
    FECHA_PUBLICACION DATE,
    PRECIO FLOAT NOT NULL
);
```

INSERT 

````
INSERT INTO LIBRO (TITULO, FECHA_PUBLICACION, PRECIO) VALUES 
('El Quijote', '1605-01-16', 20.00),
('Cien años de soledad', '1967-05-30', 25.00),
('La casa de los espíritus', '1982-10-08', 30.00),
('1984', '1949-06-08', 15.00),
('El amor en los tiempos del cólera', '1985-03-05', 22.00);

````

#### AUTOR ####
```
CREATE TABLE IF NOT EXISTS AUTOR(
    ID_AUTOR INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(300) NOT NULL,
    PAIS VARCHAR(300) NOT NULL
);
```

INSERT 

````
INSERT INTO AUTOR (NOMBRE, PAIS) VALUES 
('Miguel de Cervantes', 'España'),
('Gabriel García Márquez', 'Colombia'),
('Isabel Allende', 'Chile'),
('George Orwell', 'Reino Unido'),
('Gabriel García Márquez', 'Colombia');
````