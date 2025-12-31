const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./deadlines.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to SQLite database.');
});

console.log('Deleting all deadlines');

db.run('DELETE FROM deadlines', [], function(err) {
    if (err) {
        console.error('Delete error:', err.message);
        return;
    }
    console.log('Deleted', this.changes, 'deadlines');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});