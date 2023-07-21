var rutas = require("express").Router();
const { where } = require("sequelize");
var { Usuario } = require("../conexion");
var { Admin } = require("../conexion");

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

// // Pagina iniciar admin
rutas.get("/iniciarAdmin", (req, res) => {
  res.render("iniciarAdmin");
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

  Usuario.findAll({ where: { usuario_usu: usuario, contra_usu: contraseña } })
    .then((inicioS) => {
      if (inicioS.length > 0) {
        req.session.usuario = usuario;
        // console.log(inicioS.dataValues.nombre_usu);
        // req.session.nombre = inicioS;
        res.redirect("inicio");
      } else {
        const error = "Nombre de usuario o contraseña incorrecta";
        console.log(error);
        res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
      }
    })
});

rutas.post("/validarAdmin", (req, res) => {
  const usuario = req.body.usuario;
  const contraseña = req.body.password;

  Admin.findAll({ where: { usuario_admin: usuario, contra_admin: contraseña } })
    .then((inicioSA) => {
      if (inicioSA.length > 0) {
        req.session.admin = usuario;
        res.redirect("inicioAdmin");
      } else {
        const error = "Nombre de usuario o contraseña incorrecta";
        console.log(error);
        res.send(`<script>alert("${error}"); window.location.href="/iniciarAdmin";</script>`);
      }
    })
});

// Pagina de inicio admin ---------------------------------------------------------------------------
rutas.get("/inicioAdmin", (req, res) => {
  if (req.session.admin) {
    Usuario.findAll({where:{status_usu:1}})
    .then((usersGreenWaste)=>{
      res.render("inicioAdmin", {usuarios:usersGreenWaste});
    })
    .catch((err)=>{{
      console.log("Error " + err);
    }})
  } else {
    res.redirect("/");
  }
});


// Ruta para REGISTRAR USUARIO -----------------------------------------------------------------
rutas.post("/registrarUsuario", (req, res) => {
  Usuario
    .create(req.body)
    .then(() => {
      res.redirect("/registroExitoso");
    })
    .catch((err) => {
      const error = "No se logro el registro";
      console.log("No se logro el registro" + err);
      res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
    });
});

// ruta registrar manualidad -------------------------------------------------------------------
rutas.get("/registrar_manualidad", (req, res) => {
  res.render("registroManualidad");
});


module.exports = rutas;
