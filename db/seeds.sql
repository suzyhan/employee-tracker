USE employee_db;

INSERT INTO department (department_name)
VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3),
('Sales Lead', 100000, 4),
('Salesperson', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Lewis', 'Cornelius', 1, null),
('Wilbur', 'Robinson', 2, 1),
('Marcie', 'Johnson', 3, null),
('Charlie', 'Brown', 4, 3),
('Edna', 'Mode', 5, null),
('Bob', 'Parr', 6, 5),
('Mike', 'Wozowski', 7, null),
('James', 'Sullivan', 8, 7);