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


