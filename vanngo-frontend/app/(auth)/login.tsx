import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, Car, UserCheck, ArrowRight } from 'lucide-react-native';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';
import { TypeProfil } from '../../types';

export default function LoginScreen() {
    const [isRegister, setIsRegister] = useState(false);
    const [typeProfil, setTypeProfil] = useState<TypeProfil>('passager');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');
    const { signIn } = useAuth();

    const handleSubmit = async () => {
        try {
            if (isRegister) {
                const res = await authService.register({
                    nom,
                    prenom,
                    email_univ: email,
                    mdp,
                    type_profil: typeProfil,
                });
                await signIn(
                    res.data.user || {
                        id_utilisateur: res.data.id,
                        nom,
                        prenom,
                        email_univ: email,
                        type_profil: typeProfil,
                    }
                );
            } else {
                const res = await authService.login(email, mdp);
                await signIn(res.data.user || res.data);
            }
        } catch (error: any) {
            Alert.alert(
                'Erreur de connexion',
                error.response?.data?.message || 'Vérifie tes identifiants (@univ-ubs.fr)'
            );
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logotype officiel avec zone de protection (marge autour du logo) */}
                <View className="mb-7 py-2">
                    <Logo variant="light" size="lg" />
                </View>

                {/* Micro-label & Titre H1 (Hero) */}
                <Text className="text-[11px] font-bold uppercase tracking-wider text-[#15803D] mb-1.5">
                    VOTRE CAMPUS, PLUS PROCHE
                </Text>
                <Text className="text-[30px] leading-[34px] font-extrabold text-[#0F172A] mb-2">
                    Rejoignez le mouvement.
                </Text>
                <Text className="text-[15px] leading-[22px] text-[#64748B] mb-6">
                    Crée ton compte et rends chaque trajet vers l'UBS Tohannic plus utile.
                </Text>

                {/* Carte conteneur du formulaire */}
                <View className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                    {/* Switch Connexion / Créer un compte */}
                    <View className="flex-row bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-xl mb-5">
                        <TouchableOpacity
                            onPress={() => setIsRegister(false)}
                            className={`flex-1 py-2.5 rounded-lg items-center ${!isRegister ? 'bg-white border border-[#E2E8F0]' : ''
                                }`}
                        >
                            <Text
                                className={`text-sm font-bold ${!isRegister ? 'text-[#0F172A]' : 'text-[#64748B]'
                                    }`}
                            >
                                Connexion
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setIsRegister(true)}
                            className={`flex-1 py-2.5 rounded-lg items-center ${isRegister ? 'bg-white border border-[#E2E8F0]' : ''
                                }`}
                        >
                            <Text
                                className={`text-sm font-bold ${isRegister ? 'text-[#0F172A]' : 'text-[#64748B]'
                                    }`}
                            >
                                Créer un compte
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {isRegister && (
                        <>
                            <Text className="text-xs font-bold text-[#0F172A] mb-2">
                                Je souhaite voyager comme
                            </Text>
                            <View className="flex-row gap-3 mb-4">
                                <TouchableOpacity
                                    onPress={() => setTypeProfil('passager')}
                                    className={`flex-1 py-3 px-3 rounded-xl border flex-row items-center justify-center gap-2 ${typeProfil === 'passager'
                                            ? 'border-[#15803D] bg-[#DCFCE7]'
                                            : 'border-[#E2E8F0] bg-white'
                                        }`}
                                >
                                    <UserCheck
                                        color={typeProfil === 'passager' ? '#15803D' : '#64748B'}
                                        size={18}
                                        strokeWidth={2}
                                    />
                                    <Text
                                        className={`font-bold text-sm ${typeProfil === 'passager' ? 'text-[#15803D]' : 'text-[#0F172A]'
                                            }`}
                                    >
                                        Passager
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setTypeProfil('conducteur')}
                                    className={`flex-1 py-3 px-3 rounded-xl border flex-row items-center justify-center gap-2 ${typeProfil === 'conducteur'
                                            ? 'border-[#15803D] bg-[#DCFCE7]'
                                            : 'border-[#E2E8F0] bg-white'
                                        }`}
                                >
                                    <Car
                                        color={typeProfil === 'conducteur' ? '#15803D' : '#64748B'}
                                        size={18}
                                        strokeWidth={2}
                                    />
                                    <Text
                                        className={`font-bold text-sm ${typeProfil === 'conducteur' ? 'text-[#15803D]' : 'text-[#0F172A]'
                                            }`}
                                    >
                                        Conducteur
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row gap-3 mb-3">
                                <TextInput
                                    placeholder="Prénom"
                                    placeholderTextColor="#94A3B8"
                                    value={prenom}
                                    onChangeText={setPrenom}
                                    className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-3 text-[15px] text-[#0F172A]"
                                />
                                <TextInput
                                    placeholder="Nom"
                                    placeholderTextColor="#94A3B8"
                                    value={nom}
                                    onChangeText={setNom}
                                    className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-3 text-[15px] text-[#0F172A]"
                                />
                            </View>
                        </>
                    )}

                    {/* Champ Email Universitaire */}
                    <Text className="text-xs font-bold text-[#0F172A] mb-1.5">
                        Adresse e-mail universitaire
                    </Text>
                    <View className="flex-row items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-3 mb-3.5 gap-2.5">
                        <Mail color="#64748B" size={18} strokeWidth={2} />
                        <TextInput
                            placeholder="prenom.nom@univ-ubs.fr"
                            placeholderTextColor="#94A3B8"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            className="flex-1 text-[15px] text-[#0F172A] p-0"
                        />
                    </View>

                    {/* Champ Mot de passe */}
                    <Text className="text-xs font-bold text-[#0F172A] mb-1.5">
                        Mot de passe
                    </Text>
                    <View className="flex-row items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-3 mb-6 gap-2.5">
                        <Lock color="#64748B" size={18} strokeWidth={2} />
                        <TextInput
                            placeholder="Saisis ton mot de passe"
                            placeholderTextColor="#94A3B8"
                            value={mdp}
                            onChangeText={setMdp}
                            secureTextEntry
                            className="flex-1 text-[15px] text-[#0F172A] p-0"
                        />
                    </View>

                    {/* Bouton Bleu Nuit (#0F172A) conforme à la charte */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        activeOpacity={0.85}
                        className="bg-[#0F172A] py-4 rounded-xl flex-row items-center justify-center gap-2"
                    >
                        <Text className="text-white font-bold text-[15px]">
                            {isRegister ? 'Créer mon compte' : 'Se connecter'}
                        </Text>
                        <ArrowRight color="#FFFFFF" size={18} strokeWidth={2.2} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}