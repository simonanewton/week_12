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
			"View All Employees by Department",
			"View All Employees by Role",
			"Add Employee",
			"Exit Application"
		]
	});

	switch (answer.selection) {
		case "View All Employees":
			viewAllEmployees();
			break;
		case "View All Employees by Department":
			viewAllDepartments();
			break;
		case "View All Employees by Role":
			viewAllRoles();
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
	console.log("Viewing All Employees...");
	promptUser();
}

function viewAllDepartments() {
	console.log("Viewing All Employees by Department...");
	promptUser();
}

function viewAllRoles() {
	console.log("Viewing All Employees by Role...");
	promptUser();
}

function addEmployee() {
	console.log("Adding Employee...");
	promptUser();
}

function exitApplication() {
	console.log("--------");
	console.log("Exiting Application...");
	connection.end();
}
