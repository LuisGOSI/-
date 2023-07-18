var Sequelize = require("sequelize");

module.exports = (conexion) => {
    const UsuarioSchema = conexion.define("usuario", {
        id_usu: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre_usu: {
            type: Sequelize.STRING,
        },
        ape_usu: {
            type: Sequelize.STRING,
        },
        usuario_usu: {
            type: Sequelize.STRING
        },
        email_usu: {
            type: Sequelize.STRING,
        },
        contra_usu: {
            type: Sequelize.STRING,
        },
        status_usu: {
            type: Sequelize.BOOLEAN,
            default: true
        },
    });
    
    return UsuarioSchema;
}