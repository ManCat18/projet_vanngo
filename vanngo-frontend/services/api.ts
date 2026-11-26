import axios from 'axios';

// Remplace par l'IP locale de ta machine hébergeant Docker/Node.js
const API_URL = 'http://192.168.1.45:3309/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const authService = {
    login: (email_univ: string, mdp: string) =>
        api.post('/auth/login', { email_univ, mdp }),
    register: (data: {
        nom: string;
        prenom: string;
        email_univ: string;
        mdp: string;
        type_profil: 'conducteur' | 'passager';
    }) => api.post('/auth/register', data),
};

export const offresService = {
    getAll: () => api.get('/offres'),
    rechercher: (depart: string, arrivee: string, heure: string) =>
        api.get('/offres/recherche', { params: { depart, arrivee, heure } }),
    publier: (data: any) => api.post('/offres', data),
};

export const reservationsService = {
    reserver: (offre_id_offre: number, passager_id: number) =>
        api.post('/reservations', { offre_id_offre, passager_id }),
    getByUser: (id: number) => api.get(`/reservations/utilisateur/${id}`),
};

export const historiqueService = {
    getByUser: (id: number) => api.get(`/historique/utilisateur/${id}`),
};

export const vehiculesService = {
    getByUser: (id: number) => api.get(`/vehicules/utilisateur/${id}`),
    ajouter: (data: any) => api.post('/vehicules', data),
};