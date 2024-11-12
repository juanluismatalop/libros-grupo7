const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8000;

app.use('/css', express.static('css'));

const db = mysql.createConnection({
  host: 'localhost',
  port: 33308,
  user: 'root',
  password: 'elDeSant14g0',
  database: 'libros judas tadeo',
});

db.connect(err => {
    if (err) {
      console.error('Error al conectar a MySQL:', err);
      return;
    }
    console.log('Conexión exitosa a MySQL');
});

app.use(
    session({
      secret: 'un supersecreto inconfesable',
      // Cambiar a una clave segura en producción
      resave: false,
      saveUninitialized: true,
    })
);

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    if (!req.session.user && !(req.path.match("/login")) )
      res.redirect("/login")
    else 
      next();  
});
  
app.get('/', (req, res) => {
    res.render('index');
});
  

app.get('/login', (req, res) => {
    res.render('login');
});
  
  
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.query(query, [username, password], (err, results) => {
    if (err) {
        console.error('Error al verificar las credenciales:', err);
        res.render("error", { mensaje: "Credenciales no válidas." });
    } else {
        if (results.length > 0) {
          req.session.user = username;
          res.redirect('/');
    } else {
          res.render("error", {mensaje: "Credenciales no válidas."}); 
        }
    }
    });
});
  
  
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) res.render("error", { mensaje: err });
      else res.redirect('/login');
    });
});

app.get('/autor', (req, res) => {
  db.query('SELECT * FROM AUTOR', (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else res.render('autor', { autor: result });
  });
});

app.get('/autor-add', (req, res) => {
  res.render('autor-add');
});

app.post('/autor-add', (req, res) => {
  const { nombre, pais } = req.body;
  db.query('INSERT INTO AUTOR (NOMBRE, PAIS) VALUES (?, ?)', [nombre, pais], (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else {
      console.log('Autor creado con id:'+result.insertId);
      
      res.redirect('/autor');
    }
  });

});

app.get('/autor-edit/:id', (req, res) => {

  const alumnoId = req.params.id;
  db.query('SELECT * FROM AUTOR WHERE id_autor = ?', [id_autor], (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else {
      if(result.length>0)
        res.render('autor-edit', { alumno: result[0] });
      else
        res.render('error', {mensaje: 'El autor no existe.'})
    }

  });
});

app.post('/autor-edit/:id', (req, res) => {
  const alumnoId = req.params.id;
  const { nombre, apellido } = req.body;
  db.query('UPDATE AUTOR SET NOMBRE = ?, PAIS = ? WHERE ID = ?', [nombre, pais, id_autor], (err, result) => {
    if (err)
      res.render("error", { mensaje: err });
    else
      res.redirect('/autor');
  });

});

app.get('/autor-delete/:id', (req, res) => {

  const alumnoId = req.params.id;
  db.query('SELECT * FROM AUTOR WHERE id = ?', [id_autor], (err, result) => {
    if (err)
      res.render("error", { mensaje: err });
    else
      res.render('autor-delete', { autor: result[0] });
  });

});

app.post('/autor-delete/:id', (req, res) => {
  const alumnoId = req.params.id;
  // Eliminar un alumno por su ID
  db.query('DELETE FROM AUTOR WHERE id_autor = ?', [id_autor], (err, result) => {
    if (err)
      res.render("error", { mensaje: err });
    else
      res.redirect('/autor');
  });

});

app.get('/cliente', (req, res) => {
  db.query('SELECT * FROM CLIENTE', (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else res.render('cliente', { clientes: result });
  });
});

app.get('/cliente-add', (req, res) => {
  res.render('cliente-add');
});

app.post('/cliente-add', (req, res) => {
  const { nombre, correo } = req.body;
  db.query('INSERT INTO CLIENTE (NOMBRE, CORREO) VALUES (?, ?)', [nombre, correo], (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else {
      console.log('Cliente creado con id:' + result.insertId);
      res.redirect('/cliente');
    }
  });
});

app.get('/cliente-edit/:id', (req, res) => {
  const clienteId = req.params.id;
  db.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [clienteId], (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else {
      if (result.length > 0)
        res.render('cliente-edit', { cliente: result[0] });
      else
        res.render('error', { mensaje: 'El cliente no existe.' });
    }
  });
});

app.post('/cliente-edit/:id', (req, res) => {
  const clienteId = req.params.id;
  const { nombre, correo } = req.body;
  db.query('UPDATE CLIENTE SET NOMBRE = ?, CORREO = ? WHERE ID_CLIENTE = ?', [nombre, correo, clienteId], (err, result) => {
    if (err)
      res.render("error", { mensaje: err });
    else
      res.redirect('/cliente');
  });
});

app.get('/cliente-delete/:id', (req, res) => {
  const clienteId = req.params.id;
  db.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [clienteId], (err, result) => {
    if (err)
      res.render("error", { mensaje: err });
    else
      res.render('cliente-delete', { cliente: result[0] });
  });
});

app.post('/cliente-delete/:id', (req, res) => {
  const clienteId = req.params.id;
  db.query('DELETE FROM CLIENTE WHERE ID_CLIENTE = ?', [clienteId], (err, result) => {
    if (err)
      res.render("error", { mensaje: err });
    else
      res.redirect('/cliente');
  });
});