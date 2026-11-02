const express = require('express');
const router = express.Router();
const db = require('../db');

// RÉSERVER UNE OFFRE : POST /api/reservations
router.post('/', (req, res) => {
    const { offre_id_offre, passager_id } = req.body;

    if (!offre_id_offre || !passager_id) {
        return res.status(400).json({ error: 'Informations manquantes pour effectuer la réservation.' });
    }

    const checkOfferQuery = 'SELECT place_disponible FROM offre WHERE id_offre = ?';
    db.query(checkOfferQuery, [offre_id_offre], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'Offre introuvable.' });
        }

        const places = results[0].place_disponible;
        if (places <= 0) {
            return res.status(400).json({ error: 'Désolé, il n\'y a plus de place disponible sur cette offre.' });
        }

        const insertQuery = `
      INSERT INTO reservation (offre_id_offre, passager_id, statut, date_resa) 
      VALUES (?, ?, 'attente', NOW())
    `;

        db.query(insertQuery, [offre_id_offre, passager_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erreur lors de la création de la réservation.' });
            }

            const updateOfferQuery = 'UPDATE offre SET place_disponible = place_disponible - 1 WHERE id_offre = ?';
            db.query(updateOfferQuery, [offre_id_offre], (updateErr) => {
                if (updateErr) {
                    console.error(updateErr);
                }
                res.status(201).json({
                    message: 'Réservation effectuée avec succès (en attente de validation) !',
                    reservationId: result.insertId
                });
            });
        });
    });
});

// RÉCUPÉRER LES RÉSERVATIONS D'UN UTILISATEUR (Passager ou Conducteur via ses offres) : GET /api/reservations/utilisateur/:id
router.get('/utilisateur/:id', (req, res) => {
    const userId = req.params.id;

    const query = `
    r.*, o.lieu_depart, o.lieu_arrivee, o.date_heure_depart, u.prenom as conducteur_prenom, u.nom as conducteur_nom
    FROM reservation r
    JOIN offre o ON r.offre_id_offre = o.id_offre
    JOIN utilisateur u ON o.conducteur_id = u.id_utilisateur
    WHERE r.passager_id = ?
  `;

    db.query(`SELECT ${query}`, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur lors de la récupération des réservations.' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;