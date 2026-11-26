// app/(tabs)/profil.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

export default function ProfilScreen() {
    const { user, signOut } = useAuth();

    return (
        <SafeAreaView className="flex-1 bg-bgLight px-5 pt-6 justify-between pb-8">
            <View>
                <Text className="text-2xl font-extrabold text-navy mb-4">Mon Profil</Text>
                <View className="bg-white p-5 rounded-2xl">
                    <Text className="text-lg font-bold text-navy">{user?.prenom} {user?.nom}</Text>
                    <Text className="text-slate-500">{user?.email_univ}</Text>
                    <Text className="text-primary font-semibold capitalize mt-2">Rôle : {user?.type_profil}</Text>
                </View>
            </View>

            <TouchableOpacity onPress={signOut} className="bg-red-500 py-4 rounded-xl items-center">
                <Text className="text-white font-bold">Se déconnecter</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}