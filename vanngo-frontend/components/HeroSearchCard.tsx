import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ArrowUpDown, Search } from 'lucide-react-native';

interface HeroSearchCardProps {
    depart: string;
    arrivee: string;
    onChangeDepart: (text: string) => void;
    onChangeArrivee: (text: string) => void;
    onInverser: () => void;
    onRechercher: () => void;
}

export function HeroSearchCard({
    depart,
    arrivee,
    onChangeDepart,
    onChangeArrivee,
    onInverser,
    onRechercher,
}: HeroSearchCardProps) {
    return (
        <View className="bg-[#0F172A] p-5 rounded-3xl shadow-sm">
            {/* Micro-label */}
            <Text className="text-[11px] font-bold uppercase tracking-wider text-[#4ADE80] mb-1">
                VOTRE PROCHAIN TRAJET
            </Text>
            <Text className="text-white text-xl font-extrabold mb-4">
                Domicile ou UBS ?
            </Text>

            {/* Encart blanc de saisie avec bouton d'inversion */}
            <View className="bg-white rounded-2xl p-3.5 mb-4 relative justify-center">
                {/* Ligne Départ */}
                <View className="flex-row items-center gap-3 pb-2.5 border-b border-[#E2E8F0]">
                    {/* Point vert */}
                    <View className="w-3 h-3 rounded-full bg-[#15803D]" />
                    <View className="flex-1 pr-8">
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                            DÉPART
                        </Text>
                        <TextInput
                            value={depart}
                            onChangeText={onChangeDepart}
                            placeholder="Ex : Kercado, Vannes centre..."
                            placeholderTextColor="#94A3B8"
                            className="text-[15px] font-medium text-[#0F172A] p-0 mt-0.5"
                        />
                    </View>
                </View>

                {/* Ligne Destination */}
                <View className="flex-row items-center gap-3 pt-2.5">
                    {/* Carré bleu nuit */}
                    <View className="w-3 h-3 rounded-[3px] bg-[#0F172A]" />
                    <View className="flex-1 pr-8">
                        <Text className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                            DESTINATION
                        </Text>
                        <TextInput
                            value={arrivee}
                            onChangeText={onChangeArrivee}
                            placeholder="UBS - Campus Tohannic"
                            placeholderTextColor="#94A3B8"
                            className="text-[15px] font-medium text-[#0F172A] p-0 mt-0.5"
                        />
                    </View>
                </View>

                {/* Bouton d'inversion rapide */}
                <TouchableOpacity
                    onPress={onInverser}
                    activeOpacity={0.7}
                    className="absolute right-3 w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] items-center justify-center"
                >
                    <ArrowUpDown color="#0F172A" size={16} strokeWidth={2} />
                </TouchableOpacity>
            </View>

            {/* Bouton d'action primaire Vert Vann'Go */}
            <TouchableOpacity
                onPress={onRechercher}
                activeOpacity={0.85}
                className="bg-[#15803D] py-3.5 rounded-xl flex-row items-center justify-center gap-2"
            >
                <Search color="#FFFFFF" size={18} strokeWidth={2.2} />
                <Text className="text-white font-bold text-[15px]">Rechercher</Text>
            </TouchableOpacity>
        </View>
    );
}