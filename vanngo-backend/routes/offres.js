/**
 * @file Module de gestion des offres de covoiturage
 * @author Manon CATTANEO
 */
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @description Route de recherche intelligente d'offres de covoiturage
 * @function offres/recherche
 * @param {string} lieu_depart - Le lieu de départ recherché
 * @param {string} lieu_arrivee - Le lieu d'arrivée recherché
 * @param {string} date_souhaitee - La date souhaitée pour la recherche
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @returns {Object} - La réponse JSON avec les résultats de la recherche
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Rechercher des offres de covoiturage
 * GET /api/offres/recherche?lieu_depart=Paris&lieu_arrivee=Lyon&date_souhaitee=2024-06-15
 */
router.get('/recherche', (req, res) => {
    const { lieu_depart, lieu_arrivee, date_souhaitee } = req.query;

    const query = `
        SELECT o.*, u.prenom, u.nom, v.marque, v.modele,
            ABS(TIMESTAMPDIFF(MINUTE, o.date_heure_depart, ?)) AS ecart_temps_minutes
        FROM offre o
        JOIN utilisateur u ON o.conducteur_id = u.id_utilisateur
        JOIN vehicules v ON o.vehicules_id_vehicules = v.id_vehicules
        WHERE o.lieu_depart LIKE ? 
        AND o.lieu_arrivee LIKE ? 
        AND o.date_heure_depart >= NOW() 
        AND o.place_disponible > 0
        ORDER BY ecart_temps_minutes ASC
        LIMIT 10;
    `;

    const searchValueDepart = `%${lieu_depart || ''}%`;
    const searchValueArrivee = `%${lieu_arrivee || ''}%`;

    const dateFiltre = date_souhaitee || new Date();
    db.query(query, [dateFiltre, searchValueDepart, searchValueArrivee], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la recherche des offres.' });
        }
        res.status(200).json(results);
    });
});

/**
 * @description Route pour publier une offre de covoiturage
 * @function offres/publier
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @returns {Object} - La réponse JSON avec le message de succès ou d'erreur
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Publier une offre de covoiturage
 * POST /api/offres
 * {
 *  "conducteur_id": 1,
 *  "vehicules_id_vehicules": 2,
 *  "lieu_depart": "Paris",
 *  "lieu_arrivee": "Lyon",
 *  "date_heure_depart": "2024-06-15 08:00:00",
 *  "place_disponible": 3
 * }
 */
router.post('/', (req, res) => {
    const { conducteur_id, vehicules_id_vehicules, lieu_depart, lieu_arrivee, date_heure_depart, place_disponible } = req.body;

    if (!conducteur_id || !vehicules_id_vehicules || !lieu_depart || !lieu_arrivee || !date_heure_depart || !place_disponible) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs de l\'offre de covoiturage.' });
    }

    const query = `
        INSERT INTO offre (conducteur_id, vehicules_id_vehicules, lieu_depart, lieu_arrivee, date_heure_depart, place_disponible) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [conducteur_id, vehicules_id_vehicules, lieu_depart, lieu_arrivee, date_heure_depart, place_disponible], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la publication de l\'offre.' });
        }
        res.status(201).json({
            message: 'Offre de covoiturage publiée avec succès !',
            offreId: result.insertId
        });
    });
});

/**
 * @description Route pour récupérer toutes les offres disponibles 
 * @function offres/
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @returns {Object} - La réponse JSON avec les offres disponibles
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Récupérer toutes les offres disponibles
 * GET /api/offres
 */
router.get('/', (req, res) => {
    const query = `
        o.*, u.nom, u.prenom, v.marque, v.modele, v.motorisation 
        FROM offre o
        JOIN utilisateur u ON o.conducteur_id = u.id_utilisateur
        JOIN vehicules v ON o.vehicules_id_vehicules = v.id_vehicules
        WHERE o.date_heure_depart >= NOW() AND o.place_disponible > 0
    `;

    const fullQuery = `SELECT ${query}`;

    db.query(fullQuery, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des offres.' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;