const mysql = require('mysql');
module.exports = {
    connection : mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "employee_tracker_DB"
    })
}