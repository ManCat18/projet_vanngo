const request = require('supertest');
const express = require('express');
const cors = require('cors');
const db = require('../db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('../routes/auth'));
app.use('/api/vehicules', require('../routes/vehicules'));
app.use('/api/offres', require('../routes/offres'));
app.use('/api/reservations', require('../routes/reservations'));
app.use('/api/historique', require('../routes/historique'));

describe('Vann\'Go Backend Comprehensive Integration Tests', () => {
    let createdUserId;
    let createdVehiculeId;
    let createdOffreId;
    let createdReservationId;
    let passengerId;
    const uniqueEmail = `test.user.${Date.now()}@univ-ubs.fr`;
    const passEmail = `passager.${Date.now()}@univ-ubs.fr`;

    afterAll((done) => {
        db.end(done);
    });

    // 1. AUTHENTIFICATION
    describe('Auth Routes (/api/auth)', () => {
        test('POST /api/auth/register - Devrait inscrire un nouvel utilisateur', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    nom: 'TestNom',
                    prenom: 'TestPrenom',
                    email_univ: uniqueEmail,
                    mdp: 'MonMotDePasse123!',
                    type_profil: 'conducteur'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('userId');
            createdUserId = res.body.userId;
        });

        test('POST /api/auth/login - Devrait connecter l\'utilisateur avec succès', async () => {
            const res = await request(app)
            .post('/api/auth/login')
            .send({
                email_univ: uniqueEmail,
                mdp: 'MonMotDePasse123!'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email_univ).toEqual(uniqueEmail);
        });

        test('POST /api/auth/login - Échec avec mauvais mot de passe', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email_univ: uniqueEmail,
                    mdp: 'MauvaisMotDePasse'
                });

            expect(res.statusCode).toEqual(401);
        });
    });
    // 2. VEHICULES
    describe('Vehicules Routes (/api/vehicules)', () => {
        test('POST /api/vehicules - Devrait ajouter un véhicule pour l\'utilisateur', async () => {
            const res = await request(app)
                .post('/api/vehicules')
                .send({
                    utilisateur_id: createdUserId,
                    marque: 'Peugeot',
                    modele: '208',
                    motorisation: 'essence',
                    consommation: 5.8
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('vehiculeId');
            createdVehiculeId = res.body.vehiculeId;
        });

        test('GET /api/vehicules/utilisateur/:id - Devrait lister les véhicules de l\'utilisateur', async () => {
            const res = await request(app)
            .get(`/api/vehicules/utilisateur/${createdUserId}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].marque).toEqual('Peugeot');
        });
    });

    // 3. OFFRES
    describe('Offres Routes (/api/offres)', () => {
        test('POST /api/offres - Devrait publier une offre de covoiturage', async () => {
            const futureDate = new Date(Date.now() + 86400000).toISOString().slice(0, 19).replace('T', ' ');
            const res = await request(app)
                .post('/api/offres')
                .send({
                    conducteur_id: createdUserId,
                    vehicules_id_vehicules: createdVehiculeId,
                    lieu_depart: 'Lorient',
                    lieu_arrivee: 'Tohannic',
                    date_heure_depart: futureDate,
                    place_disponible: 3
                });

                expect(res.statusCode).toEqual(201);
                expect(res.body).toHaveProperty('offreId');
                createdOffreId = res.body.offreId;
        });

        test('GET /api/offres/recherche - Devrait trouver l\'offre avec la recherche multicritère', async () => {
            const res = await request(app)
                .get('/api/offres/recherche?lieu_depart=Lorient&lieu_arrivee=Tohannic');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].lieu_depart).toContain('Lorient');
        });

        test('GET /api/offres - Devrait lister toutes les offres disponibles', async () => {
            const res = await request(app).get('/api/offres');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });


    // 4. RESERVATIONS
    describe('Reservations Routes (/api/reservations)', () => {
        test('POST /api/auth/register (Passager) - Inscription second utilisateur', async () => {
            const regRes = await request(app)
                .post('/api/auth/register')
                .send({
                    nom: 'Pass',
                    prenom: 'Test',
                    email_univ: passEmail,
                    mdp: 'Pass123!',
                    type_profil: 'passager'
                });
            expect(regRes.statusCode).toEqual(201);
            passengerId = regRes.body.userId;
        });

        test('POST /api/reservations - Devrait réserver une place sur une offre', async () => {
            const res = await request(app)
                .post('/api/reservations')
                .send({
                    offre_id_offre: createdOffreId,
                    passager_id: passengerId
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('reservationId');
            createdReservationId = res.body.reservationId;
        });

        test('GET /api/reservations/utilisateur/:id - Devrait lister les réservations du passager', async () => {
            const res = await request(app).get(`/api/reservations/utilisateur/${passengerId}`);
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // 5. HISTORIQUE & CO2
    describe('Historique Routes (/api/historique)', () => {
        test('POST /api/historique - Devrait enregistrer un trajet et calculer le CO2', async () => {
            const res = await request(app)
                .post('/api/historique')
                .send({
                    reservation_id_reservation: createdReservationId,
                    distance_km: 30.0,
                    nombre_occupants: 2
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('historiqueId');
            expect(res.body).toHaveProperty('co2_economise_kg');
            expect(typeof res.body.co2_economise_kg).toBe('number');
        });

        test('GET /api/historique/utilisateur/:id - Devrait récupérer l\'historique utilisateur', async () => {
            const res = await request(app).get(`/api/historique/utilisateur/${createdUserId}`);
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });
})
