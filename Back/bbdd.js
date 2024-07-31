var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "mysql-sosasandramabel.alwaysdata.net",
  user: "367907",
  password: "Sandra-1234",
  database: "sosasandramabel_rutasargentinas",
});

connection.connect();

module.exports = connection;
