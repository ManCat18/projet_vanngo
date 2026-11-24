/**
 * @file Module de gestion des véhicules
 * @author Manon CATTANEO
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @description Route pour ajouter un véhicule
 * @function vehicules/
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @returns {Object} - La réponse JSON avec le message de succès ou d'erreur
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Ajouter un véhicule
 * POST /api/vehicules
 * {
 *   "utilisateur_id": 1,
 *   "marque": "Toyota",
 *   "modele": "Corolla",
 *   "motorisation": "essence",
 *   "consommation": 6.5
 * }
 */
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

/**
 * @description Route pour récupérer les véhicules d'un utilisateur
 * @function vehicules/utilisateur/:id
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @returns {Object} - La réponse JSON avec les véhicules de l'utilisateur
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Récupérer les véhicules d'un utilisateur
 * GET /api/vehicules/utilisateur/1
 */

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