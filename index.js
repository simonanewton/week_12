const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "french1",
	database: "employee_db"
});

connection.connect((err) => {
	if (err) throw err;

	console.log("--------");
	console.log("Welcome to the Employee Tracker!");
	console.log("--------");

	promptUser();
});

async function promptUser() {
	const answer = await inquirer.prompt({
		"type": "list",
		"name": "selection",
		"message": "What would you like to do?",
		"choices": [
			"View All Employees",
			"View All Employees by Manager",
			"Add Department",
			"Add Role",
			"Add Employee",
			"Delete Employee",
			"Update Employee Role",
			"Exit Application"
		]
	});

	switch (answer.selection) {
		case "View All Employees":
			viewAllEmployees();
			break;
		case "View All Employees by Manager":
			viewEmployeesbyManager();
			break;
		case "Add Department":
			addDepartment();
			break;
		case "Add Role":
			addRole();
			break;
		case "Add Employee":
			addEmployee();
			break;
		case "Delete Employee":
			deleteEmployee();
			break;
		case "Update Employee Role":
			updateRole();
			break;
		case "Exit Application":
			exitApplication();
			break;
	}
}

function viewAllEmployees() {
	let query = "SELECT worker.id AS 'ID', worker.first_name AS 'First Name', worker.last_name AS 'Last Name', role.title AS 'Role', department.name AS 'Department', ";
	query += "FORMAT(role.salary, 0) AS 'Salary', CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager' FROM employee worker ";
	query += "LEFT JOIN employee manager on (manager.id = worker.manager_id) INNER JOIN role ON (role.id = worker.role_id) ";
	query += "INNER JOIN department ON (department.id = role.department_id);";

	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log("\n" + cTable.getTable(res));
		promptUser();
	});
}

async function viewEmployeesbyManager() {
	let query = "SELECT worker.id AS 'ID', worker.first_name AS 'First Name', worker.last_name AS 'Last Name', role.title AS 'Role', department.name AS 'Department', ";
	query += "FORMAT(role.salary, 0) AS 'Salary', CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager' FROM employee worker ";
	query += "LEFT JOIN employee manager on (manager.id = worker.manager_id) INNER JOIN role ON (role.id = worker.role_id) ";
	query += "INNER JOIN department ON (department.id = role.department_id) ORDER BY manager.first_name, manager.last_name;";

	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log("\n" + cTable.getTable(res));
		promptUser();
	});
}

async function addDepartment() {
	const answer = await inquirer.prompt([
		{
			"type": "input",
			"name": "department",
			"message": "What department you would like to add?",
			"validate": (answer) => answer.length > 0
		}
	]);

	const query = "INSERT INTO department SET name = ?";
	const values = [answer.department];

	connection.query(query, values, (err) => {
		if (err) throw err;
		console.log("Successfuly added department!");
		promptUser();
	});
}

async function addRole() {
	const answer = await inquirer.prompt([
		{
			"type": "list",
			"name": "department",
			"message": "What department you would like to add to?",
			"choices": await getDepartments()
		},
		{
			"type": "input",
			"name": "role",
			"message": "What role would you like to add?",
			"validate": (answer) => answer.length > 0
		},
		{
			"type": "input",
			"name": "salary",
			"message": "What is the starting salary?",
			"validate": (answer) => answer.length > 0
		}
	]);

	const query = "INSERT INTO role SET ?";
	const values = [
		{
			title: answer.role,
			salary: answer.salary,
			department_id: await findDepartmentId(answer.department)
		}
	];

	connection.query(query, values, (err) => {
		if (err) throw err;
		console.log("Successfuly added role!");
		promptUser();
	});
}

async function addEmployee() {
	let employee = await inquirer.prompt([
		{
			"type": "input",
			"name": "firstName",
			"message": "What is the employee's first name?",
			"validate": (answer) => answer.length > 0
		},
		{
			"type": "input",
			"name": "lastName",
			"message": "What is the employee's last name?",
			"validate": (answer) => answer.length > 0
		},
		{
			"type": "list",
			"name": "department",
			"message": "What department is the employee in?",
			"choices": await getDepartments()
		},
	]);
	
	employee = Object.assign(employee, await inquirer.prompt([
		{
			"type": "list",
			"name": "role",
			"message": "What is the employee's role?",
			"choices": await getRoles(employee.department)
		},
		{
			"type": "list",
			"name": "manager",
			"message": "Who is the employee's current manager?",
			"choices": await getEmployees()
		}
	]));

	const query = "INSERT INTO employee SET ?"
	const values = [
		{
			first_name: employee.firstName,
			last_name: employee.lastName,
			role_id: await findRoleId(employee.role),
			manager_id: await findManagerId(employee.manager)
		}
	]

	connection.query(query, values, (err) => {
		if (err) throw err;
		viewAllEmployees();
	});
}

async function deleteEmployee() {
	const employee = await inquirer.prompt([
		{
			"type": "list",
			"name": "name",
			"message": "Which employee would you like to update?",
			"choices": await getEmployees()
		}
	]);

	const query = "DELETE FROM employee WHERE ? AND ?";
	const values = [
		{
			first_name: employee.name.split(' ')[0]
		},
		{
			last_name: employee.name.split(' ')[1]
		}
	];

	connection.query(query, values, (err) => {
		if (err) throw err;
		viewAllEmployees();
	});
}

async function updateRole() {
	let employee = await inquirer.prompt([
		{
			"type": "list",
			"name": "name",
			"message": "Which employee would you like to update?",
			"choices": await getEmployees()
		},
		{
			"type": "list",
			"name": "department",
			"message": "What department will the employee be in?",
			"choices": await getDepartments()
		}
	]);

	employee = Object.assign(employee, await inquirer.prompt([
		{
			"type": "list",
			"name": "role",
			"message": "What is the employee's role?",
			"choices": await getRoles(employee.department)
		}
	]));

	const query = "UPDATE employee SET ? WHERE ? AND ?";
	const values = [
		{
			role_id: await findRoleId(employee.role)
		},
		{
			first_name: employee.name.split(' ')[0]
		},
		{
			last_name: employee.name.split(' ')[1]
		}
	];

	connection.query(query, values, (err) => {
		if (err) throw err;
		viewAllEmployees();
	});
}

function getDepartments() {
	const query = "SELECT name FROM department ORDER BY id, name;";

	return new Promise((resolve) => {
		connection.query(query, (err, res) => {
			if (err) throw err;
			resolve(res.map(department => department.name));
		});
	});
}

async function getRoles(department) {
	const query = "SELECT title FROM role WHERE department_id = ? ORDER BY department_id, title;"
	const values = [await findDepartmentId(department)];

	return new Promise((resolve) => {
		connection.query(query, values, (err, res) => {
			if (err) throw err;
			resolve(res.map(role => role.title));
		});
	});
}

function getEmployees() {
	const query = "SELECT CONCAT(first_name, ' ', last_name) AS 'name' FROM employee ORDER BY id, first_name;";

	return new Promise((resolve) => {
		connection.query(query, (err, res) => {
			if (err) throw err;
			resolve(res.map(employee => employee.name));
		});
	});
}

function findDepartmentId(department) {
	const query = "SELECT id FROM department WHERE name = ?";
	const values = [department];

	return new Promise((resolve) => {
		connection.query(query, values, (err, res) => {
			if (err) throw err;
			resolve(res[0].id);
		});
	});
}

function findRoleId(role) {
	const query = "SELECT id FROM role WHERE title = ?";
	const values = [role];

	return new Promise((resolve) => {
		connection.query(query, values, (err, res) => {
			if (err) throw err;
			resolve(res[0].id);
		});
	});
}

function findManagerId(manager) {
	const query = "SELECT id FROM employee WHERE ? AND ?"
	const values = [
		{
			first_name: manager.split(' ')[0]
		},
		{
			last_name: manager.split(' ')[1]
		}
	];

	return new Promise((resolve) => {
		connection.query(query, values, (err, res) => {
			if (err) throw err;
			resolve(res[0].id);
		});
	});
}

function exitApplication() {
	console.log("--------");
	console.log("Exiting Application...");
	connection.end();
}
