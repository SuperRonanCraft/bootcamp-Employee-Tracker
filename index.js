const { prompt } = require("inquirer");
const { Pool } = require("pg");
const cTable = require("console.table");

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
]).then(({ choice }) => {
  //   console.log(answers);
  switch (choiceArray.indexOf(choice)) {
    case 0: //View Departments
      viewTable(`SELECT * FROM department`);
      break;
    case 1: //View roles
      viewTable(`SELECT role.id, title, salary, name AS department 
        FROM role
        JOIN
          department ON role.department = department.id`);
      break;
    case 2: //View Employees
      // viewTable("SELECT * FROM employee");
      viewTable(`SELECT e1.id, e1.first_name, e1.last_name, title, salary, department.name AS department, CONCAT(e2.first_name, ' ', e2.last_name) AS manager 
          FROM employee e1 
          JOIN 
              role ON role.id = e1.role_id 
          JOIN 
              department ON role.department = department.id 
          LEFT JOIN 
              employee e2 ON e1.manager_id = e2.id`);
      break;
    case 3: //Add department
      addDepartment();
      break;
    case 4: //Add a role
      addRole();
      break;
    case 5: //Add employee
      addEmployee();
      break;
    case 6: //Update employee role
      break;
  }
});

function viewTable(queue) {
  pool.sync;
  pool.query(queue).then(({ rows }) => {
    console.table(rows);
  });
}

function addDepartment() {
  prompt([
    {
      type: "input",
      name: "input",
      message: "What is the name of the new department?",
    },
  ]).then(({ input }) => {
    pool
      .query("INSERT INTO department (name) VALUES ($1)", [input])
      .then((data) => {
        console.log(`Added new department '${input}'`);
      })
      .catch((err) => {
        console.log("Error when adding department!");
      });
  });
}

async function addRole() {
  prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the new role?",
    },
    {
      type: "number",
      name: "salary",
      message: "What is the salary of this new role?",
    },
    {
      type: "list",
      name: "department",
      message: "Which department does this new role belong to?",
      choices: await getDepartments(),
    },
  ]).then(({ input }) => {
    pool
      .query("INSERT INTO department (name) VALUES ($1)", [input])
      .then((data) => {
        console.log(`Added new department '${input}'`);
      })
      .catch((err) => {
        console.log("Error when adding department!");
      });
  });
}

function addEmployee() {}

function updateEmployeeRole() {}
