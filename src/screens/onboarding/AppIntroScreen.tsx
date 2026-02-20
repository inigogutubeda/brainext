import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = { navigation: NativeStackNavigationProp<any> };

const STEPS = [
  { emoji: "☀️", title: "Mañana", subtitle: "Decides en qué inviertes tu energía" },
  { emoji: "🌙", title: "Noche", subtitle: "Reflexionas sobre lo que pasó" },
  { emoji: "📊", title: "Semana", subtitle: "Ajustas lo que vale la pena seguir" },
];

export function AppIntroScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-cream justify-between px-6 py-10">
      <View className="flex-1 justify-center">
        <Text className="text-3xl font-bold text-stone-900 mb-2 text-center">
          Así funciona tu día
        </Text>
        <Text className="text-base text-stone-500 mb-12 text-center">
          Tres momentos. Una pregunta: ¿estoy invirtiendo bien mi tiempo?
        </Text>

        <View className="gap-6">
          {STEPS.map((step) => (
            <View key={step.title} className="flex-row items-center bg-white rounded-2xl p-5 border border-stone-100">
              <Text className="text-3xl mr-4">{step.emoji}</Text>
              <View className="flex-1">
                <Text className="text-base font-semibold text-stone-900">{step.title}</Text>
                <Text className="text-sm text-stone-500">{step.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        className="bg-amber-600 rounded-2xl py-4 items-center"
        onPress={() => navigation.navigate("MorningFocus")}
      >
        <Text className="text-white font-semibold text-base">Empezar mi primer día →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
