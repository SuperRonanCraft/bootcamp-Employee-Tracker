DELETE FROM department;
INSERT INTO department (name)
VALUES ('IT'), ('HR'), ('QA'), ('Front End');

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


-- CREATE TABLE employee (
--     id SERIAL PRIMARY KEY,
--     first_name VARCHAR(30) NOT NULL,
--     last_name VARCHAR(30) NOT NULL,
--     role_id INTEGER NOT NULL,
--     manager_id INTEGER,
--     FOREIGN KEY (role_id)
--     REFERENCES role(id)
--     ON DELETE SET NULL
-- );