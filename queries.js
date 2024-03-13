const inquirer  = require('inquirer');
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
        console.table(results);
    });
}

function viewRoles() {
    db.query("SELECT roles.title,roles.id, departments.department_name, roles.salary FROM roles JOIN departments on roles.department_id = departments.id", function (err, results) {
        if(err) throw err;
        console.table(results);
    });
}

function viewEmployees() {
    db.query("SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees AS e LEFT JOIN roles r On e.role_id = r.id LEFT JOIN departments AS d ON r.department_id = d.id LEFT JOIN employee AS m ON e.manager_id = m.id;", function (err, results) {
        if(err) throw err;
        console.table(results);
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
            db.query(`INSERT INTO departments (department_name) VALUE ("${answer.name}")`, function (err, results) {
                if(err) throw err;
                console.log(`Successfully added department ${answer.name} to the database.`);
        });
    })
}

function addRole() {
    db.query("SELECT * FROM departments", function (err, results) {
        if(err) throw err;
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
        .then((data) => {
            const department = res.find((department) => department.name === answers.department);
            db.query(`INSERT INTO roles (title, salary department_id) VALUES (${data.title}, ${data.salary}, ${department});`, function (err, results) {
                if(err) throw err;
                console.log(`added the role ${data.title} with a salary of ${data.salary} to the ${answers.department} department to the database.`)
            });
        });
});}

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
            message: "what role will this employee have:",
            choices: [{ name: "None", value: null},
                ...managers,
                ],
            }
        ])
        .then((data) => {
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (${data.firstName}, ${data.lastName}, ${data.roleId}, ${data.managerId});`, function (err, results){
                if(err) throw err;
                console.log("Employee successfully added");
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
                    });
                });
        });
    });
}

function exit() {
    db.end();
}
module.exports = {
    viewDepartments, 
    viewRoles,
    viewEmployees,
    addDepartment,
    addRole,
    addEmployee,
    employeeRole,
    exit
};