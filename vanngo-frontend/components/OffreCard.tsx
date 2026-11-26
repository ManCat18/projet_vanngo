import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Offre } from '../types';

interface OffreCardProps {
    offre: Offre;
    onReserver: (idOffre: number) => void;
}

export function OffreCard({ offre, onReserver }: OffreCardProps) {
    const heure = new Date(offre.date_heure_depart).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // Génération des initiales (ex: "Louis" + "Martin" -> "LM")
    const initiales = `${offre.prenom?.[0] || ''}${offre.nom?.[0] || ''}`.toUpperCase();
    const dernierePlace = offre.place_disponible === 1;

    return (
        <View className="bg-white border border-[#E2E8F0] rounded-2xl p-4 mb-3">
            {/* Ligne supérieure : Badge initiales + Nom/Itinéraire + Heure */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                    {/* Badge carré à initiales (arrondi 12px / rounded-xl) */}
                    <View className="w-11 h-11 rounded-xl bg-[#DCFCE7] items-center justify-center">
                        <Text className="text-[#15803D] font-extrabold text-sm">
                            {initiales || 'VG'}
                        </Text>
                    </View>

                    {/* Identité conducteur & itinéraire synthétique */}
                    <View className="flex-1">
                        <Text className="text-[16px] font-bold text-[#0F172A]" numberOfLines={1}>
                            {offre.prenom} {offre.nom ? `${offre.nom[0]}.` : ''}
                        </Text>
                        <Text className="text-[13px] text-[#64748B] mt-0.5" numberOfLines={1}>
                            {offre.lieu_depart} {'>'} {offre.lieu_arrivee}
                        </Text>
                    </View>
                </View>

                {/* Heure de départ en 18px Bold à droite */}
                <Text className="text-[18px] font-bold text-[#0F172A]">{heure}</Text>
            </View>

            {/* Ligne inférieure : Places disponibles (couleur sémantique si 1 place) + Bouton Réserver */}
            <View className="flex-row items-center justify-between mt-3.5 pt-3 border-t border-[#E2E8F0]">
                <Text
                    className={`text-xs font-semibold ${dernierePlace ? 'text-[#D97706]' : 'text-[#64748B]'
                        }`}
                >
                    {dernierePlace
                        ? '⚠️ Dernière place disponible'
                        : `${offre.place_disponible} places disponibles`}
                </Text>

                <TouchableOpacity
                    onPress={() => onReserver(offre.id_offre)}
                    activeOpacity={0.85}
                    className="bg-[#15803D] px-4 py-2 rounded-xl"
                >
                    <Text className="text-white font-bold text-xs">Réserver</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}