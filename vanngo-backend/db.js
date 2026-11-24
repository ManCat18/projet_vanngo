/**
 * @file Module de gestion de la base de données
 * @author Manon CATTANEO
 */

const mysql = require('mysql2');
require('dotenv').config();

const isTestEnvironment = process.env.NODE_ENV === 'test';

/**
 * @description Création de la connexion à la base de données
 * @param {Object} options - Les options de connexion
 * @returns {Object} - La connexion à la base de données
 * @throws {Error} - Erreur de connexion à la base de données
 */
const connection = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'vanngo_db',
    port: process.env.DB_PORT || 3309
});

/**
 * @description Connexion à la base de données
 * @param {Object} err - L'erreur de connexion
 * @throws {Error} - Erreur de connexion à la base de données
 */
connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données MySQL :', err);
        return;
    }
    console.log('Connecté avec succès à la base de données MySQL Vann\'Go !');
});

module.exports = connection;