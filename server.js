const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mbindyo@1',
    database: 'obituary_platform'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.post('/submit_obituary', (req, res) => {
    const { name, date_of_birth, date_of_death, content, author } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-') + '-' + date_of_death;
    const query = 'INSERT INTO obituaries (name, date_of_birth, date_of_death, content, author, slug) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [name, date_of_birth, date_of_death, content, author, slug], (err, result) => {
        if (err) throw err;
        res.send('Obituary submitted successfully');
    });
});

app.get('/view_obituaries', (req, res) => {
    const query = 'SELECT * FROM obituaries';

    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('obituary_list', { obituaries: results });
    });
});

app.get('/sitemap.xml', (req, res) => {
    const query = 'SELECT slug FROM obituaries';
    db.query(query, (err, results) => {
        if (err) throw err;
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        results.forEach((obituary) => {
            sitemap += `<url><loc>http://localhost:3000/obituary/${obituary.slug}</loc></url>`;
        });
        sitemap += '</urlset>';
        fs.writeFileSync('sitemap.xml', sitemap);
        res.sendFile(__dirname + '/sitemap.xml');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
