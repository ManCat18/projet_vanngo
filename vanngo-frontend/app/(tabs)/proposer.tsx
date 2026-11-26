// app/(tabs)/proposer.tsx
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity,Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { offresService } from '../../services/api';

export default function ProposerScreen() {
    const { user } = useAuth();
    const [depart, setDepart] = useState('');
    const [arrivee, setArrivee] = useState('Tohannic');
    const [dateHeure, setDateHeure] = useState('2026-12-01 08:00:00');
    const [places, setPlaces] = useState('3');

    const handlePublier = async () => {
        if (!user) return;
        try {
            await offresService.publier({
                conducteur_id: user.id_utilisateur,
                vehicules_id_vehicules: 1, // À relier au sélecteur de véhicule de l'utilisateur
                lieu_depart: depart,
                lieu_arrivee: arrivee,
                date_heure_depart: dateHeure,
                place_disponible: Number(places),
            });
            Alert.alert('Publié', 'Votre offre est en ligne !');
        } catch (e) {
            Alert.alert('Erreur', 'Vérifiez que vous avez un véhicule enregistré.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-bgLight px-5 pt-6">
            <Text className="text-2xl font-extrabold text-navy mb-6">Proposer un trajet</Text>
            <TextInput placeholder="Lieu de départ" value={depart} onChangeText={setDepart} className="bg-white p-4 rounded-xl mb-3" />
            <TextInput placeholder="Destination" value={arrivee} onChangeText={setArrivee} className="bg-white p-4 rounded-xl mb-3" />
            <TextInput placeholder="Date/Heure (YYYY-MM-DD HH:MM:SS)" value={dateHeure} onChangeText={setDateHeure} className="bg-white p-4 rounded-xl mb-3" />
            <TextInput placeholder="Nombre de places" value={places} onChangeText={setPlaces} keyboardType="numeric" className="bg-white p-4 rounded-xl mb-6" />

            <TouchableOpacity onPress={handlePublier} className="bg-navy py-4 rounded-xl items-center">
                <Text className="text-white font-bold">Publier l'annonce</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}