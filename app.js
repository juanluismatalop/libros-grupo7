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
  database: "libros",
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
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
//Ruta libro
app.get("/libro", (req, res) => {
  db.query("SELECT * FROM LIBRO", (err, result) => {
    if (err) {
      res.render("error", { mensaje: err });
    } else {
      console.log(result)
      res.render("libro/libro", { libros: result });
    }
  });
});

app.get("/libro-add", (req, res) => {
  res.render("libro/libro-add");
});

app.post("/libro-add", (req, res) => {
  const { titulo, fecha_publicacion, precio } = req.body;
  const query =
    "INSERT INTO LIBRO (TITULO, FECHA_PUBLICACION, PRECIO) VALUES (?, ? ,?)";
  db.query(query, [titulo, fecha_publicacion, precio], (err) => {
    if (err) res.render("error", { mensaje: err.message });
    else res.redirect("/libro");
  });
});

app.get("/libro-edit/:id", (req, res) => {
  const libroId = req.params.id;
  const query = "SELECT * FROM LIBRO WHERE ID_LIBRO = ?";
  db.query(query, [libroId], (err, results) => {
    if (err) res.render("error", { mensaje: err.message });
    else res.render("libro/libro-edit", { libro: results[0] });
  });
});

app.post("/libro-edit/:id", (req, res) => {
  const libroId = req.params.id;
  const { titulo, fecha_publicacion, precio } = req.body;
  const query =
    "UPDATE LIBRO SET TITULO = ?, FECHA_PUBLICACION = ?, PRECIO = ? WHERE ID_LIBRO = ?";
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
    else res.render("libro/libro-delete", { libro: results[0] });
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

// Rutas para autores
app.get("/autor", (req, res) => {
  const { pais } = req.query;

  const queryPaises = "SELECT DISTINCT PAIS FROM AUTOR";

  let queryAutores = "SELECT * FROM AUTOR";
  const params = [];

  if (pais) {
    queryAutores += " WHERE PAIS = ?";
    params.push(pais);
  }

  db.query(queryPaises, (err, paises) => {
    if (err) {
      res.render("error", { mensaje: "Error al obtener los países." });
    } else {
      db.query(queryAutores, params, (err, autores) => {
        if (err) {
          res.render("error", { mensaje: "Error al obtener los autores." });
        } else {
          res.render("autor/autor", {
            autores,
            paises: paises.map((p) => p.PAIS),
            selectedPais: pais || "",
          });
        }
      });
    }
  });
});


app.get('/autor-add', (req, res) => {
  res.render('autor/autor-add');
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
  const id_autor = req.params.id;
  db.query('SELECT * FROM AUTOR WHERE ID_AUTOR = ?', [id_autor], (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else {
      if (result.length > 0)
        res.render('autor/autor-edit', { autor: result[0] });
      else{
        res.render('error', { mensaje: 'El autor no existe.' });
      }
    }
  });
});

app.post('/autor-edit/:id', (req, res) => {
  const id_autor = req.params.id;
  const { nombre, pais } = req.body;
  db.query('UPDATE AUTOR SET NOMBRE = ?, PAIS = ? WHERE ID_AUTOR = ?', [nombre, pais, id_autor], (err) => {
    if (err) res.render("error", { mensaje: err });
    else res.redirect('/autor');
  });
});

app.get('/autor-delete/:id', (req, res) => {
  const id_autor = req.params.id;
  db.query('SELECT * FROM AUTOR WHERE ID_AUTOR = ?', [id_autor], (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else res.render('autor/autor-delete', { autor: result[0] });
  });
});

app.post('/autor-delete/:id', (req, res) => {
  const id_autor = req.params.id;
  db.query('DELETE FROM AUTOR WHERE ID_AUTOR = ?', [id_autor], (err) => {
    if (err) res.render("error", { mensaje: err });
    else res.redirect('/autor');
  });
});

// Rutas para clientes
app.get('/cliente', (req, res) => {
  db.query('SELECT * FROM CLIENTE', (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else{
      console.log(result)
      res.render('cliente/cliente', { clientes: result });
    } 
  });
});

app.get('/cliente-add', (req, res) => {
  res.render('cliente/cliente-add');
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
        res.render('cliente/cliente-edit', { cliente: result[0] });
      else
        res.render('error', { mensaje: 'El cliente no existe.' });
    }
  });
});

app.post('/cliente-edit/:id', (req, res) => {
  const clienteId = req.params.id;
  const { nombre, correo } = req.body;
  db.query('UPDATE CLIENTE SET NOMBRE = ?, CORREO = ? WHERE ID_CLIENTE = ?', [nombre, correo, clienteId], (err) => {
    if (err) res.render("error", { mensaje: err });
    else res.redirect('/cliente');
  });
});

app.get('/cliente-delete/:id', (req, res) => {
  const clienteId = req.params.id;
  db.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [clienteId], (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else res.render('cliente/cliente-delete', { cliente: result[0] });
  });
});

app.post('/cliente-delete/:id', (req, res) => {
  const clienteId = req.params.id;
  db.query('DELETE FROM CLIENTE WHERE ID_CLIENTE = ?', [clienteId], (err) => {
    if (err) res.render("error", { mensaje: err });
    else res.redirect('/cliente');
  });
});

// Rutas para ventas
app.get("/venta", (req, res) => {
  db.query("SELECT * FROM VENTA", (err, result) => {
    if (err) {
      res.render("error", { mensaje: err.message });
    } else {
      console.log(result)
      res.render("venta/venta", { ventas: result });
    }
  });
});

app.get("/venta-add", async (req, res) => {
  try {
    const clientes = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM CLIENTE", (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    const libros = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM LIBRO", (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    res.render("venta/venta-add", { clientes, libros });
  } catch (err) {
    res.render("error", { mensaje: err.message });
  }
});

app.post("/venta-add", (req, res) => {
  const { fecha_venta, precio } = req.body;
  const query = "INSERT INTO VENTA (FECHA_VENTA, TOTAL) VALUES (?, ?)";
  db.query(query, [fecha_venta, precio], (err) => {
    if (err) {
      res.render("error", { mensaje: err.message });
    } else {
      res.redirect("/venta");
    }
  });
});

app.get("/venta-delete/:id", (req, res) => {
  const ventaId = req.params.id;
  db.query("SELECT * FROM VENTA WHERE ID_VENTA = ?", [ventaId], (err, result) => {
    if (err) res.render("error", { mensaje: err });
    else res.render("venta/venta-delete", { venta: result[0] });
  });
});

app.post("/venta-delete/:id", (req, res) => {
  const ventaId = req.params.id;
  const query = "DELETE FROM VENTA WHERE ID_VENTA = ?";
  db.query(query, [ventaId], (err) => {
    if (err) res.render("error", { mensaje: err.message });
    else res.redirect("/venta");
  });
});