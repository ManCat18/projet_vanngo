const express = require('express');
const router = express.Router();
const db = require('../db');

// AJOUTER UN TRAJET À L'HISTORIQUE (après réalisation) : POST /api/historique
router.post('/', (req, res) => {
    const { reservation_id_reservation, distance_km, co2_economise, date_realisation } = req.body;

    if (!reservation_id_reservation || !distance_km) {
        return res.status(400).json({ error: 'Informations incomplètes pour enregistrer l\'historique.' });
    }

    const query = `
    INSERT INTO historique (reservation_id_reservation, distance_km, co2_economise, date_realisation) 
    VALUES (?, ?, ?, ?)
  `;

    db.query(query, [reservation_id_reservation, distance_km, co2_economise || 0.0, date_realisation || new Date()], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'historique.' });
        }
        res.status(201).json({
            message: 'Trajet enregistré dans l\'historique avec succès !',
            historiqueId: result.insertId
        });
    });
});

// RÉCUPÉRER L'HISTORIQUE ET STATISTIQUES CO2 D'UN UTILISATEUR : GET /api/historique/utilisateur/:id
router.get('/utilisateur/:id', (req, res) => {
    const userId = req.params.id;

    const query = `
    h.*, r.id_reservation, o.lieu_depart, o.lieu_arrivee 
    FROM historique h
    JOIN reservation r ON h.reservation_id_reservation = r.id_reservation
    JOIN offre o ON r.offre_id_offre = o.id_offre
    WHERE r.passager_id = ? OR o.conducteur_id = ?
  `;

    db.query(`SELECT ${query}`, [userId, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'historique.' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;