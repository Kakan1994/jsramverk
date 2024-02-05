const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/your_database_file.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

module.exports = db;
