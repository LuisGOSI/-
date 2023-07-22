var Sequelize = require("sequelize");

module.exports = (conexion) => {
    const InorganicoSchema = conexion.define("inorganico", {
        id_inor: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        titulo_inor: {
            type: Sequelize.STRING,
        },
        desc_inor: {
            type: Sequelize.STRING,
        },
        mater_inor: {
            type: Sequelize.STRING
        },
        pasos_inor: {
            type: Sequelize.STRING,
        },
        imagen_inor: {
            type: Sequelize.STRING,
        },
        razon_inor: {
            type: Sequelize.STRING,
        },
        status_inor: {
            type: Sequelize.BOOLEAN,
            default: true
        },
    });
    
    return InorganicoSchema;
}