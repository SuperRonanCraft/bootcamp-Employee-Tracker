DELETE FROM department;
INSERT INTO department (name)
VALUES ('Legal'), ('Finance'), ('Quality Assurance'), ('Engineering');

DELETE FROM role;
INSERT INTO role (title, salary, department) VALUES
    ('Main Tech', 100000, 1),
    ('Tech Support', 80000, 1),
    ('Tech', 40000, 2),
    ('Rep', 50000, 2),
    ('Tester', 50000, 3),
    ('Test Master', 60000, 3),
    ('Developer', 60000, 4),
    ('Head Developer', 80000, 4),
    ('Graphic Designer', 80000, 4);

DELETE FROM employee;
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Jake', 'Farm', 2, null),
    ('Robert', 'France', 1, 1),
    ('Hans', 'Solo', 3, null),
    ('Alain', 'Nunez', 4, null),
    ('Chris', 'Rock', 1, 4),
    ('Camrin', 'Town', 1, 4),
    ('Downy', 'K', 1, 4);