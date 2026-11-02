const express = require('express');
const router = express.Router();
const db = require('../db');

// AJOUTER UN VÉHICULE : POST /api/vehicules
router.post('/', (req, res) => {
    const { utilisateur_id, marque, modele, motorisation, consommation } = req.body;

    if (!utilisateur_id || !marque || !modele || !motorisation) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires du véhicule.' });
    }

    const query = `
    INSERT INTO vehicules (utilisateur_id, marque, modele, motorisation, consommation) 
    VALUES (?, ?, ?, ?, ?)
  `;

    db.query(query, [utilisateur_id, marque, modele, motorisation, consommation || null], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de l\'ajout du véhicule.' });
        }
        res.status(201).json({
            message: 'Véhicule ajouté avec succès !',
            vehiculeId: result.insertId
        });
    });
});

// RÉCUPÉRER LES VÉHICULES D'UN UTILISATEUR : GET /api/vehicules/utilisateur/:id
router.get('/utilisateur/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT * FROM vehicules WHERE utilisateur_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des véhicules.' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;