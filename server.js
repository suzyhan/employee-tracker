// Import inquirer package and mysql2
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Encryption for env file
require('dotenv').config();

// Dotenv variables
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;

// Create connection to database
const connection = mysql.createConnection( {
    host: 'localhost',
    user: dbUser,
    password: dbPassword,
    database: dbName,
},
    // console.log(`Connected to the employee database.`)
);

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected to the employee database.`);
    prompt();
});

// Create a function to prompt user
function prompt() {
inquirer
    .prompt({
        type:'list',
        name:'action',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Role',
            'Exit'
        ]
    })
    .then((answer) => {
        switch (answer.action) {
            case 'View All Departments': viewAllDepartments();
            break;
            case 'View All Roles': viewAllRoles();
            break;
            case 'View All Employees': viewAllEmployees();
            break;
            case 'Add Department': addDepartment();
            break;
            case 'Add Role': addRole();
            break;
            case 'Add Employee': addEmployee();
            break;
            case 'Update Employee Role': updateEmployeeRole();
            break;
            case 'Exit': connection.end();
            console.log('Bye');
            break;
            
        }
    });
};

// Create function to view all departments
function viewAllDepartments() {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        prompt();
    })
} 

// Create function to view all roles
function viewAllRoles() {
    const query = `SELECT 
        role.id, 
        role.title, 
        role.salary, 
        role.department_id, 
        department.name 
    FROM role 
    LEFT JOIN department on role.department_id = department.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        prompt();
    })
} 

// Create function to view all employees
function viewAllEmployees() {
    const query = `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        role.salary, 
        department.name, 
        employee.manager_id, 
    CONCAT(manager.first_name, " ", manager.last_name) AS manager_name 
    FROM employee 
    LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id 
    LEFT JOIN employee manager on employee.manager_id = manager.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        prompt();
    })
} 