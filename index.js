const { prompt } = require("inquirer");
const { Pool } = require("pg");

const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: "postgres",
    // TODO: Enter PostgreSQL password
    password: "password",
    host: "localhost",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

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
  //   console.log(answers);
  switch (choiceArray.indexOf(answers.choice)) {
    case 0: //View Departments
      viewTable("SELECT name FROM department");
      break;
    case 1: //View roles
      viewTable(
        "SELECT title, salary, name AS department_name FROM role JOIN department ON role.department = department.id"
      );
      break;
    case 2: //View Employees
      viewTable("SELECT * FROM employee");
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
  pool.end();
});

function viewTable(queue) {
  pool.query(queue).then(({ rows }) => {
    console.table(rows);
  });
}

function addDepartment() {}

function addEmployee() {}

function updateEmployeeRole() {}
