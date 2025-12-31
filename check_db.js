const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./deadlines.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
});

db.all('SELECT * FROM deadlines', [], (err, rows) => {
    if (err) {
        console.error('Error:', err.message);
        return;
    }
    console.log('Deadlines in DB:');
    rows.forEach(row => {
        console.log(row);
    });
    db.close();
});