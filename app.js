const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser'); 

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '192.168.1.70',
    user: 'root',
    password: 'onWorkStagingServer-pass69',
    database: 'testing_anshum',
    port: 3070
});

app.get('/dropdown', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('CALL testing_anshum.procedureanshum()');
        console.log(rows);
        connection.release();
        
        if (rows && rows.length > 0) {
            const countryNames = [];
            rows[0].forEach(obj => { 
                countryNames.push(obj.country);
            });

            console.log(countryNames);
            res.json(countryNames);
        } else {
            console.log("No rows returned from the database.");
            res.status(404).json({ error: "No data found" });
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
