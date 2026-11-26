import React from 'react';
import { View, Text } from 'react-native';
import { Leaf } from 'lucide-react-native';

interface LogoProps {
    variant?: 'light' | 'dark';
    size?: 'sm' | 'lg';
}

export function Logo({ variant = 'light', size = 'lg' }: LogoProps) {
    const isDark = variant === 'dark';
    const iconBoxSize = size === 'lg' ? 'w-10 h-10 rounded-xl' : 'w-8 h-8 rounded-lg';
    const textSize = size === 'lg' ? 'text-2xl' : 'text-xl';

    return (
        <View className="flex-row items-center gap-2.5">
            {/* Pictogramme végétal : feuille blanche sur carré arrondi Vert Vann'Go */}
            <View className={`${iconBoxSize} bg-[#15803D] items-center justify-center`}>
                <Leaf color="#FFFFFF" size={size === 'lg' ? 22 : 18} strokeWidth={2.2} />
            </View>

            {/* Logotype bicolore ExtraBold */}
            <Text className={`${textSize} font-extrabold tracking-tight`}>
                <Text className={isDark ? 'text-white' : 'text-[#0F172A]'}>Vann'</Text>
                <Text className={isDark ? 'text-[#4ADE80]' : 'text-[#15803D]'}>Go</Text>
            </Text>
        </View>
    );
}