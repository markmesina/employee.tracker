const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db"
  });
  
  connection.connect(function (err) {
    if (err) throw err;
    runSearch();
  });

  function runSearch() {
    inquirer
      .prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View all employees",
          "View all departments",
          "View all managers",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Remove Employee",
          "Exit"]
  
      })
      .then(function (answer) {
        console.log(answer.action);
        switch (answer.action) {
          case "View all employees":
            viewEmployee();
            break;
  
          case "View all departments":
            viewDepartment();
            break;
  
          case "View all managers":
            viewManager();
            break;
  
          case "Add Employee":
            addEmployee();
            break;
  
          case "Add Department":
            addDepartment();
            break;
  
          case "Add Role":
            addRole();
            break;
  
          case "Remove Employee":
            removeEmployee();
            break;

  
          case "Exit":
            connection.end();
            break;
        }
      });
  }
  
  function viewEmployee() {
    connection.query('SELECT * FROM employee', function (err, res){
      console.table(res);
      runSearch();
    })
  }
  
  function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, data) {
      console.table(data);
      runSearch();
    });
  }
  
  function viewManager() {
    var query = "SELECT id, first_name, last_name FROM Employee WHERE id IN (SELECT manager_id FROM employee WHERE manager_id IS NOT NULL)";
    connection.query(query, function (err, res) {
      for (var i = 0; i < res.length; i++) {
        console.table(res);
      }
  
      runSearch();
    });
  }

  function addEmployee() {
    inquirer.prompt([{
            type: "input",
            name: "firstName",
            message: "What is the employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employees last name?"
        },
        {
            type: "number",
            name: "roleId",
            message: "What is the employees role ID"
        },
        {
            type: "number",
            name: "managerId",
            message: "What is the employees manager's ID?"
        }
    ]).then(function(res) {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.firstName, res.lastName, res.roleId, res.managerId], function(err, data) {
            if (err) throw err;
            console.table("Successfully Inserted");
            runSearch();
        })
    })
};
