// JavaScript source code
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hanumeshbg@2011",
    database:"myusers"
});

connection.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected successfully...");
    }
});

module.exports = connection;