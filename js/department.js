const {connection} = require("./creds.js");

//Add department to Db
function addingDepartmentToDb(departmentname){
    connection.query('INSERT into department set ?',
    {
        name:departmentname
    },function(error,result) {
        if (error) {
            throw error;
        }
        console.table(result);
    })
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

module.exports = {
    addingDepartmentToDb,
    getDepartment
}