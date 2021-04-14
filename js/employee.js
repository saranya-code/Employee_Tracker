const {connection} = require("./creds.js");

//Add employee to Db
function addingEmployeeToDb(fn,ln,r,m){
    connection.query('INSERT into employee set ?',
    {
        first_name:fn,
        last_name:ln,
        role_id:r,
        manager_id:m
    },async function(error,result) {
        if (error) {
            throw error;
        }
        console.table('Successfully Added Employee');
        console.table(await getEmployee());
    })
}

//Get employee from DB
function getEmployee(){
    return new Promise((resolve,reject) =>{
        connection.query(`SELECT * FROM employee;`,function(error,result){
            if(error){
                return reject(error);
            }
            return resolve(result);
        });
    });
}

//Update Employee role
function updateEmployeeRoleToDB(roleId,empId){
    connection.query(`UPDATE employee set ? where ?`,
    [
        {role_id:roleId},
        {id:empId}
    ],
    async function(error,result){
        if(error){
            throw error
        }
        console.table('Successfully Updated Employee Role');
        console.table(await getEmployee());
        
    });
}
//Update Employee by manager
function updateEmployeeManagerToDb(empId,managerId){
    connection.query(`UPDATE employee set ? where ?`,
    [
        {manager_id:managerId},
        {id:empId}
    ],
    async function(error,result){
        if(error){
            throw error
        }
        console.table('Successfully Updated Employee Manager');
        console.table(await getEmployee());
    });
}

//Delete Employee
function deleteEmployeeFromDb(empid){
    connection.query(`DELETE FROM employee WHERE ?;`,
    {
        id:empid
    },
    async function(error,result){
        if(error){
            throw error
        }
        console.table('Successfully Deleted Employe');
        console.table(await getEmployee());
    });
}

//View Employee by Manager
function viewEmployeeByManager(managerId) {
    connection.query(`select 
    e.id, 
    e.first_name, 
    e.last_name, 
    r.title, 
    r.salary, 
    d.name, 
    m.first_name as manager_first_name, 
    m.last_name as manager_last_name
    from 
    employee e LEFT JOIN employee m ON e.manager_id = m.id, role r, department d where 
    e.role_id = r.id and 
    r.department_id = d.id and 
    e.manager_id = m.id and m.id =${managerId};`,
          function(error,result) {
          if (error) throw error;
            // Table all results of the SELECT statement
            console.table(result);
        });
}

 //Get manager
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

module.exports= {
    addingEmployeeToDb,
    getEmployee,
    updateEmployeeRoleToDB,
    deleteEmployeeFromDb,
    viewEmployeeByManager,
    updateEmployeeManagerToDb,
    getManager
}