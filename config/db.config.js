const mysql = require('mysql')

const dbconn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'user'
});

dbconn.connect((err) => {
    if(err) throw err;
    console.log('Database connected');
})

module.exports = dbconn;