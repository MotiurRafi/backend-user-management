const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '01305441850',
    database: 'user_management'
})

connection.connect(e=>console.log(e?'Error: '+ e : 'Database connected'))

module.exports = connection;