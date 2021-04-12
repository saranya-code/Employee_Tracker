const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');


//connection information
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "employee_tracker_DB"
});

//Connection to sql DB
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    console.log('CONNECTED TO MYSQL SERVER');
    askQuestion()
});

async function askQuestion () {
    const question = await inquirer.prompt({
        message:"What would you like to do ? ",
        type:"list",
        name:"questionlist",
        choices:[
            'Add Department',
            'Add Role',
            'Add Employee',
            'View department',
            'View role',
            'View Employee',
            'Update Employee Role',
            // 'Update Employee Manager',
            // 'View Employee by Manager',
            // 'Delete Department',
            // 'Delete Role',
            // 'Delete Employee',  
            // 'View total utilized budget of a department',
            'Exit'
        ]
    })

    if(question.questionlist === 'Add Department') {
        const department = await addDepartment();
        console.log(department.department_name)
        askQuestion();
    }

    else if(question.questionlist === 'Add Role') {
        const role = await addRole();
        console.log(role.role_title);
        console.log(role.role_salary);
        const department= await getDepartment()
        const selectedDepartment= await chooseDepartment(department)   //
        addingRoleToDb(role.role_title,role.role_salary)
        
        askQuestion();
    }
    else if(question.questionlist === 'Add Employee') {
        const newemployee = await addNewEmployee();
        const roleListFromdb = await getRole()
        const selectedRole = await chooseRole(roleListFromdb)
        const managerListFromdb = await getManager();
        const selectedmanager = await chooseManager(managerListFromdb)
        // Need to insert newemployee,seleced role,selected manager
        askQuestion();
    }
    else if(question.questionlist === 'View department') {
        // view all department here viewDepartment()
        askQuestion();
    }
    else if(question.questionlist === 'View role') {
        // view all role here viewRole
        askQuestion();
    }
    else if(question.questionlist === 'View Employee') {
        // view all role here viewRole
        askQuestion();
    }
    else if(question.questionlist === 'Update Employee Role') {
        // update employee role  updateEmployeeRole
        askQuestion();
    }else{
        connection.end();
    }
}
//Add new department
function addDepartment(){
    return inquirer.prompt({
        message:'Enter the department name ?',
        type:'input',
        name:'department_name'
    })
}

// Adding new role & salary
function addRole(){
    return inquirer.prompt([
        {
            message:'Add a new role ?',
            type:'input',
            name:'role_title'
        },
        {
            message:'Add a new role salary ?',
            type:'input',
            name:'role_salary'
        },
    ])
}

//Add new employee
function addNewEmployee(){
    return inquirer.prompt([
        {
            message:'Add a new employee first name ?',
            type:'input',
            name:'firstname'
        },
        {
            message:'Add a new employee last name ?',
            type:'input',
            name:'lastname'
        },
    ])
}

//View department
function viewDepartment(){
    return inquirer.prompt([
        {
            message:'',        // view all department
            type:'list',
            name:'department'
        }
        
    ])
}

//View role
function viewRole(){
    return inquirer.prompt([
        {
            message:'',        // view all role
            type:'list',
            name:'view_role'
        }
        
    ])
}

//View Employee
function viewEmployee(){
    return inquirer.prompt([
        {
            message:'',        // view all role
            type:'list',
            name:'view_employee'
        }
        
    ])
}

//Update Employee role
function updateEmployeeRole(){
    return inquirer.prompt([
        {
            message:'',        // update employee role
            type:'list',
            name:'update_emp_role'
        }
        
    ])
}
//get role
function getRole(){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM role;`, function(error,result) {
            if (error) {
                return reject(error);
            }
            return  resolve(result);
        });
    });
}
//Choose role
function chooseRole(roleResponse){
    return inquirer.prompt(
        {
            message:'Choose a role ?',
            type:'list',
            name:'choose_role',
            choices: roleResponse.map(role => {
                return {title: role.title, id: role.id}
            }) // [{title:eng,id:5},{title:acc,id:3}]
        },
    )
}
 //get manager
 function getManager(){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM employee WHERE manager_id is NULL;`, function(error,result) {
            if (error) {
                return reject(error);
            }
            return  resolve(result);
        });
    });
}
//choose manager
function chooseManager(managerListFromdb){
    return inquirer.prompt(
        {
            message:'Choose a Manager ?',
            type:'list',
            name:'choose_manager',
            choices: managerListFromdb.map(manager => {
                return {managerName:manager.first_name, managerId: manager.id}
            }) // [{managerId:1}]
        },
    )
}

// Adding role to db
function addingRoleToDb(title,salary){
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO role SET ?`,
        {
            title:title,
             salary: salary,
             department_id: 555,
        }, function(error,result) {
            if (error) {
                return reject(error);
            }
            return  resolve(result);
        });
    });

}
//get department from DB

function getDepartment(){
    return new Promise((resolve,reject) =>{
        connection.query(`SELECT * FROM department;`,function(error,result){
            if(error){
                return reject(error);
            }
            return resolve(result);
        });
    });
}
//Choose department
function chooseDepartment(){
    return inquirer.prompt(
        {
            message:'Choose a Department ?',
            type:'list',
            name:'choose_department',
            choices: selectedDepartment.map(department => {
                return {name:department.name, id: department.id}
            }) // [{title:eng,id:5},{title:acc,id:3}]
        },
    )
}


