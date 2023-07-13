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
        if (answer === 'View All Departments') {
            viewAllDepartments();
        }
        if (answer === 'View All Roles') {
            viewAllRoles();
        }
        if (answer === 'View All Employees') {
            viewAllEmployees();
        }
        if (answer === 'Add Department') {
            addDepartment();
        }
        if (answer === 'Add Role') {
            addRole();
        }
        if (answer === 'Add Employee') {
            addEmployee();
        }
        if (answer === 'Update Employee Role') {
            updateEmployeeRole();
        }
        if (answer === 'Exit') {
            connection.end();
            console.log(`Bye`);
        }
    });
};

function viewAllDepartments() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        prompt();
    })
} 