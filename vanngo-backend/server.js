/**
 * @file Point d'entrée du serveur Vann'Go
 * @author Manon CATTANEO
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const authRoutes = require('./routes/auth');
const vehiculesRoutes = require('./routes/vehicules');
const offresRoutes = require('./routes/offres');
const reservationsRoutes = require('./routes/reservations');
const historiqueRoutes = require('./routes/historique');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * @description Enregistrer les routes avec leurs préfixes
 * @param {string} prefix - Le préfixe de la route
 * @param {Object} routes - Les routes à enregistrer
 * @throws {Error} - Erreur interne du serveur
 */
app.use('/api/auth', authRoutes);
app.use('/api/vehicules', vehiculesRoutes);
app.use('/api/offres', offresRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/historique', historiqueRoutes);

/**
 * @description Route de test basique
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @returns {Object} - La réponse JSON avec un message de bienvenue
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Tester l'API
 * GET /
 * Response: { "message": "Bienvenue sur l'API de Vann'Go !" }
 */
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API de Vann\'Go !' });
});

/**
 * @description Démarrage du serveur
 * @param {number} PORT - Le port sur lequel le serveur écoute
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Démarrer le serveur sur le port 3000
 * node server.js
 * Response: Serveur démarré sur le port 3000
 */
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});