const inquirer = require("inquirer");
const taskQuerie = require("./queries")


const startup = {
        type: "list",
        message: "Please type up to three letters you would like to include.",
        name: "task",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "exit"]
        }
function taskCase(data) {
    switch(data.task) {
      case "view all departments":
        taskQuerie.viewDepartments();
        break;
      case "view all roles":
        taskQuerie.viewRoles();
        break;
      case "view all employees":
        taskQuerie.viewEmployees();
        break;
      case "add a department":
        taskQuerie.addDepartment();
        break;
      case "add a role":
        taskQuerie.addRole();
        break;
      case "add an employee":
        taskQuerie.addEmployee();
        break;
      case "update an employee role":
        taskQuerie.employeeRole();
        break;
      case "exit":
        taskQuerie.exit();
    }
}




function init() {
  inquirer.prompt(startup)
    .then((data) => {
      taskCase(data);
      if (data.task !== "exit") {
        init(); // Recursive call only if the user didn't select "exit"
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}
init();