const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Importer tous les fichiers de routes
const authRoutes = require('./routes/auth');
const vehiculesRoutes = require('./routes/vehicules');
const offresRoutes = require('./routes/offres');
const reservationsRoutes = require('./routes/reservations');
const historiqueRoutes = require('./routes/historique');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Enregistrer les routes avec leurs préfixes
app.use('/api/auth', authRoutes);
app.use('/api/vehicules', vehiculesRoutes);
app.use('/api/offres', offresRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/historique', historiqueRoutes);

// Route de test basique
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API de Vann\'Go !' });
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});