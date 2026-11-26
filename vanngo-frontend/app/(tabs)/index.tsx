import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { offresService, reservationsService } from '../../services/api';
import { Logo } from '../../components/Logo';
import { HeroSearchCard } from '../../components/HeroSearchCard';
import { OffreCard } from '../../components/OffreCard';
import { Offre } from '../../types';

export default function AccueilScreen() {
  const { user } = useAuth();
  const [depart, setDepart] = useState('');
  const [arrivee, setArrivee] = useState('UBS - Campus Tohannic');
  const [offres, setOffres] = useState<Offre[]>([]);

  const chargerOffres = async () => {
    try {
      const res = await offresService.getAll();
      setOffres(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    chargerOffres();
  }, []);

  const inverserTrajet = () => {
    setDepart(arrivee);
    setArrivee(depart);
  };

  const lancerRecherche = async () => {
    try {
      const maintenant = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const res = await offresService.rechercher(depart, arrivee, maintenant);
      setOffres(res.data);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de filtrer les trajets.');
    }
  };

  const handleReserver = async (idOffre: number) => {
    if (!user) return;
    try {
      await reservationsService.reserver(idOffre, user.id_utilisateur);
      Alert.alert('Réservation confirmée', 'Ta place est réservée !');
      chargerOffres();
    } catch (e) {
      Alert.alert('Erreur', 'Réservation impossible.');
    }
  };

  const initialesUser = `${user?.prenom?.[0] || 'M'}${user?.nom?.[0] || 'C'}`.toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <FlatList
        data={offres}
        keyExtractor={(item) => item.id_offre.toString()}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="mb-5">
            {/* En-tête : Logo + Badge initiales utilisateur */}
            <View className="flex-row items-center justify-between mb-5">
              <Logo variant="light" size="sm" />
              <View className="w-10 h-10 rounded-xl bg-[#DCFCE7] items-center justify-center">
                <Text className="text-[#15803D] font-extrabold text-xs">{initialesUser}</Text>
              </View>
            </View>

            {/* Titre H2 (Écran) */}
            <Text className="text-[13px] font-medium text-[#64748B]">Bonjour,</Text>
            <Text className="text-[24px] font-extrabold text-[#0F172A] mb-4">
              {user?.prenom || 'Manon'}
            </Text>

            {/* Composant signature 1 : Hero Search Card */}
            <HeroSearchCard
              depart={depart}
              arrivee={arrivee}
              onChangeDepart={setDepart}
              onChangeArrivee={setArrivee}
              onInverser={inverserTrajet}
              onRechercher={lancerRecherche}
            />

            {/* Titre H3 (Section) */}
            <Text className="text-[18px] font-bold text-[#0F172A] mt-6 mb-3">
              Trajets disponibles
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <OffreCard offre={item} onReserver={handleReserver} />
        )}
        ListEmptyComponent={
          <Text className="text-center text-[#64748B] mt-6">
            Aucun trajet disponible pour ce créneau.
          </Text>
        }
      />
    </SafeAreaView>
  );
}