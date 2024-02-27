var mysql = require('mysql');
require('dotenv').config();

var db_conexion = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true,
    database: 'pedidos'
});

module.exports = db_conexion;