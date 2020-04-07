const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
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
          "Update Employee",
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
  
          case "Update Employee":
            updateEmployee();
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
        console.table(res);
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
            console.log(`Employee ${[res.firstName]} ${[res.lastName]}, role ID ${[res.roleId]} was successfully added to report to manager ID ${[res.managerId]}`);
            runSearch();
        })
    })
  };


  function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "What is the department that you want to add?"
    }, ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department], function(err, data) {
            if (err) throw err;
            console.log(`Department of ${[res.department]} was successfully created`);
            runSearch();
        })
    })
  };

  function addRole() {
    inquirer.prompt([
        {
            message: "enter title:",
            type: "input",
            name: "title"
        }, {
            message: "enter salary:",
            type: "number",
            name: "salary"
        }, {
            message: "enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO roles (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            console.log(`${[response.title]} was successfully created!`);
            runSearch();
        })
    })

  };

function updateEmployee() {
    inquirer.prompt([
        {
            message: "which employee would you like to update? (use first name only for now)",
            type: "input",
            name: "name"
        }, {
            message: "enter the new role ID:",
            type: "number",
            name: "role_id"
        }
    ]).then(function (response) {
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [response.role_id, response.name], function (err, data) {
          if(err) throw (err);  
          console.log(`${[response.name]} was successfully updated!`);
          runSearch();
        })
    })

  };function removeEmployee() {
  inquirer.prompt({
      name: "removeEmployee",
      type: "input",
      message: "To REMOVE an employee, enter the Employee id",

    })
    .then(function (answer) {
      var query = "DELETE FROM employee WHERE ?";
      var newId = Number(answer.removeEmployee);
    
      connection.query(query, { id: newId }, function (err, res) {
        if(err) throw (err);
        console.log(`Employee number ${answer.removeEmployee} has been removed`)
        runSearch();
      });
    });
}
