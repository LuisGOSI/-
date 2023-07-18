var rutas = require("express").Router();
const { where } = require("sequelize");
var { Usuario } = require("../conexion");

// Pagina de inicio ---------------------------------------------------------------------------
rutas.get("/inicio", (req, res) => {
  if (req.session.usuario) {
    res.render("inicio",{usuario: req.session.usuario});
  } else {
    res.redirect("/");
  }
});

// Pagina de organicos -------------------------------------------------------------------------
rutas.get("/organicos", (req, res) => {
  res.render("pagina_organicos");
});

// Pagina de inorganicos -----------------------------------------------------------------------
rutas.get("/inorganicos", (req, res) => {
  res.render("pagina_inorganicos");
});

// Pagina de residuos medicos ------------------------------------------------------------------
rutas.get("/residuos_medicos", (req, res) => {
  res.render("residuos_medicos");
});

// Pagina de residuos peligrosos ---------------------------------------------------------------
rutas.get("/residuos_toxicos", (req, res) => {
  res.render("residuos_peligrosos");
});

// Pagina sobre nosotros -----------------------------------------------------------------------
rutas.get("/sobre_nosotros", (req, res) => {
  res.render("sobre_nosotros");
});

// Sillon con palets ---------------------------------------------------------------------------
rutas.get("/sillon_palets", (req, res) => {
  res.render("manualidad");
});

// // Pagina iniciarSesion ---------------------------------------------------------------------

rutas.get("/", (req, res) => {
  res.render("inicioSesion");
});

// // Pagina CrearSesion -----------------------------------------------------------------------
rutas.get("/crearSesion", (req, res) => {
  res.render("RegistroUsuario");
});

// // Pagina registroExitoso -------------------------------------------------------------------

rutas.get("/registroExitoso", (req, res) => {
  res.render("registroExitoso");
});

// ruta cerrar sesion -------------------------------------------------------------------------
rutas.get("/cerrarSesion", (req, res) => {
      req.session.destroy();
    res.redirect("/");
});

// Ruta VALIDACION SESION ----------------------------------------------------------------------

rutas.post("/validar", (req, res) => {
  const usuario = req.body.usuario;
  const contraseña = req.body.password;

  let error;
  Usuario.findAll({where: {nombre_usu: usuario,contra_usu: contraseña,}})
  .then(()=>{
    res.render("inicio");
  })
  .catch((err)=>{
    error = "Contraseña incorrecta" + err;
    console.log(error);
    res.redirect("/")
  });
});

// Ruta para REGISTRAR USUARIO -----------------------------------------------------------------
rutas.post("/registrarUsuario", (req, res) => {
  Usuario
    .create(req.body)
    .then(() => {
      res.redirect("/registroExitoso");
    })
    .catch((err) => {
      console.log("No se logro el registro" + err);
      res.redirect("/");
    });
});

// ruta registrar manualidad -------------------------------------------------------------------
rutas.get("/registrar_manualidad", (req, res) => {
  res.render("registroManualidad");
});

module.exports = rutas;