/**
 * @file Module de gestion de l'historique des trajets et du bilan carbone
 * @author Manon CATTANEO
 */
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @description Fonction pour calculer le CO2 économisé
 * @function calculerCo2Economise
 * @param {number} distanceKm - La distance en kilomètres
 * @param {number} consommationL100 - La consommation en litres pour 100 km
 * @param {string} motorisation - Le type de motorisation (essence, diesel, hybride, electrique)
 * @param {number} nombreOccupants - Le nombre d'occupants dans le véhicule
 * @returns {number} - Le CO2 économisé en kg
 * @throws {Error} - Si la motorisation n'est pas reconnue
 * @throws {Error} - Si la distance ou la consommation est négative
 * @throws {Error} - Si le nombre d'occupants est inférieur à 1
 * @example
 * // Calcul du CO2 économisé pour un trajet de 100 km avec une consommation de 6 L/100 km, motorisation essence et 2 occupants
 * const co2Economise = calculerCo2Economise(100, 6, 'essence', 2);
 */
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

/**
 * @description Route pour ajouter un trajet à l'historique avec calcul de CO2
 * @function historique/ajouter
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @returns {Object} - La réponse JSON avec le message de succès ou d'erreur
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Ajouter un trajet à l'historique
* {
*   "reservation_id_reservation": 1,
*   "distance_km": 100,
*   "nombre_occupants": 2
* }
 */
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

/**
 * @description Route pour récupérer l'historique et les statistiques d'un utilisateur
 * @function historique/utilisateur/:id
 * @param {Object} req - La requête HTTP
 * @param {Object} res - La réponse HTTP
 * @returns {Object} - La réponse JSON avec l'historique et les statistiques
 * @throws {Error} - Erreur interne du serveur
 * @example
 * // Récupérer l'historique et les statistiques d'un utilisateur
 * GET /api/historique/utilisateur/1
 */
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