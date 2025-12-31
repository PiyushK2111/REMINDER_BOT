const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Database setup
const db = new sqlite3.Database('./deadlines.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS deadlines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            datetime TEXT NOT NULL,
            notified INTEGER DEFAULT 0
        )`);
    }
});

// API Routes
app.get('/api/deadlines', (req, res) => {
    db.all('SELECT * FROM deadlines ORDER BY datetime ASC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/deadlines', (req, res) => {
    const { name, datetime } = req.body;
    const datetimeISO = new Date(datetime).toISOString();
    db.run('INSERT INTO deadlines (name, datetime) VALUES (?, ?)', [name, datetimeISO], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, name, datetime: datetimeISO, notified: 0 });
    });
});

app.put('/api/deadlines/:id', (req, res) => {
    const id = req.params.id;
    const { notified } = req.body;
    db.run('UPDATE deadlines SET notified = ? WHERE id = ?', [notified, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Deadline updated', changes: this.changes });
    });
});

app.delete('/api/deadlines', (req, res) => {
    const now = new Date().toISOString();
    console.log('Deleting past deadlines before:', now);
    db.run('DELETE FROM deadlines WHERE datetime < ?', [now], function(err) {
        if (err) {
            console.error('Delete error:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Deleted', this.changes, 'past deadlines');
        res.json({ message: 'Past deadlines deleted', changes: this.changes });
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});