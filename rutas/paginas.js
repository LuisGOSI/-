var rutas = require("express").Router();
const path = require("path");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
var { Usuario } = require("../conexion");
var { Admin } = require("../conexion");
var { Inorganico } = require("../conexion");

// Middleware para obtener el usuario de la sesión
const obtenerUsuarioMiddleware = (req, res, next) => {
  if (req.session.usuario) {
    Usuario.findOne({ where: { usuario_usu: req.session.usuario } })
      .then((user) => {
        res.locals.user = user || null; // Establecer user en null si no se encuentra el usuario
        next();
      })
      .catch((err) => {
        console.log("No se pudo obtener el usuario" + err);
        res.locals.user = null; // Establecer user en null en caso de error
        next();
      });
  } else {
    res.locals.user = null; // Establecer user en null si no hay usuario en la sesión
    next();
  }
};

// ...

// Rutas
// ...

// Usar el middleware obtenerUsuarioMiddleware en todas las rutas
rutas.use(obtenerUsuarioMiddleware);


// Pagina de inicio ---------------------------------------------------------------------------
rutas.get("/inicio/:usuario", (req, res) => {
  if (req.session.usuario) {
    Inorganico.findAll({
      limit: 3, 
      order: [['createdAt', 'DESC']], 
    })
      .then((manualidades) => {
        Usuario.findOne({where: {usuario_usu:req.params.usuario}})
        .then((user)=>{
          res.render("inicio", { user: user, manualidades,  });
        })
      .catch((err)=>{
        console.log("No se pudo obtener el usuario" + err);
      }); 
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
    res.render("pagina_organicos", { user: res.locals.user });
  } else {
    res.redirect("/");
  }
});

// Pagina de inorganicos -----------------------------------------------------------------------
rutas.get("/inorganicos", (req, res) => {
  Inorganico.findAll()
    .then((inorganicos) => {
      res.render("pagina_inorganicos", { inorganicos, user: res.locals.user }); 
    })
    .catch((err) => {
      console.log("Error al obtener las manualidades: " + err);
      res.status(500).send("Error al obtener las manualidades");
    });
});

// Página de residuos medicos ------------------------------------------------------------------
rutas.get("/residuos_medicos", (req, res) => {
  if (req.session.usuario) {
    res.render("residuos_medicos", { user: res.locals.user });
  } else {
    res.redirect("/");
  }
});


// Pagina de residuos peligrosos ---------------------------------------------------------------
rutas.get("/residuos_toxicos", (req, res) => {
  if (req.session.usuario) {
    res.render("residuos_peligrosos", { user: res.locals.user });
  } else {
    res.redirect("/");
  }
});

// Pagina de Composta con Compostador -------------------------------------------------------------------------
rutas.get("/composta_compostador", (req, res) => {
  if (req.session.usuario) {
    res.render("composta_compostador", { user: res.locals.user });
  } else {
    res.redirect("/");
  }
});

// Pagina de Composta con cubeta -------------------------------------------------------------------------
rutas.get("/composta_cubeta", (req, res) => {
  if (req.session.usuario) {
    res.render("composta_cubeta", { user: res.locals.user });
  } else {
    res.redirect("/");
  }
});

// Pagina de Composta con fosa -------------------------------------------------------------------------
rutas.get("/composta_fosa", (req, res) => {
  if (req.session.usuario) {
    res.render("composta_fosa", { user: res.locals.user });
  } else {
    res.redirect("/");
  }
});


// Pagina sobre nosotros -----------------------------------------------------------------------
rutas.get("/sobre_nosotros", (req, res) => {
  if (req.session.usuario) {
    res.render("sobre_nosotros", { user: res.locals.user });
  } else {
    res.redirect("/");
  }
});

// Manualidad ----------------------------------------------------------------------------------
rutas.get("/manualidad/:id_inor", (req, res) => {
  Inorganico.findByPk(req.params.id_inor)
    .then((manualidad) => {
      if (manualidad) {
        res.render("manualidad", { manualidad, user: res.locals.user });
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

// Ruta VALIDACION SESION
rutas.post("/validar", (req, res) => {
  const usuario = req.body.usuario;
  const contraseña = req.body.password;

  Usuario.findOne({ where: { usuario_usu: usuario } })
    .then((user) => {
      if (user) {
        bcrypt.compare(contraseña, user.contra_usu, (err, result) => {
          if (err) {
            console.error("Error al comparar contraseñas:", err);
            return res.status(500).send("Error al validar el usuario");
          }

          if (result) {
            req.session.usuario = usuario;
            res.redirect(`/inicio/${usuario}`);
          } else {
            const error = "Nombre de usuario o contraseña incorrecta";
            console.log(error);
            res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
          }
        });
      } else {
        const error = "Nombre de usuario o contraseña incorrecta";
        console.log(error);
        res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
      }
    })
    .catch((err) => {
      console.log("Error al obtener el usuario: " + err);
      res.status(500).send("Error al obtener el usuario");
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
    Usuario.findAll({ where: { status_usu: 1 } })
      .then((usersGreenWaste) => {
        Inorganico.findAll()
          .then((manualidades) => {
            res.render("inicioAdmin", { usuarios: usersGreenWaste, manualidades: manualidades, usuario: req.session.usuario });
          })
          .catch((err) => {
            console.log("Error al obtener las manualidades: " + err);
            res.status(500).send("Error al obtener las manualidades");
          });
      })
      .catch((err) => {
        console.log("Error " + err);
        res.redirect("/");
      });
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
    res.render("registroManualidad", { user: res.locals.user });
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

// ruta de borrado fisico de usuarios
rutas.get("/borrarUsuario/:id_usu",(req,res)=>{
  Usuario.destroy({where:{id_usu:req.params.id_usu}})
  .then(()=>{
    res.send(`<script>alert("Borrado fisico exitoso"); window.location.href="/inicioAdmin";</script>`);
  })
  .catch((err)=>{
    console.log("Error: "+err);
    res.redirect("/");
  });
});

// ruta de borrado logico fisico de usuarios
rutas.get("/borrarUsuario2/:id_usu",(req,res)=>{

  Usuario.update({status_usu:0}, {where:{id_usu:req.params.id_usu}})
  .then(()=>{
    res.send(`<script>alert("Borrado logico exitoso"); window.location.href="/inicioAdmin";</script>`);
  })
  .catch((err)=>{
    console.log("Error: "+err);
    res.redirect("/");
  });
});

// ruta que modifica el usuario
rutas.get("/modificarUsuario/:id_usu", (req, res) => {
  const idUsuario = req.params.id_usu;
  Usuario.findByPk(idUsuario)
    .then((usuario) => {
      if (usuario) {
        res.render("editarUsuario", { usuario });
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    })
    .catch((err) => {
      console.log("Error al obtener el usuario: " + err);
      res.status(500).send("Error al obtener el usuario");
    });
});

// ruta de modificar usuario
rutas.post("/modificarUsuario", (req, res) => {
  Usuario.update(req.body, { where: { id_usu: req.body.id_usu } })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
});

// ruta de borrar fisicamente manualidades 
rutas.get("/borrarManualidad/:id_inor", (req, res) => {
  Inorganico.destroy({ where: { id_inor: req.params.id_inor } })
    .then(() => {
      res.send(`<script>alert("Borrado físico exitoso"); window.location.href="/inicioAdmin";</script>`);
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.redirect("/");
    });
});

// ruta de borrar logicamente manualidades 
rutas.get("/borrarManualidad2/:id_inor", (req, res) => {
  Inorganico.update({ status_inor: 0 }, { where: { id_inor: req.params.id_inor } })
    .then(() => {
      res.send(`<script>alert("Borrado lógico exitoso"); window.location.href="/inicioAdmin";</script>`);
    })
    .catch((err) => {
      console.log("Error: " + err);
      res.redirect("/");
    });
});



module.exports = rutas;
