var Sequelize = require("sequelize");

module.exports = (conexion) => {
    const AdministradorSchema = conexion.define("administrador", {
        id_admin: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre_admin: {
            type: Sequelize.STRING,
        },
        ape_admin: {
            type: Sequelize.STRING,
        },
        usuario_admin: {
            type: Sequelize.STRING
        },
        email_admin: {
            type: Sequelize.STRING,
        },
        contra_admin: {
            type: Sequelize.STRING,
        },
        status_admin: {
            type: Sequelize.BOOLEAN,
            default: true
        },
    });
    
    return AdministradorSchema;
}