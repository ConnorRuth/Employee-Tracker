const inquirer = require("inquirer");



const startup = {
        type: "list",
        message: "Please type up to three letters you would like to include.",
        name: "task",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
        }
function taskCase(data) {
    switch(data.task) {
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
    }
}




function init() {
    inquirer.prompt(startup)
        .then((data) => {
            taskCase(data);
            })
              .then(init());


}
init();