var express = require("express");
var path = require("path");
var session = require("express-session");
var rutasPaginas = require("./rutas/paginas");
require("dotenv").config();

var app = express();
app.set("view engine", "ejs");
app.use("/GreenWaste", express.static(path.join(__dirname, "web")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRETO_SESSIONS,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", rutasPaginas);

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
