const mysql = require('mysql2'); 
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: "localhost",
    port: 33308,
    user: "root",
    password: "elDeSant14g0",
    database: "libros",
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a MySQL');
});

module.exports = db;
