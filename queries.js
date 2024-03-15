const inquirer  = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'CarcosaPelonis04!',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );
console.log(restart);
  function viewDepartments() {
      db.query("SELECT * FROM departments", function (err, results) {
          if (err) throw err;
          console.log("\nDepartments Table:");
          console.table(results);
          restart();
      });
  }
  
  function viewRoles() {
      db.query("SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments on roles.department_id = departments.id", function (err, results) {
          if (err) throw err;
          console.log("\nRoles Table:");
          console.table(results);
          restart();
      });
  }
  
  function viewEmployees() {
      db.query("SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees AS e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments AS d ON r.department_id = d.id LEFT JOIN employees AS m ON e.manager_id = m.id;", function (err, results) {
          if (err) throw err;
          console.log("\nEmployees Table:");
          console.table(results);
          restart();
      });
  }
  
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Enter the name of the new department:"
        })
        .then((data) => {
            console.log(`adding ${data.name} to the database...`)
            db.query(`INSERT INTO departments (department_name) VALUE ("${data.name}")`, function (err, results) {
                if(err) throw err;
                console.log(`Successfully added department ${data.name} to the database.`);
                restart();
        });
    })
}

function addRole() {
    db.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the title of the new role:"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary of the new role:"
                },
                {
                    type: "list",
                    name: "department",
                    message: "Enter the department for the new role:",
                    choices: results.map((department) => department.department_name)
                }
            ])
            .then(async (data) => {
                const depId = await getDepartmentId(data.department);
                if (depId) {
                    db.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [data.title, data.salary, depId], function (err, results) {
                        if (err) throw err;
                        console.log(`Added the role ${data.title} with a salary of ${data.salary} to the ${data.department} department to the database.`);
                        restart();
                    });
                } else {
                    console.log("Department not found.");
                }
            });
    });
}

function getDepartmentId(departmentName) {
    return new Promise((resolve, reject) => {
        db.query("SELECT id FROM departments WHERE department_name = ?", [departmentName], function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].id);
            }
        });
    });
}

function addEmployee() {
    db.query("SELECT id, title FROM roles", (err, results) => {
        if(err) throw err;
        const roles = results.map(({id, title}) => ({
            name: title,
            value: id
        }));
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, results) =>{
        if(err) throw err;
        const managers = results.map(({id, name}) => ({
            name,
            value: id
        }));
    
    inquirer
        .prompt([
            {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name:"
            },
            {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name:"
            },
            {
            type: "list",
            name: "roleId",
            message: "Select the employee's role:",
            choices: roles
            },
            {
            type: "list",
            name: "managerId",
            message: "what manager will they be working under?:",
            choices: [{ name: "None", value: null},
                ...managers,
                ],
            }
        ])
        .then((data) => {
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${data.firstName}', '${data.lastName}', ${data.roleId}, ${data.managerId});`, function (err, results){
                if(err) throw err;
                console.log("Employee successfully added");
                restart();
            })
        })
        .catch((err) => {
            console.error(err);
        });
    })});
}

function employeeRole(){
    db.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id =roles.id", (err,empRes) => {
        if(err) throw err;
        db.query("SELECT * FROM roles", (err, rolesRes) => {
            if(err) throw err;
            inquirer
                .prompt([
                    {
                    type: "list",
                    name: "employee",
                    message: "Select the employee to update:",
                    choices: empRes.map( (employees) => `${employees.first_name} ${employees.last_name}`
                    ),
                    },
                    {
                    type: "list",
                    name: "role",
                    message: "Select the new role:",
                    choices: rolesRes.map((role) => role.title),
                    },
                ])
                .then((data) => {
                    const employee = empRes.find( (employee) => `${employee.first_name} ${employee.last_name}` === data.employee);

                    const role = rolesRes.find( (role) => role.title === data.role);

                    db.query(`UPDATE employees SET role_id = ${role.id} WHERE id = ${employee.id}`, (err, results) => {
                        if(err) throw err;
                        console.log(`Updated ${employee.first_name} ${employee.last_name}'s  role to ${role.title} on the database`);
                        restart();
                    });
                });
        });
    });
}

function exit() {
    console.log("goodbye!");
    db.end();
}
function taskCase(data) {
    switch (data.task) {
      case "view all departments":
        viewDepartments();
        break;
      case "view all roles":
        viewRoles();
        break;
      case "view all employees":
        viewEmployees();
        break;
      case "add a department":
        addDepartment();
        break;
      case "add a role":
        addRole();
        break;
      case "add an employee":
        addEmployee();
        break;
      case "update an employee role":
        employeeRole();
        break;
      case "exit":
        exit();
        break;
    }
  }
  
  const startup = {
    type: "list",
    message: "Please select what task you would like to do?",
    name: "task",
    choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "exit"]
  };
  
  function restart() {
    inquirer.prompt(startup)
      .then((data) => {
        taskCase(data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

module.exports = restart;
