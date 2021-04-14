const inquirer = require('inquirer');
const fs = require('fs');
const mysql = require('mysql');

//Connection information
const {connection} = require("./js/creds.js");
const {
        addingEmployeeToDb, 
        getEmployee, 
        updateEmployeeRoleToDB, 
        deleteEmployeeFromDb,
        viewEmployeeByManager,
        updateEmployeeManagerToDb,
        getManager
      } = require("./js/employee.js")

const {getRole, addingRoleToDb} = require("./js/role.js")
const {addingDepartmentToDb, getDepartment} = require("./js/department.js")


//Connection to sql DB
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    console.log('********** CONNECTED TO MYSQL SERVER ***********');
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
            'Update employee managers',
            'View Employee by Manager',
            'Delete Employee',
            'Exit'
        ]
    })

    if(question.questionlist === 'Add Department') {
        const department = await addDepartment();
        addingDepartmentToDb(department.department_name)
        askQuestion();
    }

    else if(question.questionlist === 'Add Role') {
        const role = await addRole();
        const departments = await getDepartment()
        const selectedDepartment= await chooseDepartment(departments)
        const selectedDepartmentId = await getId(selectedDepartment.choose_department)
        addingRoleToDb(role.role_title,role.role_salary, selectedDepartmentId)
        askQuestion();
    }
    else if(question.questionlist === 'Add Employee') {
        const newemployee = await addNewEmployee();
        const roleListFromdb = await getRole()
        const selectedRole = await chooseRole(roleListFromdb)
        const selectedRoleId = await getId(selectedRole.choose_role)
        const managerListFromdb = await getManager();
        const selectedmanager = await chooseManager(managerListFromdb)
        const selectedManagerId = await JSON.parse(getId(selectedmanager.choose_manager))
        addingEmployeeToDb(newemployee.firstname,newemployee.lastname,selectedRoleId,selectedManagerId)
        askQuestion();
    }
    else if(question.questionlist === 'View department') {
        const departmentListFromDb = await getDepartment()
        console.table(departmentListFromDb)
        askQuestion();
    }
    else if(question.questionlist === 'View role') {
        const roleListFromdb = await getRole()
        console.table(roleListFromdb)
        askQuestion();
    }
    else if(question.questionlist === 'View Employee') {
        const getEmployeeListFromDb = await getEmployee()
        console.table(getEmployeeListFromDb)
        askQuestion();
    }
    else if(question.questionlist === 'Update Employee Role') {
        const getEmployeeListFromDb = await getEmployee()
        const selectedEmpToUpdate = await chooseEmployee(getEmployeeListFromDb)
        const selectedEmpId = await getId(selectedEmpToUpdate.choose_Emp_To_Update)   
        const roleListFromdb = await getRole()
        const seletedUpdatedRole = await choseEmployeeRole(roleListFromdb)
        const selectedRoleId = await getId(seletedUpdatedRole.choose_emp_role)
        updateEmployeeRoleToDB(selectedRoleId,selectedEmpId)
        askQuestion();
    } 
    else if(question.questionlist === 'Update employee managers') {
        const getEmployeeListFromDb = await getEmployee()
        const filteredEmp = getEmployeeListFromDb.filter(emp => emp.manager_id != null)
        const selectedEmpToUpdate = await chooseEmployee(filteredEmp)
        const selectedEmpId = await getId(selectedEmpToUpdate.choose_Emp_To_Update)
        const managerListFromdb = await getManager();
        const selectedmanager = await chooseManager(managerListFromdb)
        const selectedManagerId = await getId(selectedmanager.choose_manager)
        updateEmployeeManagerToDb(selectedEmpId,selectedManagerId)
        askQuestion();
    }
    else if(question.questionlist === 'Delete Employee'){
        const getEmployeeListFromDb = await getEmployee()
        const selectedEmpToUpdate = await chooseEmployee(getEmployeeListFromDb)
        const selectedEmpId = await getId(selectedEmpToUpdate.choose_Emp_To_Update)
        deleteEmployeeFromDb(selectedEmpId)
        askQuestion();
    } 
    else if(question.questionlist === 'View Employee by Manager'){
        const managerListFromdb = await getManager();
        const selectedmanager = await chooseManager(managerListFromdb)
        const selectedManagerId = await getId(selectedmanager.choose_manager)
        viewEmployeeByManager(selectedManagerId)
        askQuestion();
    }
    else {
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

//Update Employee role
function choseEmployeeRole(roleList){
    return inquirer.prompt([
        {
            message:'choose a role to update',       
            type:'list',
            name:'choose_emp_role',
            choices: roleList.map(role=>`${role.id}-${role.title}`)
        }
        
    ])
}
//Choose Employee
function chooseEmployee(employeeList){
    return inquirer.prompt([
        {
            message:'Choose Employee',        
            type:'list',
            name:'choose_Emp_To_Update',
            choices: ()=> employeeList.map(employee=>`${employee.id}-${employee.first_name}`)
        }
        
    ])
}

//Choose role
function chooseRole(roleResponse){
    return inquirer.prompt(
        {
            message:'Choose a role ?',
            type:'rawlist',
            name:'choose_role',
            choices: () => roleResponse.map(role => `${role.id}-${role.title}`)
            
        },
    )
}

//choose manager
function chooseManager(managerListFromdb){
    return inquirer.prompt(
        {
            message:'Choose a Manager ?',
            type:'list',
            name:'choose_manager',
            choices: () => ['null-none',...managerListFromdb.map(manager => `${manager.id}-${manager.first_name}`)] 
        },
    )
}

//Choose department
function chooseDepartment(departments){
    return inquirer.prompt(
        {
            message:'Choose a Department ?',
            type:'list',
            name:'choose_department',
            choices: () => departments.map(department => `${department.id}-${department.name}`) 
        },
    )
}

function getId (text) {
    return text.split('-')[0]   
}