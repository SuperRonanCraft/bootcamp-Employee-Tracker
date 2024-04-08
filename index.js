const { prompt } = require("inquirer");

const choiceArray = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
];

prompt([
  {
    type: "list",
    name: "choice",
    message: "Which would you like to do?",
    choices: choiceArray,
  },
]).then((answers) => {
  console.log(answers);
  switch (choiceArray.indexOf(answers.choice)) {
    case 0: //View Departments
      break;
    case 1: //View roles
      break;
    case 2: //View Employees
      break;
    case 3: //Add department
      break;
    case 4: //Add a role
      break;
    case 5: //Add employee
      break;
    case 6: //Update employee role
      break;
  }
});
