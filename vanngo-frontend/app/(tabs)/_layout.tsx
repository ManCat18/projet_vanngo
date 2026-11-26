import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Leaf, Plus, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#15803D',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Home color={color} size={22} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="impact"
        options={{
          title: 'Impact',
          tabBarIcon: ({ color }) => <Leaf color={color} size={22} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="proposer"
        options={{
          title: 'Proposer',
          tabBarIcon: () => (
            <View className="w-10 h-10 rounded-xl bg-[#0F172A] items-center justify-center -mt-1">
              <Plus color="#FFFFFF" size={22} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User color={color} size={22} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}