const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 8000;

app.use("/css", express.static("css"));

const db = mysql.createConnection({
  host: "localhost",
  port: 33308,
  user: "root",
  password: "elDeSant14g0",
  database: "libros judas tadeo",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
    return;
  }
  console.log("Conexión exitosa a MySQL");
});

app.use(
  session({
    secret: "un supersecreto inconfesable",
    // Cambiar a una clave segura en producción
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  if (!req.session.user && !req.path.match("/login")) res.redirect("/login");
  else next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error al verificar las credenciales:", err);
      res.render("error", { mensaje: "Credenciales no válidas." });
    } else {
      if (results.length > 0) {
        req.session.user = username;
        res.redirect("/");
      } else {
        res.render("error", { mensaje: "Credenciales no válidas." });
      }
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.render("error", { mensaje: err });
    else res.redirect("/login");
  });
});

app.get("/libro", (req, res) => {
  db.query("SELECT * FROM LIBRO", (err, result) => {
    if (err) {
      res.render("error", { mensaje: err });
    } else {
      res.render("asignaturas", { libros: result });
    }
  });
});

app.get("/libro-add", (req, res) => {
  res.render("libros-add");
});

app.post("/libro-add", (req, res) => {
  const { titulo, fecha_publicacion, precio } = req.body;
  const query =
    "INSERT INTO LIBRO (TITULO, FECHA_PUBLICACION, PRECIO) VALUES (?, ? ,?)";
  db.query(query, [titulo, fecha_publicacion, precio], (err) => {
    if (err) res.render("error", { mensaje: err.message });
    res.redirect("/libro");
  });
});

app.get("/libro-edit/:id", (req, res) => {
  const libroId = req.params.id;
  const query = "SELECT * FROM LIBRO WHERE ID_LIBRO = ?";
  db.query(query, [libroId], (err, results) => {
    if (err) res.render("error", { mensaje: err.message });
    else res.render("libro-edit", { libro: results[0] });
  });
});

app.post("/libro-edit/:id", (req, res) => {
  const libroId = req.params.id;
  const { titulo, fecha_publicacion, precio } = req.body;
  const query =
    "UPDATE LIBRO SET TITULO = ?, FECHA_PUBLICACION = ?, PRECIO = ?";
  db.query(query, [titulo, fecha_publicacion, precio, libroId], (err) => {
    if (err) res.render("error", { mensaje: err });
    else res.redirect("/libro");
  });
});

app.get("/libro-delete/:id", (req, res) => {
  const libroId = req.params.id;
  const query = "SELECT * FROM LIBRO WHERE ID_LIBRO = ?";
  db.query(query, [libroId], (err, results) => {
    if (err) res.render("error", { mensaje: err.message });
    else res.render("libro-delete", { libro: results[0] });
  });
});

app.post("/libro-delete/:id", (req, res) => {
  const libroId = req.params.id;
  const query = "DELETE FROM LIBRO WHERE ID_LIBRO = ?";
  db.query(query, [libroId], (err) => {
    if (err) res.render("error", { mensaje: err.message });
    else res.redirect("/libro");
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


app.get("/venta", (req, res) => {
  db.query("SELECT * FROM VENTA", (err, result) => {
    if (err) {
      res.render("error", { mensaje: err.message });
    } else {
      res.render("venta", { ventas: result });
    }
  });
});


app.post("/venta", (req, res) => {
  const {id_venta, fecha_venta, total} = req.body;
  
});


app.get("venta-add", (req, res) => {

});


app.post("/venta-add", (req, res) => {
  db.query("SELECT")

});



app.get("/venta-delete", (req, res) => {
  res.render("venta-delete");
});

app.post("venta-delete/:id", (req, res) => {
  const ventaId = req.params.id;
  const query = "DELETE FROM VENTA WHERE ID_VENTA = ?";
  db.query(query, [ventaId], (err) => {
    if (err) res.render("error", { mensaje: err.message });
    else res.redirect("/libro");
  });
})
})
