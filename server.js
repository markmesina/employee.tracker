const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_db"
  });
  
  connection.connect(function (err) {
    if (err) throw err;
    runSearch();
  });
  