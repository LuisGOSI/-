var rutas = require("express").Router();
const path = require("path");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
var { Usuario } = require("../conexion");
var { Admin } = require("../conexion");
var { Inorganico } = require("../conexion");

// Pagina de inicio ---------------------------------------------------------------------------
rutas.get("/inicio/:usuario", (req, res) => {
  const usuario = req.params.usuario;
  if (req.session.usuario && req.session.usuario === usuario) {
    Inorganico.findAll({
      limit: 3, 
      order: [['createdAt', 'DESC']], 
    })
      .then((manualidades) => {
        res.render("inicio", { usuario, manualidades });
      })
      .catch((err) => {
        console.log("Error al obtener las manualidades: " + err);
        res.status(500).send("Error al obtener las manualidades");
      });
  } else {
    res.redirect("/");
  }
});



// Pagina de organicos -------------------------------------------------------------------------
rutas.get("/organicos", (req, res) => {
  if (req.session.usuario) {
    res.render("pagina_organicos", { usuario: req.session.usuario });
  } else {
    res.redirect("/");
  }
});

// Pagina de inorganicos -----------------------------------------------------------------------
rutas.get("/inorganicos", (req, res) => {
  Inorganico.findAll()
    .then((inorganicos) => {
      res.render("pagina_inorganicos", { inorganicos, usuario: req.session.usuario }); 
    })
    .catch((err) => {
      console.log("Error al obtener las manualidades: " + err);
      res.status(500).send("Error al obtener las manualidades");
    });
});

// Página de residuos medicos ------------------------------------------------------------------
rutas.get("/residuos_medicos", (req, res) => {
  if (req.session.usuario) {
    res.render("residuos_medicos", { usuario: req.session.usuario });
  } else {
    res.redirect("/");
  }
});


// Pagina de residuos peligrosos ---------------------------------------------------------------
rutas.get("/residuos_toxicos", (req, res) => {
  if (req.session.usuario) {
    res.render("residuos_peligrosos", { usuario: req.session.usuario });
  } else {
    res.redirect("/");
  }
});


// Pagina sobre nosotros -----------------------------------------------------------------------
rutas.get("/sobre_nosotros", (req, res) => {
  if (req.session.usuario) {
    res.render("sobre_nosotros", { usuario: req.session.usuario });
  } else {
    res.redirect("/");
  }
});

// Manualidad ----------------------------------------------------------------------------------
rutas.get("/manualidad/:id_inor", (req, res) => {
  Inorganico.findByPk(req.params.id_inor)
    .then((manualidad) => {
      if (manualidad) {
        res.render("manualidad", { manualidad, usuario: req.session.usuario });
      } else {
        res.status(404).send("Manualidad no encontrada");
      }
    })
    .catch((err) => {
      console.log("Error al obtener la manualidad: " + err);
      res.status(500).send("Error al obtener la manualidad");
    });
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
        res.redirect(`/inicio/${usuario}`); 
      } else {
        const error = "Nombre de usuario o contraseña incorrecta";
        console.log(error);
        res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
      }
    });
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
  const contraseñaPlana = req.body.contra_usu;
  const saltRounds = 10;

  bcrypt.hash(contraseñaPlana, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error al encriptar la contraseña:", err);
      return res.status(500).send("Error al registrar el usuario");
    }

    const nuevoUsuario = {
      nombre_usu: req.body.nombre_usu,
      ape_usu: req.body.ape_usu,
      usuario_usu: req.body.usuario_usu,
      email_usu: req.body.email_usu,
      contra_usu: hash, 
    };

    Usuario.create(nuevoUsuario)
      .then(() => {
        res.redirect("/registroExitoso");
      })
      .catch((err) => {
        const error = "No se logró el registro";
        console.error(error, err);
        res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
      });
  });
});

// ruta registrar manualidad -------------------------------------------------------------------
rutas.get("/registrar_manualidad", (req, res) => {
  if (req.session.usuario) {
    res.render("registroManualidad", { usuario: req.session.usuario });
  } else {
    res.redirect("/");
  }
});

// Ruta para agregar una manualidad ------------------------------------------------------------
rutas.post("/agregar_manualidad", (req, res) => {
  const { titulo, imagen_url, descripcion, materiales, pasos, razon } = req.body;

  Inorganico.create({
    titulo_inor: titulo,
    imagen_inor: imagen_url, 
    desc_inor: descripcion,
    mater_inor: materiales,
    pasos_inor: pasos,
    razon_inor: razon,
    status_inor: true, 
  })
    .then(() => {
      res.send(`<script>alert("Registro de manualidad exitoso"); window.location.href="/registrar_manualidad";</script>`);
    })
    .catch((err) => {
      console.log("Error al agregar la manualidad: " + err);
      res.status(500).send("Error al agregar la manualidad");
    });
});



module.exports = rutas;
