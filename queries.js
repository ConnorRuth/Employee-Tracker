const mysql = require('mysql2');
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'CarcosaPelonis04!',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

function viewDepartments() {
    db.query("SELECT * FROM departments", function (err, results) {
        console.log(results);
    });
}

function viewDepartments() {
    db.query("SELECT  FROM departments", function (err, results) {
        console.log(results);
    });
}

function viewDepartments() {
    db.query("SELECT * FROM departments", function (err, results) {
        console.log(results);
    });
}