import React from "react";
import { View, Text } from "react-native";

export function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">Hoy</Text>
      <Text className="text-gray-500 mt-2">¿En qué vas a invertir tu energía?</Text>
    </View>
  );
}
