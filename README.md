# Unit 12 MySQL Homework: Employee Tracker

## Description

This CMS application utilizes a database constructed with MySQL that allows users to view, store, and delete employees so that they can manage their employee records. The inquirer npm package allows users to select different actions to preform on the database so that they can manipluate the stored data to their liking. The view functionality is managed by the console.table npm package that displays the output with a professional look so that the users can easily read the information pressented from the database.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Schema](#schema)
* [Credits](#credits)
* [License](#license)

## Installation

To install the required npm packages to run this application, run the following command:
```sh
npm install
```

## Usage

To use this application, run the following command:
```sh
npm start
```

## Schema

The MySQL database is constructed with the following parameters:

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager

![database schema](./assets/schema.png)

## Credits

* https://www.npmjs.com/package/inquirer
* https://www.npmjs.com/package/mysql
* https://www.npmjs.com/package/console.table

## License

![license](https://img.shields.io/badge/license-MIT-green)

MIT License

Copyright (c) [2020] [Simon Newton]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.