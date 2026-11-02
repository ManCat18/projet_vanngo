const mysql = require('mysql2');
require('dotenv').config();

// Création de la connexion à la base de données
const connection = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'vanngo_db',
    port: process.env.DB_PORT || 3308
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données MySQL :', err);
        return;
    }
    console.log('Connecté avec succès à la base de données MySQL Vann\'Go !');
});

module.exports = connection;