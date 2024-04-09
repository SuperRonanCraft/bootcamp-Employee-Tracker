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
  "View total budget of each department",
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
      updateEmployeeRole();
      break;
    case 7: //Sum of budgets
      getSumOfDepartments();
      break;
  }
});

function viewTable(queue) {
  pool.query(queue).then(({ rows }) => {
    console.table(rows);
    pool.end();
  });
}

//Adding a department
function addDepartment() {
  prompt([
    {
      type: "input",
      name: "input",
      message: "What is the name of the new department?",
    },
  ]).then(({ input }) => {
    //Insert new dapartment into sql database
    pool
      .query("INSERT INTO department (name) VALUES ($1)", [input])
      .then((data) => {
        //Wait of query to finish
        console.log(`Added new department '${input}'`);
        pool.end();
      })
      .catch((err) => {
        console.log("Error when adding department!");
      });
  });
}

//Adding a new role
async function addRole() {
  const departments = await getDepartments();
  prompt([
    {
      type: "input",
      name: "role",
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
      choices: departments.map((obj) => obj.name),
    },
  ]).then(({ role, salary, department }) => {
    //Deconstruct expected values
    //Grab the department id via the original objects string value
    const department_id = departments.filter(
      (obj) => obj.name === department
    )[0].id;
    pool
      .query(
        "INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)",
        [role, salary, department_id]
      )
      .then(({ rows }) => {
        console.log(`Added new role '${role}'`);
        pool.end();
      })
      .catch((err) => {
        console.log("Error when adding role!");
        console.log(err);
      });
  });
}

//Adding a new employee to db
async function addEmployee() {
  const roles = await getRoles(); //Grab all roles
  const managers = await getAvailableManagers(); //Grab all employees
  prompt([
    {
      type: "input",
      name: "first_name",
      message: "What this employee's First name?",
    },
    {
      type: "input",
      name: "last_name",
      message: "What this employee's Last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What this employee's role?",
      choices: roles.map((obj) => obj.title), //Display only roles titles
    },
    {
      type: "list",
      name: "manager",
      message: "What this employee's manager?",
      choices: managers.map((obj) => obj.name), //Display only employees name
    },
  ]).then(({ first_name, last_name, role, manager }) => {
    const role_id = roles.filter((obj) => obj.title === role)[0].id;
    const manager_id = managers.filter((obj) => obj.name === manager)[0]
      .employee_id;
    // console.log(role_id, manager_id, first_name, last_name, role, manager);
    pool
      .query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
        [first_name, last_name, role_id, manager_id]
      )
      .then(({ rows }) => {
        console.log(`Added new employee '${first_name} ${last_name}'`);
        pool.end();
      })
      .catch((err) => {
        console.log("Error when adding employee!");
        console.log(err);
      });
  });
}

async function updateEmployeeRole() {
  const roles = await getRoles(); //Grab all roles
  const employees = await getEmployees(); //Grab all employees
  prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's role do you want to update?",
      choices: employees.map((obj) => obj.first_name + " " + obj.last_name),
    },
    {
      type: "list",
      name: "role",
      message: "Which role do you want to assign to this employee?",
      choices: roles.map((obj) => obj.title),
    },
  ]).then(({ employee, role }) => {
    const role_id = roles.filter((obj) => obj.title === role)[0].id;
    const employee_id = employees.filter(
      (obj) => obj.first_name + " " + obj.last_name === employee
    )[0].id;
    pool
      .query("UPDATE employee SET role_id = $1 WHERE id = $2", [
        role_id,
        employee_id,
      ])
      .then(({ rows }) => {
        console.log(`Updated employee '${employee}' role to ${role}`);
        pool.end();
      })
      .catch((err) => {
        console.log("Error when updating employees role!");
        console.log(err);
      });
  });
}

async function getSumOfDepartments() {
  const { rows } = await pool.query(`SELECT d.name,
    SUM(r.salary) AS total_budget,
    COUNT(e.id) AS employee_count
    FROM employee e
    JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON d.id = r.department
    GROUP BY d.name`);
  console.table(rows);
  pool.end();
}

//Grab all roles from db
async function getRoles() {
  const { rows } = await pool.query("SELECT * FROM role");
  return rows;
}

//Grab all departments
async function getDepartments() {
  const { rows } = await pool.query("SELECT * FROM department");
  return rows;
}

//Generate an array of employees from db
async function getEmployees() {
  const { rows } = await pool.query("SELECT * FROM employee");
  return rows;
}

//Generate an array of employees from db
async function getAvailableManagers() {
  const employees = await getEmployees();
  const managers = employees.map(({ first_name, last_name, id }) => ({
    name: `${first_name} ${last_name}`, //Concat first and last to just name key value
    employee_id: id,
  }));
  managers.unshift({ name: "NONE", employee_id: null });
  return managers;
}
