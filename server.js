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
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the employee database.');
    prompt();
});