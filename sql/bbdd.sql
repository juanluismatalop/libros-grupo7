CREATE DATABASE IF NOT EXISTS `libros`;

USE `libros`;

DROP TABLE IF EXISTS alumno_asignatura;
DROP TABLE IF EXISTS profesor_asignatura;
DROP TABLE IF EXISTS alumno;
DROP TABLE IF EXISTS profesor;
DROP TABLE IF EXISTS asignatura;

CREATE TABLE IF NOT EXISTS CLIENTE(
    ID_CLIENTE INT AUTOINCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(300) NOT NULL,
    CORREO VARCHAR(300) NOT NULL
);

CREATE TABLE IF NOT EXISTS VENTA(
    ID_VENTA INT AUTOINCREMENT PRIMARY KEY,
    FECHA_VENTA DATE NOT NULL, 
    TOTAL FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS LIBRO(
    ID_LIBRO INT AUTOINCREMENT PRIMARY KEY,
    TITULO VARCHAR(200) NOT NULL,
    FECHA_PUBLICACION DATE,
    PRECIO FLOAT NOT NULL
);
