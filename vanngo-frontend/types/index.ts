export type TypeProfil = 'conducteur' | 'passager';

export interface Utilisateur {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email_univ: string;
    type_profil: TypeProfil;
}

export interface Vehicule {
    id_vehicules: number;
    utilisateur_id: number;
    marque: string;
    modele: string;
    motorisation: 'essence' | 'diesel' | 'hybride' | 'electrique';
    consommation: number;
}

export interface Offre {
    id_offre: number;
    conducteur_id: number;
    vehicules_id_vehicules: number;
    lieu_depart: string;
    lieu_arrivee: string;
    date_heure_depart: string;
    place_disponible: number;
    // Champs issus des JOIN SQL (Annexe 2)
    prenom?: string;
    nom?: string;
    marque?: string;
    modele?: string;
    ecart_temps_minutes?: number;
}

export interface HistoriqueTrajet {
    id_historique: number;
    reservation_id_reservation: number;
    distance_km: number;
    co2_economise: number;
    date_realisation: string;
}