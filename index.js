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
			"Add Employee",
			"Exit Application"
		]
	});

	switch (answer.selection) {
		case "View All Employees":
			viewAllEmployees();
			break;
		case "Add Employee":
			addEmployee();
			break;
		case "Exit Application":
			exitApplication();
			break;
	}
}

function viewAllEmployees() {
	let query = "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Role', ";
	query += "department.name AS 'Department', role.salary AS 'Salary', employee.manager_id AS 'Manager' ";
	query += "FROM employee INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ";
	query += "ORDER BY employee.id, department.name, employee.first_name;"

	connection.query(query, (err, res) => {
		if (err) throw err;
		console.log("\n" + cTable.getTable(res));
		promptUser();
	});
}

async function addEmployee() {
	const employee = await inquirer.prompt([
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
			"choices": ["Sales", "Engineering", "Finance", "Legal"]
		},
		{
			"type": "list",
			"name": "role",
			"message": "What is the employee's role?",
			"choices": ["Sales Lead", "Lead Engineer", "Accountant", "Lawyer"]
		},
		{
			"type": "list",
			"name": "manager",
			"message": "Who is the employee's current manager?",
			"choices": ["Rishahb", "Dany", "Darko", "Logan"]
		}
	]);

	promptUser();
}

function exitApplication() {
	console.log("--------");
	console.log("Exiting Application...");
	connection.end();
}
