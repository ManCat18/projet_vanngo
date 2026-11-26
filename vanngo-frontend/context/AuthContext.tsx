import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Utilisateur } from '../types';

interface AuthContextType {
    user: Utilisateur | null;
    signIn: (userData: Utilisateur) => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const storage = {
    getItem: async (key: string) =>
        Platform.OS === 'web' ? localStorage.getItem(key) : SecureStore.getItemAsync(key),
    setItem: async (key: string, value: string) =>
        Platform.OS === 'web' ? localStorage.setItem(key, value) : SecureStore.setItemAsync(key, value),
    removeItem: async (key: string) =>
        Platform.OS === 'web' ? localStorage.removeItem(key) : SecureStore.deleteItemAsync(key),
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Utilisateur | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        storage.getItem('vanngo_user').then((data) => {
            if (data) setUser(JSON.parse(data));
            setLoading(false);
        });
    }, []);

    const signIn = async (userData: Utilisateur) => {
        setUser(userData);
        await storage.setItem('vanngo_user', JSON.stringify(userData));
    };

    const signOut = async () => {
        setUser(null);
        await storage.removeItem('vanngo_user');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);