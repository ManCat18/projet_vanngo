const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// ROUTE D'INSCRIPTION : /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { nom, prenom, email_univ, mdp, type_profil } = req.body;

        if (!prenom || !email_univ || !mdp || !type_profil) {
            return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires.' });
        }

        const checkEmailQuery = 'SELECT * FROM utilisateur WHERE email_univ = ?';
        db.query(checkEmailQuery, [email_univ], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur serveur lors de la vérification de l\'email.' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Cet email universitaire est déjà utilisé.' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(mdp, saltRounds);

            const insertQuery = `
        INSERT INTO utilisateur (nom, prenom, email_univ, mdp, type_profil, date_creation) 
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

            db.query(insertQuery, [nom || null, prenom, email_univ, hashedPassword, type_profil], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erreur lors de l\'inscription de l\'utilisateur.' });
                }
                res.status(201).json({
                    message: 'Utilisateur inscrit avec succès !',
                    userId: result.insertId
                });
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

// ROUTE DE CONNEXION : /api/auth/login
router.post('/login', (req, res) => {
    const { email_univ, mdp } = req.body;

    if (!email_univ || !mdp) {
        return res.status(400).json({ error: 'Veuillez renseigner votre email et votre mot de passe.' });
    }

    const query = 'SELECT * FROM utilisateur WHERE email_univ = ?';
    db.query(query, [email_univ], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const user = results[0];

        const isPasswordValid = await bcrypt.compare(mdp, user.mdp);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        res.status(200).json({
            message: 'Connexion réussie !',
            user: {
                id: user.id_utilisateur,
                prenom: user.prenom,
                nom: user.nom,
                email_univ: user.email_univ,
                type_profil: user.type_profil
            }
        });
    });
});

module.exports = router;