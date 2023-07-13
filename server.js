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
        console.table(res);
        prompt();
    });
}; 

// Create function to view all roles
function viewAllRoles() {
    const query = `SELECT 
        role.id, 
        role.title AS role, 
        role.salary, 
        role.department_id, 
        department.department_name AS department
    FROM role 
    INNER JOIN department ON role.department_id = department.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        prompt();
    });
}; 

// Create function to view all employees
function viewAllEmployees() {
    const query = `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title AS role, 
        role.salary, 
        department.department_name AS department, 
        employee.manager_id, 
    CONCAT(manager.first_name, " ", manager.last_name) AS manager 
    FROM employee
    LEFT JOIN employee manager on employee.manager_id = manager.id
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id
    ORDER BY employee.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        prompt();
    });
}; 

// Create function to add department
function addDepartment() {
    inquirer
    .prompt({
        type: 'input',
        name: 'name',
        message: 'Enter New Department Name:'
    })
    .then((answer) => {
        console.log(answer.name);
        const query = `INSERT INTO department (department_name) VALUES ("${answer.name}")`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`Department ${answer.name} has been added to the database.`)
            prompt();
            console.log(answer.name);
        });
    });
};

// Create function to add role
function addRole() {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        departmentList = res.map(departments => ({
            name: departments.department_name,
            value: departments.id,
        }));
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the new role:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary of the new role:',
            },
            {
                 type: 'list',
                name: 'department',
                message: 'Select the department for the new role:',
                choices: departmentList
            }
        ])
        .then((answers) => {
            const query = `INSERT INTO role SET title='${answers.title}', salary=${answers.salary}, department_id=${answers.department}`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Role ${answers.title} has been added to the database.`);
                prompt();
            });
        });    
    });
};

// Create function to add employee
function addEmployee() {
    const query = `SELECT * FROM employee`;
    connection.query(query, (err, res) => {
        employeeList = res.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id,
        }));
    const roles = `SELECT * FROM role`;
    connection.query(roles, (err, res) => {
        roleList = res.map(roles => ({
            name: roles.title,
            value: roles.id,
        }));
        inquirer
        .prompt([
            {
                type: 'input',
                name: 'first',
                message: "Enter the employee's first name:",
            },
            {
                type: 'input',
                name: 'last',
                message: "Enter the employee's last name:",
            },
            {
                type: 'list',
                name: 'role',
                message: "Select the employee's role:",
                choices: roleList,
            },
            {
                type: 'list',
                name: 'manager',
                message: "Select the employee's manager:",
                choices: employeeList
            }
        ])
        .then((answers) => {
            const query = `INSERT INTO employee SET first_name='${answers.first}', last_name='${answers.last}', role_id=${answers.role}, manager_id=${answers.manager}`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Employee has been added to the database.`);
                prompt();
            });
        });
    });
    });
};

// Create function to update employee role
function updateEmployeeRole() {
    const query = `SELECT * FROM employee`;
    connection.query(query, (err, res) => {
        employeeList = res.map(employees => ({
            name: employees.first_name.concat(" ", employees.last_name),
            value: employees.id,
        }));
    const roles = `SELECT * FROM role`;
    connection.query(roles, (err, res) => {
        roleList = res.map(roles => ({
            name: roles.title,
            value: roles.id,
        }));
        inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Select the employee to update role:",
                choices: employeeList,
            },
            {
                type: 'list',
                name: 'role',
                message: "Select the new role to assign:",
                choices: roleList,
            },
            {
                type: 'list',
                name: 'manager',
                message: "Select the employee's manager:",
                choices: employeeList,
            }
        ])
        .then((answers) => {
            const query = `UPDATE employee SET role_id=${answers.role}, manager_id=${answers.manager} WHERE id=${answers.employee}`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Employee role has been updated.`);
                prompt();
            });
        });
    });
    });
};