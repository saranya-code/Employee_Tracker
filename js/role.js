const {connection} = require("./creds.js");

//Get role
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

// Adding role to DB
function addingRoleToDb(title,salary,selectedDepartment){
    connection.query(`INSERT INTO role set ?`,
    {
        title:title,
        salary: salary,
        department_id: selectedDepartment,
    }, async function(error,result) {
        if (error) {
            throw error;
        }
        console.table('Successfully Added New Role');
        console.table(await getRole());
    });
}

module.exports = {
    getRole,
    addingRoleToDb
}