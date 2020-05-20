INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 90000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 135000, 2), ("Accountant", 75000, 3), ("Lawyer", 120000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Simon", "Newton", 1, 1), ("Dany", "Grimaldo", 2, 1), ("John", "Herman", 3, 1), ("Connie", "Tran", 4, 1), ("Logan", "Hemphill", 2, 1);
