const {connection} = require("./creds.js");

//get role
function getRole(){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM role;`, function(error,result) {
            if (error) {
                return reject(error);
            }
            // console.log(result)
            return  resolve(result);
        });
    });
}

// Adding role to db
function addingRoleToDb(title,salary,selectedDepartment){
    connection.query(`INSERT into role set ?`,
    {
        title:title,
        salary: salary,
        department_id: selectedDepartment,
    }, function(error,result) {
        if (error) {
            throw error;
        }
        console.table(result);
    });
}

module.exports = {
    getRole,
    addingRoleToDb
}