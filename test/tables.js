
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/express-app.db');

db.serialize(function () {
    db.each("select name from sqlite_master where type='table'", function (err, table) {
        console.log(table);
    });
});
