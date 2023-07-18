var Sequelize = require("sequelize");
var usuarioModelo = require("./modelos/usuarios");
require("dotenv").config();

var db = process.env.DATABASE_NAME;
var port = process.env.DATABASE_PORT;
var usuario = process.env.DATABASE_USERNAME;
var password = process.env.DATABASE_PASSWORD;
var host = process.env.DATABASE_HOST;

var conexion = new Sequelize(db, usuario, password, {
  host: host,
  port: port,
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

conexion
  .sync({ force: false })
  .then(() => {
    console.log("Conectado a MYSQL de PlanetScale");
  })

  .catch((err) => {
    console.log("Error al conectar con MYSQL de PLanetScale" + err);
  });

var Usuario = usuarioModelo(conexion);
// var 
// var

module.exports = {
  Usuario: Usuario,
  
};
