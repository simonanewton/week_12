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
	const answers = await inquirer.prompt({
		"type": "list",
		"name": "selection",
		"message": "What would you like to do?",
		"choices": [
			"View All Employees",
			"Add Employee",
			"Update Employee Role",
			"Exit Application"
		]
	});

	switch (answers.selection) {
		case "View All Employees":
			viewAllEmployees();
			break;
		case "Add Employee":
			addEmployee();
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

async function addEmployee() {
	const answersA = await inquirer.prompt([
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

	const answersB = await inquirer.prompt([
		{
			"type": "list",
			"name": "role",
			"message": "What is the employee's role?",
			"choices": await getRoles(answersA.department)
		},
		{
			"type": "list",
			"name": "manager",
			"message": "Who is the employee's current manager?",
			"choices": await getEmployees()
		}
	]);

	const employee = {...answersA, ...answersB};

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

async function updateRole() {
	const answersA = await inquirer.prompt([
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

	const answersB = await inquirer.prompt([
		{
			"type": "list",
			"name": "role",
			"message": "What is the employee's role?",
			"choices": await getRoles(answersA.department)
		}
	]);

	const query = "UPDATE employee SET ? WHERE ? AND ?";
	const values = [
		{
			role_id: await findRoleId(answersB.role)
		},
		{
			first_name: answersA.name.split(' ')[0]
		},
		{
			last_name: answersA.name.split(' ')[1]
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
	const values = await findDepartmentId(department);

	return new Promise((resolve) => {
		connection.query(query, [values], (err, res) => {
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

	return new Promise((resolve) => {
		connection.query(query, [department], (err, res) => {
			if (err) throw err;
			resolve(res[0].id);
		});
	});
}

function findRoleId(role) {
	const query = "SELECT id FROM role WHERE title = ?";

	return new Promise((resolve) => {
		connection.query(query, [role], (err, res) => {
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
