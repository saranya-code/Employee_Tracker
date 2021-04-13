const {connection} = require("./creds.js");

//Add employee to Db
function addingEmployeeToDb(fn,ln,r,m){
    connection.query('INSERT into employee set ?',
    {
        first_name:fn,
        last_name:ln,
        role_id:r,
        manager_id:m
    },function(error,result) {
        if (error) {
            throw error;
        }
        console.table(result);
    })
}

//get employee from DB

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

//update Employee role
function updateEmployeeRoleToDB(roleId,empId){
    connection.query(`UPDATE employee set ? where ?`,
    [
        {role_id:roleId},
        {id:empId}
    ],
    function(error,result){
        if(error){
            throw error
        }
        console.table(result);
    });
}

//Delete Employee
function deleteEmployeeFromDb(empid){
    connection.query(`DELETE FROM employee WHERE ?;`,
    {
        id:empid
    },
    function(error,result){
        if(error){
            throw error
        }
        console.table(result);
    });
}

function viewEmployeeByManager(managerId) {
    connection.query(`SELECT * FROM employee WHERE ?;`,
    {
        manager_id:managerId
    },
    function(error,result){
        if(error){
            throw error
        }
        console.table(result);
    });
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

module.exports= {
    addingEmployeeToDb,
    getEmployee,
    updateEmployeeRoleToDB,
    deleteEmployeeFromDb,
    viewEmployeeByManager,
    getManager
}