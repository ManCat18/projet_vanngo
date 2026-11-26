import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { historiqueService } from '../../services/api';
import { HistoriqueTrajet } from '../../types';

export default function ImpactScreen() {
    const { user } = useAuth();
    const [historique, setHistorique] = useState<HistoriqueTrajet[]>([]);

    useEffect(() => {
        if (user) {
            historiqueService.getByUser(user.id_utilisateur).then((res) => setHistorique(res.data));
        }
    }, [user]);

    const totalCo2 = historique.reduce((acc, item) => acc + Number(item.co2_economise), 0).toFixed(1);

    return (
        <SafeAreaView className="flex-1 bg-bgLight px-5 pt-6">
            <Text className="text-2xl font-extrabold text-navy mb-4">Mon Impact Écologique</Text>

            <View className="bg-primary p-6 rounded-3xl mb-6 items-center">
                <Text className="text-green-100 text-sm font-medium">CO₂ total économisé</Text>
                <Text className="text-white text-4xl font-extrabold my-1">{totalCo2} kg</Text>
                <Text className="text-green-100 text-xs">{historique.length} trajet(s) partagé(s)</Text>
            </View>

            <Text className="text-lg font-bold text-navy mb-3">Historique des trajets</Text>
            <FlatList
                data={historique}
                keyExtractor={(item) => item.id_historique.toString()}
                renderItem={({ item }) => (
                    <View className="bg-white p-4 rounded-xl mb-2 flex-row justify-between">
                        <Text className="text-navy font-medium">{item.distance_km} km parcourus</Text>
                        <Text className="text-primary font-bold">-{item.co2_economise} kg CO₂</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}