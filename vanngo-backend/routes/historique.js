const express = require('express');
const router = express.Router();
const db = require('../db');

// Fonction pour calculer le CO2 économisé
function calculerCo2Economise(distanceKm, consommationL100, motorisation, nombreOccupants = 2) { 
    // Valeur par défaut de nombreOccupants à 2 si non fourni
    const facteursCarburant = {
        essence: 2.3,
        diesel: 2.7,
        hybride: 2.0,
        electrique: 0.2
    };

    const facteur = facteursCarburant[motorisation] || 2.3; // Valeur par défaut : essence

    const litresConsommes = (distanceKm * consommationL100) / 100;

    const co2TotalKg = litresConsommes * facteur;

    const co2EconomiseGlobal = co2TotalKg * (1 - (1 / nombreOccupants));

    return parseFloat(co2EconomiseGlobal.toFixed(1));
}

// AJOUTER UN TRAJET À L'HISTORIQUE AVEC CALCUL DE CO2 : POST /api/historique
router.post('/', (req, res) => {
    const { reservation_id_reservation, distance_km, nombre_occupants } = req.body;

    if (!reservation_id_reservation || !distance_km) {
        return res.status(400).json({ error: 'Informations incomplètes pour enregistrer l\'historique.' });
    }

    const queryInfos = `
        v.consommation, v.motorisation 
        FROM reservation r
        JOIN offre o ON r.offre_id_offre = o.id_offre
        JOIN vehicules v ON o.vehicules_id_vehicules = v.id_vehicules
        WHERE r.id_reservation = ?
    `;

    db.query(`SELECT ${queryInfos}`, [reservation_id_reservation], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Impossible de récupérer les caractéristiques du véhicule pour ce trajet.' });
        }

        const { consommation, motorisation } = results[0];

        const co2Economise = calculerCo2Economise(
            distance_km,
            consommation || 6.0,
            motorisation || 'essence',
            nombre_occupants || 2
        );

        const insertQuery = `
            INSERT INTO historique (reservation_id_reservation, distance_km, co2_economise, date_realisation) 
            VALUES (?, ?, ?, NOW())
        `;

        db.query(insertQuery, [reservation_id_reservation, distance_km, co2Economise], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'historique.' });
            }
            res.status(201).json({
                message: 'Trajet enregistré et bilan carbone calculé avec succès !',
                historiqueId: result.insertId,
                co2_economise_kg: co2Economise
            });
        });
    });
});

// RÉCUPÉRER L'HISTORIQUE ET STATISTIQUES D'UN UTILISATEUR : GET /api/historique/utilisateur/:id
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