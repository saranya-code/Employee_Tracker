const {connection} = require("./creds.js");

//Add department to Db
function addingDepartmentToDb(departmentname){
    connection.query('INSERT into department set ?',
    {
        name:departmentname
    },async function(error,result) {
        if (error) {
            throw error;
        }
        console.table('Successfully Added Department');
        console.table(await getDepartment());
    })
}

//Get department from DB
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